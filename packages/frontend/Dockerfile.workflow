FROM keonwoo/cs492c:default
ARG FRONTEND_PORT

USER root

# Copy yarn packages
WORKDIR /app
COPY ./package.json .
COPY ./packages/lib/ ./packages/lib/
COPY ./packages/frontend/ ./packages/frontend/
COPY ./packages/backend/package.json ./packages/backend/

RUN mkdir -p /app/coverage/frontend

RUN yarn install

EXPOSE ${FRONTEND_PORT}
