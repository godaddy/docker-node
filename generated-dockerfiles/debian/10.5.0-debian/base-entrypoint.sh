#!/bin/sh

CURRENT_UID=`id -u node 2>/dev/null`
CURRENT_GID=`id -g node 2>/dev/null`

# if either APP_USER_ID or APP_GROUP_ID environment variables exist,
# the node user's uid/gid will be updated accordingly. this is useful
# if you want to avoid permissions issues when mounting volumes
if [ ! -z "$APP_USER_ID" -o ! -z "$APP_GROUP_ID" ]; then
  groupmod -g ${APP_GROUP_ID:-$CURRENT_GID} node && \
  usermod -u ${APP_USER_ID:-$CURRENT_UID} -g ${APP_GROUP_ID:-$CURRENT_GID} node
fi

. /docker-entrypoint.sh
