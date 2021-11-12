FROM keonwoo/cs492c:default
ARG FRONTEND_PORT

# Copy yarn packages
WORKDIR /app
COPY yarn.lock .
COPY .yarnrc.yml .
COPY package.json .
COPY .yarn/ ./.yarn/

WORKDIR /app/packages/lib
COPY ./packages/lib/package.json .

WORKDIR /app/packages/frontend
COPY ./packages/frontend/package.json .

WORKDIR /app

RUN yarn set version berry
RUN yarn install

EXPOSE ${FRONTEND_PORT}
