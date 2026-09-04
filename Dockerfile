FROM node:22-alpine AS dependencies
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=80
RUN addgroup -S nodejs && adduser -S nuxt -G nodejs
COPY --chown=nuxt:nodejs --from=build /app/.output ./.output
COPY --chown=nuxt:nodejs --from=build /app/migrations ./migrations
USER nuxt
EXPOSE 80
CMD ["node", ".output/server/index.mjs"]
