FROM node:lts

USER root

# Copy yarn packages
WORKDIR /app
COPY ./packages/lib/ ./packages/lib/
COPY ./packages/backend/ ./packages/backend/

RUN mkdir -p /app/coverage/backend

RUN yarn install
