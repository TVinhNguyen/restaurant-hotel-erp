# Database Migrations

This directory contains TypeORM migrations for version-controlled database schema changes.

## Overview

Migrations provide a structured way to make incremental changes to your database schema and track those changes over time. Each migration is timestamped and can be applied or reverted.

## Migration Commands

All commands should be run from the `backend` directory:

### Generate Migration (from entity changes)

Automatically generates a migration by comparing your entities with the current database schema:

```bash
npm run migration:generate -- src/database/migrations/MigrationName
```

Example:
```bash
npm run migration:generate -- src/database/migrations/AddUserProfileFields
```

This will create a new migration file with the changes needed to sync the database with your entities.

### Create Empty Migration

Creates an empty migration file for custom SQL:

```bash
npm run migration:create -- src/database/migrations/MigrationName
```

Example:
```bash
npm run migration:create -- src/database/migrations/AddCustomIndexes
```

### Run Migrations

Apply all pending migrations:

```bash
npm run migration:run
```

This executes the `up()` method of all pending migrations in chronological order.

### Revert Migration

Revert the last executed migration:

```bash
npm run migration:revert
```

This executes the `down()` method of the most recent migration.

### Show Migrations

Show all migrations and their status:

```bash
npm run migration:show
```

Lists executed and pending migrations.

## Migration File Structure

Each migration file contains two methods:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1234567890 implements MigrationInterface {
  name = 'MigrationName1234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Changes to apply (forward)
    await queryRunner.query(`ALTER TABLE "users" ADD "profile_picture" varchar`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Changes to revert (backward)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_picture"`);
  }
}
```

## Best Practices

### 1. Always Test Migrations

Test migrations in a development/staging environment before applying to production:

```bash
# Create database backup first
pg_dump -U hotel_user_v2 -d hotel_pms_v2 > backup.sql

# Run migration
npm run migration:run

# Test application
npm run start:dev

# If issues, revert
npm run migration:revert

# Restore backup if needed
psql -U hotel_user_v2 -d hotel_pms_v2 < backup.sql
```

### 2. One Logical Change Per Migration

Keep migrations focused on one logical change:

- ✅ Good: `AddUserEmailVerification` (adds email_verified column and verification_token)
- ❌ Bad: `UpdateDatabase` (adds users table, modifies reservations, adds indexes)

### 3. Always Provide Down Migration

Every `up()` should have a corresponding `down()` to allow reverting:

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP INDEX "IDX_users_email"`);
}
```

### 4. Use Transactions

Wrap multiple queries in transactions to ensure atomicity:

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`START TRANSACTION`);
  
  try {
    await queryRunner.query(`ALTER TABLE "users" ADD "status" varchar DEFAULT 'active'`);
    await queryRunner.query(`UPDATE "users" SET "status" = 'active' WHERE "status" IS NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET NOT NULL`);
    
    await queryRunner.query(`COMMIT`);
  } catch (error) {
    await queryRunner.query(`ROLLBACK`);
    throw error;
  }
}
```

### 5. Never Edit Executed Migrations

Once a migration has been executed in any environment (dev, staging, production), **never** edit it. Instead, create a new migration to make additional changes.

### 6. Document Complex Migrations

Add comments for complex logic:

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // Add new payment_status column
  await queryRunner.query(`
    ALTER TABLE "payments" 
    ADD "payment_status" varchar DEFAULT 'pending'
  `);
  
  // Migrate existing data: completed=true → 'completed', else 'pending'
  await queryRunner.query(`
    UPDATE "payments" 
    SET "payment_status" = CASE 
      WHEN "completed" = true THEN 'completed' 
      ELSE 'pending' 
    END
  `);
  
  // Remove old completed column
  await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "completed"`);
}
```

## Initial Setup Migration

If starting fresh, you may want to create an initial migration from your existing schema:

```bash
# 1. Ensure database is empty or matches current entities
# 2. Generate initial migration
npm run migration:generate -- src/database/migrations/InitialSchema

# 3. Review generated SQL
# 4. Run migration
npm run migration:run
```

## Migration Naming Convention

Use descriptive names with verb + noun format:

- ✅ `AddUserProfile`
- ✅ `CreateReservationsTable`
- ✅ `UpdatePaymentStatuses`
- ✅ `RemoveDeprecatedColumns`
- ✅ `AddIndexesToReservations`

## Common Migration Scenarios

### Adding a Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users" 
    ADD "phone_verified" boolean DEFAULT false
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_verified"`);
}
```

### Changing a Column Type

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // PostgreSQL requires using USING clause for type conversion
  await queryRunner.query(`
    ALTER TABLE "reservations" 
    ALTER COLUMN "total_amount" 
    TYPE numeric(10,2) 
    USING "total_amount"::numeric(10,2)
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "reservations" 
    ALTER COLUMN "total_amount" 
    TYPE integer 
    USING "total_amount"::integer
  `);
}
```

### Adding an Index

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE INDEX "IDX_reservations_guest_id" 
    ON "reservations" ("guest_id")
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP INDEX "IDX_reservations_guest_id"`);
}
```

### Renaming a Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "guests" 
    RENAME COLUMN "name" TO "full_name"
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "guests" 
    RENAME COLUMN "full_name" TO "name"
  `);
}
```

## CI/CD Integration

Add migration checks to your CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
- name: Run migrations
  run: npm run migration:run
  env:
    DB_HOST: localhost
    DB_PORT: 5432
    DB_USERNAME: test_user
    DB_PASSWORD: test_pass
    DB_NAME: test_db

- name: Test application
  run: npm run test:e2e
```

## Production Deployment

For production, follow this workflow:

1. **Backup Database**
   ```bash
   pg_dump -U hotel_user_v2 -d hotel_pms_v2 > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Put Application in Maintenance Mode** (if needed)

3. **Run Migrations**
   ```bash
   npm run migration:run
   ```

4. **Deploy New Application Code**

5. **Verify Application**

6. **Exit Maintenance Mode**

7. **Monitor Logs and Metrics**

## Troubleshooting

### Migration Failed Mid-Execution

If a migration fails partway through:

1. Check the error message
2. Manually inspect database state
3. Fix the issue (manual SQL or code fix)
4. If safe, revert: `npm run migration:revert`
5. Fix migration code
6. Re-run: `npm run migration:run`

### Migration Already Exists

If you see "Migration already exists" error:

1. Check `typeorm_migrations` table
2. If duplicate, manually remove from table
3. Re-run migration

### Pending Migrations in Production

Always check for pending migrations before deployment:

```bash
npm run migration:show
```

## Monitoring

The `typeorm_migrations` table tracks all executed migrations:

```sql
SELECT * FROM typeorm_migrations ORDER BY timestamp DESC;
```

Fields:
- `id` - Auto-increment ID
- `timestamp` - Unix timestamp from filename
- `name` - Migration class name
- `executed_at` - When migration was executed

## Resources

- [TypeORM Migrations Docs](https://typeorm.io/migrations)
- [PostgreSQL ALTER TABLE Docs](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Database Migration Best Practices](https://www.liquibase.org/get-started/best-practices)

---

**Last Updated:** November 14, 2025  
**Maintainer:** Restaurant-Hotel ERP Team
