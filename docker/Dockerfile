FROM docker.io/bitnami/git:2.26.2-debian-10-r13 as gitclone
WORKDIR /app
RUN git clone https://github.com/alesanderlopez/s3proxy-server-nodejs --branch dev /app
RUN chmod -R 777 /app

FROM docker.io/bitnami/node:12.12.0-r8-prod as npminstall
COPY --from=gitclone /app /app
WORKDIR /app
RUN npm install
RUN npm cache clean --force 

FROM docker.io/bitnami/node:12.12.0-r8-prod as node
COPY --from=npminstall /app /app
WORKDIR /app
EXPOSE 4000

CMD ["npm", "start"]