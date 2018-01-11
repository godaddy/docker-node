FROM node:9.4.0-slim

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_ENV=dev
ENV APP_USER_ID=999
ENV APP_GROUP_ID=999

# get gosu for easy sudos
ENV GOSU_VERSION 1.9
RUN set -x \
    && apt-get update && apt-get install -y --no-install-recommends ca-certificates wget && rm -rf /var/lib/apt/lists/* \
    && dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')" \
    && wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch" \
    && wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc" \
    && export GNUPGHOME="$(mktemp -d)" \
    && gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
    && gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
    && rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc \
    && chmod +x /usr/local/bin/gosu \
    && gosu nobody true \
    && apt-get purge -y --auto-remove ca-certificates wget

# create directory to host application files
RUN mkdir -p /home/alone/app

# this will be mounted as a volume in the build process
WORKDIR /home/alone/app

# base-entrypoint allows us to create a user/group with configureable UID/GID
COPY base-entrypoint.sh /

# make sure we can execute base-entrypoint.sh
RUN chmod +x /base-entrypoint.sh

# this will be the entrypoint script for the child container
ONBUILD COPY docker-entrypoint.sh /

# this will handle creating the user/group and running the docker-entrypoint.sh
# provided by the child image
ENTRYPOINT ["/base-entrypoint.sh"]

# this starts the container in development mode by default
CMD ["development"]
