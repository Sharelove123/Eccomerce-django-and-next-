# Eccomerce Django + Next

## Overview

This repository contains a multi-part e-commerce platform:

1. A Next.js customer and vendor web frontend
2. A Django REST backend (auth, products, cart, orders, vendor, chat)
3. A Flutter mobile app workspace (kept local in this repo setup)

The system supports customer shopping flows and vendor storefront management.

## Repository Structure

- `nextfrontend/`: Next.js app
- `djangobackend/djangobackend/`: Django project and apps
- `multivendoreccommerce/`: Flutter app (local workspace)

## Key Features

- Authentication (register/login)
- Product browsing and detail pages
- Cart and checkout flow
- Order listing and order detail pages
- Vendor registration and dashboard
- Vendor profile and product management
- Customer-vendor chat
- Responsive UI for desktop and mobile

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind, Material UI
- Backend: Django, Django REST Framework
- Mobile: Flutter (Dart)
- API Client: Axios/Fetch (web), Dio (Flutter)
- Payment: PayPal integration (web flow)

## Local Development

### 1) Backend (Django)

From `djangobackend/djangobackend/`:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2) Frontend (Next.js)

From `nextfrontend/`:

```bash
npm install
npm run dev
```

### 3) Flutter App (optional local)

From `multivendoreccommerce/`:

```bash
flutter pub get
flutter run
```

## Environment Notes

- Configure backend URL for Next.js with `NEXT_PUBLIC_API_HOST`.
- Configure backend URL for Flutter with `API_BASE_URL` in `multivendoreccommerce/.env`.

## Git Tracking Note

In this workspace, `multivendoreccommerce/` is configured to be ignored from Git tracking (local-only workflow).

## Showcase

Short demo: [https://youtube.com/shorts/EEX6L1K_Ybc](https://youtube.com/shorts/EEX6L1K_Ybc)
