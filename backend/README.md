# PHP Backend (MySQL)

Simple PHP API that serves translation/content for the React app and allows an admin to edit content via JSON blocks stored in MySQL.

## Setup
1) Install PHP 8+ and MySQL 8 (or MariaDB with JSON support).
2) Create DB and seed data:
```bash
mysql -u root -p < backend/database.sql
```
This seeds an admin user `admin@example.com` / `Admin@123` and English/Nepali content blocks.

3) Configure DB credentials in `backend/config.php`:
```php
'db' => [
  'host' => '127.0.0.1',
  'port' => '3306',
  'name' => 'investment_company',
  'user' => 'root',
  'pass' => '',
],
'jwt' => [
  'secret' => 'change-this-secret-key',
]
```

4) Run the PHP server (from project root):
```bash
php -S localhost:8000 -t backend/public
```

5) Point the React app to the API (already defaults to `http://localhost:8000`). To change, set:
```
REACT_APP_API_BASE=http://localhost:8000
```

## API
- `POST /api/auth/login` → `{ email, password }` returns `{ token, user }`
- `GET /api/public/i18n?lang=en` → merged translations for lang (default both en/ne)
- `GET /api/admin/content?lang=en` (auth) → list of blocks
- `GET /api/admin/content/{page}?lang=en` (auth) → single block
- `PUT /api/admin/content/{page}?lang=en` (auth) → `{ data: { ... } }` upserts block

Authorization: `Authorization: Bearer <token>` (admin role required).

## Editing content
Each block is a partial translation tree (e.g., `home`, `about`, `footer`). Update JSON for the relevant page and PUT it back; the frontend fetches `/api/public/i18n` on start and updates translations at runtime, so changes appear after a page reload.

## Notes
- Keep `jwt.secret` strong.
- CORS default is `*`; tighten `allowed_origin` in `config.php` for production.
- If you add new translation keys in the frontend, seed them in `content_blocks` to keep API responses complete.


