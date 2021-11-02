FROM node:lts

# Copy yarn packages
WORKDIR /app
COPY ./.yarnrc.yml .
COPY ./.yarn/ ./.yarn/
COPY ./yarn.lock .

COPY ./package.json .
COPY ./packages/frontend/package.json ./packages/frontend/
COPY ./packages/backend/package.json ./packages/backend/

RUN yarn set version berry
RUN yarn install
RUN yarn plugin import workspace-tools
