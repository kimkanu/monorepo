FROM node:lts

WORKDIR /app
COPY . .
RUN chown -R node:node /app
USER node
RUN yarn set version berry
RUN yarn plugin import workspace-tools
RUN yarn install

EXPOSE 3567
CMD yarn workspace @team-10/backend run start:dev
