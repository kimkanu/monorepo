FROM node:lts

USER root

# Copy yarn packages
WORKDIR /app
COPY ./packages/lib/ ./packages/lib/

RUN mkdir -p /app/coverage/lib

RUN yarn install
