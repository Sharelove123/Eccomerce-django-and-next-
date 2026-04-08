#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Automatically create a persistent superuser for the showcase, even if SQLite drops
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@admin.com').exists() or User.objects.create_superuser('admin', 'admin@admin.com', 'admin')"

# Automatically seed default product categories
