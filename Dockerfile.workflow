FROM node:lts

# Copy yarn packages
WORKDIR /app
COPY ./.yarnrc.yml .
COPY ./yarn.lock .

COPY ./package.json .
COPY ./packages/lib/package.json ./packages/lib/
COPY ./packages/frontend/package.json ./packages/frontend/
COPY ./packages/backend/package.json ./packages/backend/
