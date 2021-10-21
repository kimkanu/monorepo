FROM node:lts

WORKDIR /app
COPY . .
RUN chown -R node:node /app
USER node
RUN yarn install

EXPOSE 3567
CMD yarn workspace backend run start:dev
