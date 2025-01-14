FROM node:20.11.1-slim as production

WORKDIR /usr/src/app

COPY package*.json .

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]