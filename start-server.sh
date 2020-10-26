#!/usr/bin/env bash
# start-server.sh
if [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (cd backend; python manage.py init-rib --password "$DJANGO_SUPERUSER_PASSWORD")

fi
(cd backend; gunicorn backend.wsgi --user www-data --bind 0.0.0.0:8010 --workers 3) &
(cd backend; python manage.py dumpdata > db.json ;python manage.py migrate; python manage.py collectstatic --no-input)
nginx -g "daemon off;"