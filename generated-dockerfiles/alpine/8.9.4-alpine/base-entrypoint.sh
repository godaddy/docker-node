#!/bin/sh

# create alone user/group so we aren't forced to run app as root
id -u alone 2>/dev/null
if [ $? -ne 0 ]; then
  groupadd -r alone --gid=$APP_GROUP_ID
  useradd -r -g alone -d /home/alone -c "alone app user" --uid=$APP_USER_ID alone
  echo "created alone user/group with UID/GID: $APP_USER_ID/$APP_GROUP_ID"
else
  echo "alone user already exists"
fi
chown alone:alone /home/alone
chown -R alone:alone /home/alone/app

. /docker-entrypoint.sh
