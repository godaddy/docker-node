FROM node:9.6.0-alpine

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_ENV=dev
ENV APP_USER_ID=999
ENV APP_GROUP_ID=999

# get su-exec for easy sudos and shadow for usermod and groupmod
RUN apk add --no-cache 'su-exec>=0.2' shadow

COPY base-entrypoint.sh /

# make sure we can execute base-entrypoint.sh
RUN chmod +x /base-entrypoint.sh

# this will be the entrypoint script for our container
ONBUILD COPY docker-entrypoint.sh /

# this will handle updating the node uid/gid and running the docker-entrypoint.sh
# provided by the child image
ENTRYPOINT ["/base-entrypoint.sh"]

# this starts the container in development mode by default
CMD ["development"]
