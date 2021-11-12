FROM keonwoo/cs492c:default
ARG BACKEND_PORT

# Copy yarn packages
WORKDIR /app
COPY yarn.lock .
COPY .yarnrc.yml .
COPY package.json .
COPY .yarn/ ./.yarn/

WORKDIR /app/packages/lib
COPY ./packages/lib/package.json .

WORKDIR /app/packages/backend
COPY ./packages/backend/package.json .

WORKDIR /app

RUN yarn set version berry
RUN yarn install

EXPOSE ${BACKEND_PORT}
