FROM node:lts

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm i

COPY dist dist/

EXPOSE 3002

CMD [ "npm", "start" ]
