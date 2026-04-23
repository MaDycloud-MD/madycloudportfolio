// frontend/app/lib/download-resume/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume`, {
      cache: 'no-store', 
    });
    const json = await apiRes.json();

    if (!json.success || !json.data?.url) {
      return NextResponse.json({ error: 'No resume available' }, { status: 404 });
    }

    const { url, filename } = json.data;

    const pdfRes = await fetch(url);
    if (!pdfRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch resume from storage' }, { status: 502 });
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    const safeFilename = filename.replace(/"/g, '\\"'); 

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length':      String(pdfBuffer.byteLength),
        'Cache-Control':       'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}