# Admin Panel Fix Instructions

## Issue
Admin panel not opening at `http://localhost:3000/backend/admin`

## Solution Applied
Updated `backend/public/index.php` to bypass the API router for admin panel requests.

## Steps to Fix

### 1. Restart PHP Server
The PHP server needs to be restarted to pick up the router changes.

**Stop the current PHP server** (if running in a terminal, press Ctrl+C)

**Start it again:**
```bash
cd backend
php -S localhost:8000 -t public
```

### 2. Restart React Server (if needed)
If the proxy still doesn't work, restart React:

**Stop React** (Ctrl+C in the terminal running npm start)

**Start it again:**
```bash
npm start
```

### 3. Test Access

Try these URLs in your browser:

1. **Direct PHP access** (should work):
   ```
   http://localhost:8000/admin/login.php
   ```

2. **Via React proxy** (should work after restart):
   ```
   http://localhost:3000/backend/admin
   ```

### 4. If Still Not Working

**Check if servers are running:**
- PHP: Open `http://localhost:8000/test.php` - should show PHP info
- React: Open `http://localhost:3000` - should show the website

**Check browser console:**
- Open Developer Tools (F12)
- Check Console tab for errors
- Check Network tab to see if requests are being made

**Alternative: Access directly**
If proxy doesn't work, you can always access the admin panel directly:
```
http://localhost:8000/admin/login.php
```

## Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## What Was Fixed
The `backend/public/index.php` router was intercepting all requests, including admin panel requests. Now it checks if the request is for the admin panel and returns `false` to let PHP serve the file directly.

