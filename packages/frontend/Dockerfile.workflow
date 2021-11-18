FROM node:lts

USER root

# Copy yarn packages
WORKDIR /app
COPY ./packages/lib/ ./packages/lib/
COPY ./packages/frontend/ ./packages/frontend/

RUN mkdir -p /app/coverage/frontend

RUN yarn install
