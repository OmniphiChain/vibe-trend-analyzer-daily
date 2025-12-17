# Database Setup Guide

## Quick Start (3 Options)

### Option 1: Neon (Recommended - Serverless PostgreSQL)

1. **Sign up for Neon** (Free tier available)
   - Go to https://neon.tech
   - Create a free account
   - Create a new project

2. **Get your connection string**
   - Copy the connection string from your Neon dashboard
   - It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

3. **Update your .env file**
   ```bash
   DATABASE_URL=your-neon-connection-string-here
   ```

4. **Push your schema to the database**
   ```bash
   npm run db:push
   ```

5. **Start your server**
   ```bash
   npm run dev
   ```

---

### Option 2: Supabase (Free PostgreSQL + Auth)

1. **Sign up for Supabase**
   - Go to https://supabase.com
   - Create a free account
   - Create a new project

2. **Get connection string**
   - Go to Project Settings → Database
   - Copy the "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Update .env**
   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```

4. **Push schema**
   ```bash
   npm run db:push
   ```

---

### Option 3: Local PostgreSQL

1. **Install PostgreSQL**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL**
   ```bash
   # Mac/Linux
   brew services start postgresql
   # or
   sudo service postgresql start
   
   # Windows - it starts automatically after install
   ```

3. **Create database**
   ```bash
   psql -U postgres
   CREATE DATABASE vibe_trend_analyzer;
   \q
   ```

4. **Update .env**
   ```bash
   DATABASE_URL=postgresql://postgres:your-password@localhost:5432/vibe_trend_analyzer
   ```

5. **Push schema**
   ```bash
   npm run db:push
   ```

---

## Verify Connection

After setup, verify your database is connected:

```bash
npm run dev
```

You should see:
```
✅ Using PostgreSQL database
serving on port 5000
```

If you see:
```
⚠️  DATABASE_URL not found, using in-memory storage
```

Then your DATABASE_URL is not set correctly.

---

## Database Commands

```bash
# Push schema changes to database
npm run db:push

# Generate migrations (for production)
npx drizzle-kit generate

# View your database in Drizzle Studio
npx drizzle-kit studio
```

---

## Troubleshooting

### "DATABASE_URL not found"
- Make sure `.env` file exists in root directory
- Check that `DATABASE_URL` is spelled correctly
- Restart your dev server after changing .env

### "Connection refused"
- Check if PostgreSQL is running
- Verify the host, port, username, and password
- Check firewall settings

### "SSL required"
- For cloud databases (Neon, Supabase), add `?sslmode=require` to connection string
- Example: `postgresql://user:pass@host:5432/db?sslmode=require`

### "Permission denied"
- Check database user has proper permissions
- For local PostgreSQL, you might need to update pg_hba.conf

---

## Next Steps

After connecting your database:

1. ✅ Database connected
2. ⬜ Add authentication (JWT + password hashing)
3. ⬜ Add rate limiting
4. ⬜ Secure CORS
5. ⬜ Add request validation
6. ⬜ Implement proper error handling
7. ⬜ Add health checks
8. ⬜ Set up monitoring

See the main README for full production checklist.
