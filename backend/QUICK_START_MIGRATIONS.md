docker compose exec backend npm run migration:run

docker compose exec backend npm run seed


docker compose exec backend npx ts-node -r tsconfig-paths/register src/database/seeds/verify.ts