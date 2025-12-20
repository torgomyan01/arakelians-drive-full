# Ադմինի Կարգավորում

## Նախապատրաստում

1. **Prisma Migration** - Ավելացրեք User մոդելը բազայում:

```bash
npx prisma migrate dev --name add_user_model
```

2. **Prisma Client Generation** - Գեներացրեք Prisma client-ը:

```bash
npx prisma generate
```

3. **Environment Variables** - Համոզվեք, որ `.env` ֆայլում կա `NEXTAUTH_SECRET`:

```env
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=your-database-url
```

## Ադմինի օգտատիրոջ ստեղծում

Ստեղծեք առաջին ադմին օգտատիրոջը հետևյալ հրամանով:

```bash
npm run create-admin <email> <password> [name]
```

Օրինակ:

```bash
npm run create-admin admin@example.com mypassword123 "Admin User"
```

Կամ ուղղակի:

```bash
node scripts/create-admin.js admin@example.com mypassword123 "Admin User"
```

## Մուտք

1. Բացեք `/admin/login` էջը
2. Մուտքագրեք ձեր email և password
3. Հաջող մուտքից հետո կուղղորդվեք `/admin` էջ

## Կառուցվածք

- **Login Page**: `/admin/login` - Ադմինի մուտքի էջ
- **Dashboard**: `/admin` - Ադմինի վահանակ
- **API Route**: `/api/auth/[...nextauth]` - NextAuth API endpoint
- **Auth Config**: `src/lib/auth.ts` - NextAuth կարգավորումներ
- **Middleware**: `src/middleware.ts` - Route պաշտպանություն

## Database Schema

User մոդելը պարունակում է:

- `id` - Unique identifier
- `email` - Email (unique)
- `name` - Անուն
- `password` - Հեշավորված գաղտնաբառ
- `role` - Դեր (`admin` կամ `user`)
- `createdAt` - Ստեղծման ամսաթիվ
- `updatedAt` - Թարմացման ամսաթիվ
