FROM node:22.17.0-alpine

WORKDIR /app

COPY package*.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install

EXPOSE 5173

CMD ["pnpm", "dev"]