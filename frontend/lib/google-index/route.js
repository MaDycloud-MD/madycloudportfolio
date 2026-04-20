// app/api/google-index/route.js
import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const PAGES = [
  'https://madycloud.me',
];

export async function POST(request) {
  // Verify the request is coming from your Vercel webhook secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.INDEXING_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse the service account key from env
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const results = await Promise.allSettled(
      PAGES.map((url) =>
        fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.token}`,
          },
          body: JSON.stringify({
            url,
            type: 'URL_UPDATED',
          }),
        }).then((res) => res.json())
      )
    );

    const summary = results.map((result, i) => ({
      url: PAGES[i],
      status: result.status,
      ...(result.status === 'fulfilled'
        ? { response: result.value }
        : { error: result.reason?.message }),
    }));

    console.log('[Google Indexing] Results:', JSON.stringify(summary, null, 2));

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('[Google Indexing] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}