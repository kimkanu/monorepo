FROM keonwoo/cs492c:default
ARG FRONTEND_PORT

USER root

# Copy yarn packages
WORKDIR /app
COPY ./packages/frontend/ ./packages/frontend/

RUN mkdir -p /app/coverage/frontend

RUN yarn install

EXPOSE ${FRONTEND_PORT}
