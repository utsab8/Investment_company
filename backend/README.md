# MRB International - Backend API

Professional PHP backend for MRB International Investment Company.

## Directory Structure

```
backend/
├── api/              # API endpoints
│   ├── contact.php
│   ├── plans.php
│   ├── projects.php
│   ├── reports.php
│   └── faqs.php
├── config/           # Configuration files
│   ├── config.php
│   └── database.php
├── database/         # Database files
│   └── schema.sql
├── models/           # Data models
│   ├── Contact.php
│   ├── Plan.php
│   ├── Project.php
│   ├── Report.php
│   └── FAQ.php
├── utils/            # Utility classes
│   ├── Response.php
│   └── Validation.php
├── logs/             # Log files (create this directory)
├── uploads/          # Upload directory (create this directory)
├── .htaccess         # Apache configuration
└── index.php         # Entry point
```

## Setup Instructions

### 1. Database Setup

1. Open phpMyAdmin or MySQL command line
2. Import the database schema:
   ```sql
   source backend/database/schema.sql
   ```
   Or copy and paste the contents of `schema.sql` into phpMyAdmin SQL tab

### 2. Configuration

Edit `backend/config/database.php` and `backend/config/config.php` to match your MySQL credentials:

```php
private $host = 'localhost';
private $db_name = 'MRB_INTERNATIONAL';
private $username = 'root';      // Change if needed
private $password = '';           // Change if needed
```

### 3. Directory Permissions

Create and set permissions for:
- `backend/logs/` - For error logs
- `backend/uploads/` - For file uploads

### 4. Web Server Configuration

#### Apache
- Ensure mod_rewrite is enabled
- Point document root to project directory
- The `.htaccess` file will handle routing

#### Nginx
- Configure rewrite rules for clean URLs
- Set up PHP-FPM

## API Endpoints

### Base URL
```
http://localhost/backend/api/
```

### Endpoints

#### Contact
- **POST** `/api/contact.php` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Investment Inquiry",
    "message": "I'm interested in your services"
  }
  ```

#### Plans
- **GET** `/api/plans.php` - Get all plans
- **GET** `/api/plans.php?id=1` - Get plan by ID
- **GET** `/api/plans.php?slug=growth` - Get plan by slug

#### Projects
- **GET** `/api/projects.php` - Get all projects
- **GET** `/api/projects.php?id=1` - Get project by ID
- **GET** `/api/projects.php?category=Venture%20Capital` - Filter by category
- **GET** `/api/projects.php?year=2024` - Filter by year
- **GET** `/api/projects.php?featured=1` - Get featured projects
- **GET** `/api/projects.php?stats=1` - Get project statistics

#### Reports
- **GET** `/api/reports.php` - Get all reports
- **GET** `/api/reports.php?report_type=Annual` - Filter by type
- **GET** `/api/reports.php?year=2024` - Filter by year
- **GET** `/api/reports.php?download=1&id=1` - Increment download count

#### FAQs
- **GET** `/api/faqs.php` - Get all FAQs
- **GET** `/api/faqs.php?id=1` - Get FAQ by ID
- **GET** `/api/faqs.php?category=Investment` - Filter by category

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2024-01-01 12:00:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... },
  "timestamp": "2024-01-01 12:00:00"
}
```

## CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

Modify `backend/config/config.php` to add more origins.

## Security Notes

- Always use prepared statements (already implemented)
- Input validation and sanitization (already implemented)
- Error logging enabled
- CORS configured
- SQL injection protection via PDO

## Testing

Use tools like Postman, cURL, or your React frontend to test the API endpoints.

Example cURL:
```bash
curl -X POST http://localhost/backend/api/contact.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
```

