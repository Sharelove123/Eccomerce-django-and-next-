#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Automatically create a persistent superuser for the showcase, even if SQLite drops
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@admin.com').exists() or User.objects.create_superuser('admin', 'admin@admin.com', 'admin')"

# Automatically seed default product categories
python manage.py shell -c "from core.models import Category; categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports']; [Category.objects.get_or_create(name=c) for c in categories]"

# Automatically seed exactly 25 default products across the categories
python manage.py shell -c "from core.models import Category, Product; [Product.objects.get_or_create(title=f'{c.name} Item {i}', defaults={'category': c, 'rateing': 4.5, 'orginalPrice': 120.0, 'discountedPrice': 99.0, 'discription': 'This is a beautifully crafted item perfect for your showcase.'}) for c in Category.objects.all() for i in range(1, 6)]"
