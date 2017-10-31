FROM node:8

WORKDIR /app

COPY . /app
RUN npm i && npm run build

VOLUME ["/app/server/log"]

ENTRYPOINT [ "node", "./server/index.js" ]

EXPOSE 4000