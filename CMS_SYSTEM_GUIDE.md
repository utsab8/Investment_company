# Content Management System (CMS) Guide

## Overview
A complete Content Management System has been implemented that allows you to manage all website content, images, logos, company information, and contact messages from the admin panel.

## Features Implemented

### 1. **Website Settings Management**
   - **Location**: Admin Panel → Website Settings (`/admin/settings`)
   - **What you can manage**:
     - Company name, tagline, logo, favicon
     - Contact information (email, phone, address, website)
     - Social media links (Facebook, Twitter, LinkedIn, Instagram, YouTube)
     - Homepage content (hero title, subtitle, text, images)
     - Footer content (copyright text, description)
     - SEO settings (meta title, description, keywords)

### 2. **Content Management**
   - **Location**: Admin Panel → Content Management (`/admin/content`)
   - **What you can manage**:
     - Page-specific content for all pages (Home, About, Services, Process, Plans, Projects, Reports, FAQ, Contact)
     - Create new content sections
     - Edit existing content sections
     - Rich text content support

### 3. **Contact Messages Management**
   - **Location**: Admin Panel → Contact Messages (`/admin/contacts`)
   - **Features**:
     - View all contact form submissions
     - Filter by status (New, Read, Replied, Archived)
     - Update message status
     - Delete messages
     - Reply via email (opens email client)
     - All messages are automatically saved to database

### 4. **Dynamic Frontend**
   - All frontend pages now fetch content from the database
   - Company logo, name, and tagline are dynamic
   - Footer information is dynamic
   - Homepage hero section is dynamic
   - All content can be updated without code changes

## How to Use

### Initial Setup

1. **Initialize Default Settings**:
   - Login to admin panel: `http://localhost:3000/admin/login`
   - Navigate to: `http://localhost:8000/api/admin/init-settings.php`
   - This will create all default settings in the database

2. **Access Admin Panel**:
   - URL: `http://localhost:3000/admin/login`
   - Default credentials:
     - Username: `admin`
     - Password: `admin123`
   - **Important**: Change password after first login!

### Managing Website Settings

1. Go to **Website Settings** in admin panel
2. Settings are organized by categories:
   - **General**: Company name, tagline, logo, favicon
   - **Contact**: Email, phone, address, website
   - **Social**: Social media links
   - **Homepage**: Hero section content and images
   - **Footer**: Footer text and copyright
   - **SEO**: Meta tags for search engines

3. **To update a setting**:
   - Simply type in the field and it will auto-save
   - For images: Click "Upload Image" or paste image URL

### Managing Page Content

1. Go to **Content Management** in admin panel
2. Select the page you want to edit from the dropdown
3. Click "Edit Content" on any section
4. Make your changes and click "Save"
5. To add a new section: Click "Add New Content Section"

### Managing Contact Messages

1. Go to **Contact Messages** in admin panel
2. View all messages in the table
3. Click on a message to see full details
4. Update status: New → Read → Replied → Archived
5. Click "Reply via Email" to respond
6. Delete messages you no longer need

## API Endpoints

### Public APIs (No Authentication Required)
- `GET /api/public/settings.php` - Get all website settings
- `GET /api/public/content.php?page=home` - Get content for a specific page

### Admin APIs (Authentication Required)
- `GET /api/admin/settings.php` - Get all settings
- `POST /api/admin/settings.php` - Update settings
- `GET /api/admin/content.php?page=home` - Get content sections
- `POST /api/admin/content.php` - Update content
- `GET /api/admin/contacts.php` - Get all contact messages
- `PUT /api/admin/contacts.php` - Update contact status
- `DELETE /api/admin/contacts.php?id=1` - Delete contact
- `POST /api/admin/init-settings.php` - Initialize default settings

## Database Tables

### `website_settings`
Stores all website configuration settings.

### `content_sections`
Stores page-specific content sections.

### `contacts`
Stores all contact form submissions.

## Frontend Integration

The frontend automatically fetches and displays:
- Company logo and name (Header)
- Company information (Footer)
- Homepage hero content
- All page content sections

All changes made in the admin panel are immediately reflected on the website (after page refresh).

## File Structure

```
backend/
├── api/
│   ├── admin/
│   │   ├── settings.php       # Settings management API
│   │   ├── content.php         # Content management API
│   │   ├── contacts.php        # Contact messages API
│   │   └── init-settings.php    # Initialize default settings
│   ├── public/
│   │   ├── settings.php         # Public settings API
│   │   └── content.php          # Public content API
│   └── contact.php              # Contact form submission API
├── models/
│   ├── WebsiteSettings.php      # Settings model
│   └── Contact.php              # Contact model

src/
├── pages/admin/
│   ├── Settings.js              # Settings management page
│   ├── Content.js               # Content management page
│   └── Contacts.js              # Contact messages page
├── services/
│   ├── adminApi.js              # Admin API service
│   └── publicApi.js             # Public API service
└── components/
    ├── Header.js                 # Dynamic header
    ├── Footer.js                 # Dynamic footer
    └── Logo.js                   # Dynamic logo
```

## Tips

1. **Images**: Upload images to `/backend/uploads/` or use external URLs
2. **Content**: Use HTML in content sections for rich formatting
3. **Backup**: Regularly backup your database
4. **SEO**: Update meta tags in SEO settings for better search rankings
5. **Social Media**: Add your social media links to increase engagement

## Troubleshooting

### Settings not showing up?
- Run the init-settings endpoint: `http://localhost:8000/api/admin/init-settings.php`
- Check database connection in `backend/config/database.php`

### Contact messages not appearing?
- Check that contact form is submitting to `/api/contact.php`
- Verify CORS is enabled
- Check database `contacts` table exists

### Content not updating on frontend?
- Clear browser cache (Ctrl+F5)
- Check that public API endpoints are accessible
- Verify React app is reading from correct API URL

## Next Steps

1. **Initialize Settings**: Visit `/api/admin/init-settings.php` to create default settings
2. **Customize Content**: Update all settings and content to match your brand
3. **Upload Images**: Add your company logo and images
4. **Test Contact Form**: Submit a test message and verify it appears in admin panel
5. **Configure SEO**: Update meta tags for better search engine visibility

---

**Note**: All changes are saved to the database and persist across server restarts.





