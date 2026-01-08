import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { UPLOAD_CONFIG } from '@/utils/upload-config';

// Set runtime to nodejs for file system operations
export const runtime = 'nodejs';

// Increase max duration for large file uploads
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Ֆայլ չի գտնվել' }, { status: 400 });
    }

    // Validate file type
    if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Միայն նկարներ են թույլատրված (JPG, PNG, GIF, WEBP)' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Ֆայլի չափը չպետք է գերազանցի ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${randomStr}_${originalName}`;

    // Ensure upload directory exists (outside build directory)
    const uploadDir = UPLOAD_CONFIG.UPLOAD_DIR;
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const { join } = await import('path');
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Generate full URL that works both locally and on server
    const imageUrl = UPLOAD_CONFIG.getImageUrl(filename);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      path: `${UPLOAD_CONFIG.PUBLIC_PATH}/${filename}`,
      filename: filename,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Սխալ է տեղի ունեցել' },
      { status: 500 }
    );
  }
}
