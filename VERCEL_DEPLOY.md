# Vercel Deployment Guide

## Environment Variables

Համոզվեք, որ Vercel-ում սահմանված են հետևյալ environment variables-ները:

### Required Variables

1. **DATABASE_URL** - MySQL database connection string

   ```
   mysql://user:password@host:port/database
   ```

2. **NEXTAUTH_SECRET** - NextAuth secret key (generate with: `openssl rand -base64 32`)

   ```
   your-generated-secret-key-here
   ```

3. **NEXTAUTH_URL** - Your production URL
   ```
   https://your-domain.vercel.app
   ```

## Vercel Settings

1. **Build Command**: `npm run build` (already includes `prisma generate`)
2. **Install Command**: `npm install` (will run `postinstall` script automatically)
3. **Output Directory**: `.next` (default)

## Database Migration

Production database-ում պետք է աշխատեցնել migrations:

```bash
# Local-ում
npx prisma migrate deploy
```

Կամ Vercel-ի build-ի ժամանակ ավտոմատ migration-ի համար ավելացրեք build script-ում:

```json
"build": "prisma migrate deploy && prisma generate && next build"
```

## Troubleshooting

### Server Error on /admin

1. **Check Environment Variables**: Համոզվեք, որ բոլոր environment variables-ները սահմանված են Vercel-ում
2. **Check Database Connection**: Ստուգեք, որ DATABASE_URL-ը ճիշտ է
3. **Check Prisma Client**: Համոզվեք, որ Prisma client-ը generate է արվել (`postinstall` script)
4. **Check Database Schema**: Համոզվեք, որ database-ում կան բոլոր table-ները

### Common Issues

- **Missing NEXTAUTH_SECRET**: Սահմանեք Vercel-ի Environment Variables-ում
- **Database Connection Error**: Ստուգեք DATABASE_URL-ը
- **Prisma Client Error**: Համոզվեք, որ `postinstall` script-ը աշխատում է

## Build Logs

Vercel-ի build logs-ում պետք է տեսնեք:

```
Running "prisma generate"
```

## Production Database Setup

1. Ստեղծեք production database
2. Սահմանեք DATABASE_URL-ը Vercel-ում
3. Աշխատեցրեք migrations:
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```
4. Ստեղծեք admin user:
   ```bash
   DATABASE_URL="your-production-url" npm run create-admin admin@example.com password123
   ```
