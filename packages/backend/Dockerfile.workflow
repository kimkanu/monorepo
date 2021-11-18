FROM keonwoo/cs492c:default

USER root

# Copy yarn packages
WORKDIR /app
COPY ./packages/lib/ ./packages/lib/
COPY ./packages/frontend/ ./packages/backend/

RUN mkdir -p /app/coverage/backend

RUN yarn install
