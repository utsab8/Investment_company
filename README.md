# Investment Company - Full Stack Application

A complete investment company website with React frontend, PHP backend, and MySQL database. Features bilingual support (English/Nepali) and a full admin panel for content management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PHP (v7.4 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/utsab8/Investment_company.git
   cd Investment_company
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Import database**
   ```bash
   mysql -u root -p < backend/database.sql
   ```
   Or use the password directly:
   ```bash
   mysql -u root -putsab12@ < backend/database.sql
   ```

4. **Start servers**

   **Option 1: Use setup scripts**
   - Windows: `setup.bat`
   - PowerShell: `.\setup.ps1`

   **Option 2: Manual start**
   
   Terminal 1 (PHP Backend):
   ```bash
   cd backend
   php -S localhost:8000 -t public
   ```
   
   Terminal 2 (React Frontend):
   ```bash
   npm start
   ```

## 📋 Configuration

### Database Settings
- **Database Name**: `Investment`
- **Username**: `root`
- **Password**: `utsab12@`

Edit `backend/config.php` to change database settings.

### Admin Panel Access
- **URL**: http://localhost:3000/backend/admin
- **Username**: `admin`
- **Password**: `admin123`

## 🎯 Features

### Frontend
- ✅ React 18 with React Router
- ✅ Bilingual support (English/Nepali) using react-i18next
- ✅ Responsive design
- ✅ Dynamic content loading from backend
- ✅ Pages: Home, About, Services, Process, Plans, Reports, Blog, FAQ, Contact

### Backend
- ✅ PHP REST API
- ✅ MySQL database
- ✅ JWT authentication
- ✅ Content management system
- ✅ Admin panel for editing website content

### Admin Panel
- ✅ Secure login system
- ✅ Edit content for any page and language
- ✅ JSON-based content editor
- ✅ Real-time content updates

## 📁 Project Structure

```
investment Company/
├── backend/
│   ├── config.php          # Database and app configuration
│   ├── db.php              # Database connection
│   ├── auth.php            # Authentication helpers
│   ├── helpers.php         # Utility functions
│   ├── database.sql        # Database schema and seed data
│   └── public/
│       ├── index.php       # API router
│       └── admin/          # Admin panel
│           ├── login.php   # Admin login
│           ├── content.php # Content editor
│           └── logout.php  # Logout handler
├── src/
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── config.js           # Frontend configuration
│   └── setupProxy.js       # Proxy configuration
└── public/                 # Static files
```

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/public/i18n?lang=en|ne` - Get translations for a language

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/content/{page}?lang=en|ne` - Get content for a page
- `PUT /api/admin/content/{page}?lang=en|ne` - Update content for a page

## 📝 Usage

### Editing Website Content

1. Go to http://localhost:3000/backend/admin
2. Login with `admin` / `admin123`
3. Select language (English or Nepali)
4. Select page to edit
5. Edit the JSON content
6. Click "Save"
7. Refresh the website to see changes

### Adding New Content

The admin panel allows you to edit content for:
- `home` - Homepage content
- `about` - About page
- `services` - Services page
- `process` - Process page
- `plansPage` - Investment plans
- `reports` - Reports page
- `blogPage` - Blog page
- `faq` - FAQ page
- `contact` - Contact page
- `footer` - Footer content
- `nav` - Navigation menu
- `brand` - Brand name
- `common` - Common translations

## 🛠️ Development

### Running in Development Mode

Both servers support hot-reloading:
- React: Automatic reload on file changes
- PHP: Restart server after PHP file changes

### Database Management

To reset the database:
```bash
mysql -u root -putsab12@ < backend/database.sql
```

## 📦 Production Build

1. Build React app:
   ```bash
   npm run build
   ```

2. Deploy `build/` folder to your web server
3. Configure PHP backend on your server
4. Update `src/config.js` with production API URL

## 🔒 Security Notes

- Change default admin password in production
- Update JWT secret in `backend/config.php`
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure CORS properly for production domain

## 📄 License

This project is private and proprietary.

## 👤 Author

Investment Company Development Team

---

**Note**: Make sure MySQL is running and the database is imported before starting the servers.


