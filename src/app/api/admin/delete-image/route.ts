import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { UPLOAD_CONFIG } from '@/utils/upload-config';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Ֆայլի անունը պարտադիր է' },
        { status: 400 }
      );
    }

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

    // Delete file
    await unlink(filepath);

    return NextResponse.json({
      success: true,
      message: 'Ֆայլը հաջողությամբ ջնջվեց',
    });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: error.message || 'Սխալ է տեղի ունեցել' },
      { status: 500 }
    );
  }
}
