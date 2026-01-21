# Comprehensive Content Management System Guide

## Overview
A complete Content Management System (CMS) where **ALL** website content on **EVERY** page can be edited from the admin panel. No code changes needed - everything is dynamic and editable.

## Features

### ✅ Complete Page Content Management
- **Home Page**: Hero section, about section, features, plans preview
- **About Page**: Story, mission, vision, journey timeline, compliance
- **Services Page**: All service descriptions, titles, images
- **Process Page**: Step-by-step process descriptions
- **Plans Page**: Plan descriptions and details
- **Projects Page**: Project content
- **Reports Page**: Report content
- **FAQ Page**: FAQ questions and answers
- **Contact Page**: Contact information, form labels, addresses

### ✅ Dynamic Content System
- All text content is stored in database
- All images can be changed via URLs
- All headings, paragraphs, lists are editable
- Changes reflect immediately on website (after refresh)

## How to Use

### 1. Initialize Page Content
First, initialize default content for all pages:
```
http://localhost:8000/api/admin/init-page-content.php
```
This creates all content sections with default values.

### 2. Access Admin Panel
- URL: `http://localhost:3000/admin/login`
- Username: `admin`
- Password: `admin123`

### 3. Edit Page Content
1. Click **"Page Content"** in sidebar (expands menu)
2. Select the page you want to edit (e.g., "Home Page")
3. You'll see ALL editable sections for that page:
   - Text fields for titles
   - Textarea fields for descriptions
   - Image URL fields for images
4. Edit any field and click **"Save"** next to it
5. Or click **"Save All Changes"** at the top to save everything at once

### 4. Content Sections Available

#### Home Page
- Hero Title, Subtitle, Description, Background Image
- About Section Title and Text
- Why Choose Us Title and Description
- Feature 1, 2, 3 Titles and Descriptions

#### About Page
- Page Title and Subtitle
- Story Title and Text (2 paragraphs)
- Mission Title and Text
- Vision Title and Text
- Journey Title
- Compliance Title and Text

#### Services Page
- Page Title and Subtitle
- Service 1-5: Title, Description, Image

#### Contact Page
- Page Title and Subtitle
- Contact Section Title
- Office Title and Address
- Phone Title and Numbers
- Email Title and Addresses
- Form Title
- Map Embed Code

#### Process Page
- Page Title and Subtitle
- Introduction Title and Text
- Step 1-4: Title and Description

## Admin Panel Structure

```
Dashboard
├── Settings
│   └── Website Settings (Company info, logo, social media, etc.)
├── Page Content (Collapsible)
│   ├── Home Page (All hero, about, features content)
│   ├── About Page (Story, mission, vision, etc.)
│   ├── Services Page (All service descriptions)
│   ├── Process Page (Step-by-step process)
│   ├── Plans Page (Investment plans content)
│   ├── Projects Page (Projects content)
│   ├── Reports Page (Reports content)
│   ├── FAQ Page (FAQ content)
│   └── Contact Page (Contact info, addresses)
└── Contact Messages (View form submissions)
```

## Content Editing Interface

Each page shows:
- **Section Name**: Clear label for what you're editing
- **Field Type**: Text, Textarea, or Image
- **Current Value**: Shows existing content
- **Edit Field**: Input/textarea to modify content
- **Save Button**: Saves individual section
- **Save All**: Saves all changes at once

## Frontend Integration

All frontend pages automatically:
- Fetch content from database
- Display dynamic content
- Fall back to translations if content not set
- Update when you refresh the page

## API Endpoints

### Admin APIs
- `GET /api/admin/page-content.php?page={page}&action=sections` - Get all sections for a page
- `POST /api/admin/page-content.php` - Save content sections (bulk or single)
- `GET /api/admin/content.php?page={page}` - Get existing content
- `POST /api/admin/content.php` - Update single content section

### Public APIs
- `GET /api/public/content.php?page={page}` - Get content for frontend

## Database Structure

### `content_sections` Table
- `section_key`: Unique identifier (e.g., "hero_title")
- `section_name`: Display name (e.g., "Hero Title")
- `content`: The actual content text
- `page`: Which page it belongs to (home, about, etc.)
- `is_active`: Whether section is active

## Best Practices

1. **Content Organization**
   - Use clear, descriptive section names
   - Keep content concise and professional
   - Use HTML in textarea fields for formatting

2. **Images**
   - Upload images to `/backend/uploads/` or use external URLs
   - Recommended size: 1200x600px for hero images
   - Use optimized images for faster loading

3. **Text Content**
   - Use proper grammar and spelling
   - Keep paragraphs short and readable
   - Use headings and lists for better structure

4. **Regular Updates**
   - Review content monthly
   - Update contact information as needed
   - Keep service descriptions current

## Troubleshooting

### Content Not Showing
- Check that content sections are created (run init-page-content.php)
- Verify frontend is fetching from correct API
- Clear browser cache (Ctrl+F5)

### Changes Not Saving
- Check browser console for errors
- Verify you're logged into admin panel
- Check database connection

### Images Not Loading
- Verify image URL is correct
- Check image is accessible
- Use absolute URLs for external images

## Next Steps

1. **Initialize Content**: Visit `/api/admin/init-page-content.php`
2. **Login to Admin**: `http://localhost:3000/admin/login`
3. **Edit Content**: Go to Page Content > Select Page > Edit sections
4. **View Website**: Refresh frontend to see changes

---

**Note**: This is a complete CMS system. Every piece of content on every page can be edited from the admin panel without any code changes!





