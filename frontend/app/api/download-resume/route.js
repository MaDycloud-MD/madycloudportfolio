// frontend/app/api/download-resume/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Ask your backend for the current resume URL + filename
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume`, {
      cache: 'no-store', // always get the latest
    });
    const json = await apiRes.json();

    if (!json.success || !json.data?.url) {
      return NextResponse.json({ error: 'No resume available' }, { status: 404 });
    }

    const { url, filename } = json.data;

    // 2. Fetch the actual PDF from Cloudinary (server-side, no CORS issues)
    const pdfRes = await fetch(url);
    if (!pdfRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch resume from storage' }, { status: 502 });
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    // 3. Stream it back to the browser with headers that force a download
    //    Using the exact original filename stored in your DB
    const safeFilename = filename.replace(/"/g, '\\"'); // escape quotes in header

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length':      String(pdfBuffer.byteLength),
        // Prevent the browser from caching a stale file
        'Cache-Control':       'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}