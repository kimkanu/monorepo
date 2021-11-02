FROM node:lts
ARG BACKEND_PORT

# Copy yarn packages
WORKDIR /app
COPY yarn.lock .
COPY .yarnrc.yml .
COPY package.json .
COPY .yarn/ ./.yarn/

WORKDIR /app/packages/backend
COPY ./packages/backend/package.json .

WORKDIR /app
RUN chown -R node:node .

USER node
RUN yarn set version berry
RUN yarn install

EXPOSE ${BACKEND_PORT}
