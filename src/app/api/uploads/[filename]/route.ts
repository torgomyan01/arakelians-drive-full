import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { UPLOAD_CONFIG } from '@/utils/upload-config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: prevent directory traversal
    if (
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      return NextResponse.json(
        { error: 'Անվավեր ֆայլի անուն' },
        { status: 400 }
      );
    }

    const filepath = join(UPLOAD_CONFIG.UPLOAD_DIR, filename);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: 'Ֆայլը չի գտնվել' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filepath);

    // Determine content type based on file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };

    const contentType = contentTypeMap[ext || ''] || 'application/octet-stream';

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: error.message || 'Սխալ է տեղի ունեցել' },
      { status: 500 }
    );
  }
}
