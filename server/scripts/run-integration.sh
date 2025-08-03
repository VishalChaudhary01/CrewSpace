docker-compose -f docker-compose.test.yaml up -d

echo "🟡 - Waiting for MongoDB replica set..."

./scripts/wait-for-it.sh "mongodb://mongodb:27017/crew-space-test-db?replicaSet=rs0" -- echo '🟢 - Database is ready!'

cross-env NODE_ENV=test dotenv -e .env.test -- jest --testMatch '**/tests/integration/**/*.test.ts'

docker-compose -f docker-compose.test.yaml down -v
