# LKS Jabar Cloud Computing
FROM public.ecr.aws/docker/library/node:18-alpine AS deps
WORKDIR /app

# Installing nodejs packages/modules
COPY package.json ./

# NOTES: also copy the yarn.lock for consistency between developers
COPY package-lock.json ./
RUN npm i

FROM public.ecr.aws/docker/library/node:18-alpine AS builder

# Environment variable
ARG TABLE_NAME
ARG INDEX_NAME
ARG BASE_URL

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build Next.js
RUN npm run build

# COPY compiled files from build/deps image to runner
FROM public.ecr.aws/docker/library/node:18-alpine AS runner
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
