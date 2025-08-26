# -------- Build stage: export Expo web bundle --------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

# Copy source
COPY . .

# (Optional) ensure base URL is root
ENV EXPO_PUBLIC_ROUTER_BASE_URL=/

# Export static web bundle to /app/dist
RUN npx expo export --platform web --output-dir dist --clear

# -------- Runtime: Nginx to serve static files --------
FROM nginx:alpine

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy exported site
COPY --from=build /app/dist /usr/share/nginx/html

# Extra MIME types already included, but we'll keep gzip nice to have
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]