FROM node:20.19.3-alpine AS base


### Dependencies ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git



# Setup pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /oladejo/apps/tailoring-dashboard

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Builder
FROM base AS builder

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /oladejo/apps/tailoring-dashboard

COPY --from=deps /oladejo/apps/tailoring-dashboard/node_modules ./node_modules
COPY . .
COPY .env.example .env.production
RUN pnpm build


### Production image runner ###
FROM base AS runner

WORKDIR /oladejo/apps/tailoring-dashboard

# Set NODE_ENV to production
ENV NODE_ENV production

# Disable Next.js telemetry
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Set correct permissions for nextjs user and don't run as root
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /oladejo/apps/tailoring-dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /oladejo/apps/tailoring-dashboard/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /oladejo/apps/tailoring-dashboard/public ./public

USER nextjs

# Exposed port (for orchestrators and dynamic reverse proxies)
EXPOSE 9600
ENV PORT 9600
ENV HOSTNAME "0.0.0.0"
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "wget", "-q0", "http://localhost:9600/health" ]

# Run the nextjs app
CMD ["node", "server.js"]
