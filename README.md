[![CircleCI](https://circleci.com/gh/godaddy/docker-node/tree/master.svg?style=svg)](https://circleci.com/gh/godaddy/docker-node/tree/master)

# docker-node

Debian Docker images for Node.js with [best practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/) in mind:

* proper signal-forwarding for `su` and `sudo`,
* using unprivileged users for running apps.

# Usage

## Dockerfile

```Dockerfile
FROM godaddy/node:8.9.4-debian

ENV NODE_ENV=production # or anything else

RUN mkdir /app
WORKDIR /app

COPY docker/.npmrc package.json package-lock.json /app/

RUN npm install

# Copy app to source directory
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
COPY . /app/

EXPOSE 8080
CMD ["gosu", "node", "npm", "start"]
```

## Docker-entrypoint.sh

```bash
#!/bin/sh

# here you can customize how your app should start up
set -e

exec "$@"
```

# Grabbing the images

To grab the images, visit our [Docker Hub](https://hub.docker.com/r/godaddy/node/) profile.
