#!/bin/sh
set -e

git config --global --add safe.directory /project

schedule="${UPDATE_CRON:-*/15 * * * *}"
printf '%s /usr/local/bin/run-update >> /proc/1/fd/2 2>&1\n' "$schedule" >/etc/crontabs/root

exec crond -f -l 2
