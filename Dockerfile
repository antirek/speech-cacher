FROM node:12.7.0

RUN npm install -g speech-cacher@19.7.1

CMD ["/bin/sh", "-c", "speech-cacher"]