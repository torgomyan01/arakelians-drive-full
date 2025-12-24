# Login Troubleshooting Guide

## Problem: Login չի գործում Vercel-ում

### 1. Ստուգեք Database Connection

Vercel-ի Function Logs-ում ստուգեք, թե արդյոք database connection-ը աշխատում է:

**Vercel Dashboard → Project → Logs → Functions**

Պետք է տեսնեք:

```
[NextAuth] Attempting login for: your-email@example.com
```

Եթե տեսնում եք database connection error, ստուգեք `DATABASE_URL` environment variable-ը:

### 2. Ստուգեք User-ը Database-ում

Production database-ում պետք է լինի admin user:

```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
```

### 3. Ստեղծեք Admin User Production Database-ում

**Option 1: Vercel CLI-ով**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set DATABASE_URL
vercel env add DATABASE_URL

# Run script with production DATABASE_URL
DATABASE_URL="your-production-url" node scripts/create-admin.js admin@example.com password123 "Admin User"
```

**Option 2: Direct Database Connection**

```bash
# Connect to your production database
mysql -h your-host -u your-user -p your-database

# Then run:
DATABASE_URL="mysql://user:password@host:port/database" node scripts/create-admin.js admin@example.com password123 "Admin User"
```

### 4. Ստուգեք Environment Variables

Vercel Dashboard → Settings → Environment Variables:

- ✅ `DATABASE_URL` - MySQL connection string
- ✅ `NEXTAUTH_SECRET` - Secret key
- ✅ `NEXTAUTH_URL` - `https://arakelians-drive-full.vercel.app`

### 5. Ստուգեք Browser Console

Browser-ի Developer Tools → Console-ում պետք է տեսնեք:

```
Login result: { ok: true } // Success
Login result: { error: 'CredentialsSignin' } // Wrong credentials
```

### 6. Common Issues

**Issue: "User not found"**

- User-ը չկա database-ում
- Email-ը սխալ է
- Database connection-ը չի աշխատում

**Issue: "Invalid password"**

- Password-ը սխալ է
- Password hash-ը չի match անում

**Issue: "Database connection error"**

- `DATABASE_URL`-ը սխալ է
- Database server-ը unavailable է
- Firewall-ը block է անում connection-ը

### 7. Debug Steps

1. **Check Vercel Logs**:
   - Vercel Dashboard → Project → Logs
   - Look for `[NextAuth]` logs

2. **Check Database**:

   ```sql
   SELECT id, email, role FROM users;
   ```

3. **Test Connection**:

   ```bash
   DATABASE_URL="your-url" npx prisma studio
   ```

4. **Create User Again**:
   ```bash
   DATABASE_URL="your-url" npm run create-admin admin@example.com password123
   ```

### 8. Reset Password

Եթե password-ը մոռացել եք, ստեղծեք նոր user կամ update արեք existing user-ի password-ը:

```bash
DATABASE_URL="your-url" node scripts/create-admin.js admin@example.com newpassword123
```

## Quick Fix

1. Ստուգեք Vercel Logs-ում error messages-ները
2. Համոզվեք, որ user-ը կա database-ում
3. Ստեղծեք user-ը production database-ում
4. Redeploy project-ը
