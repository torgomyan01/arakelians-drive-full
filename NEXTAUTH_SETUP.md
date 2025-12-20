# NextAuth Configuration Error Fix

## Problem

Եթե ստանում եք `Configuration` error NextAuth-ում, դա նշանակում է, որ `NEXTAUTH_SECRET` environment variable-ը չի սահմանված:

## Solution

### Vercel-ում Environment Variables սահմանել

1. Գնացեք Vercel Dashboard → Your Project → Settings → Environment Variables

2. Ավելացրեք հետևյալ variables-ները:

   **NEXTAUTH_SECRET**

   ```
   Generate secret: openssl rand -base64 32
   ```

   **NEXTAUTH_URL**

   ```
   https://arakelians-drive-full.vercel.app
   ```

   **DATABASE_URL**

   ```
   mysql://user:password@host:port/database
   ```

3. **Important**: Համոզվեք, որ variables-ները սահմանված են **Production**, **Preview**, և **Development** environments-ի համար:

4. Redeploy project-ը Vercel-ում:

### Local Development

`.env.local` file-ում ավելացրեք:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your-database-url
```

## Generate Secret Key

```bash
openssl rand -base64 32
```

## Verify

Deploy-ից հետո ստուգեք, որ:

1. `/admin/login` էջը բացվում է
2. Login-ից հետո redirect է լինում `/admin` էջ
3. Error page-ը չի ցուցադրվում

## Common Issues

- **Configuration Error**: NEXTAUTH_SECRET-ը չի սահմանված
- **Database Error**: DATABASE_URL-ը սխալ է կամ չի սահմանված
- **Redirect Loop**: NEXTAUTH_URL-ը սխալ է
