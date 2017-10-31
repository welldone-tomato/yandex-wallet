FROM node:8

WORKDIR /app

COPY . /app
RUN npm i

VOLUME ["/app/server/log"]

ENTRYPOINT [ "node", "./server/index.js" ]

EXPOSE 4000