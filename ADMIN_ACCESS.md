# Admin Panel Access Guide

## Problem
When accessing `http://localhost:3000/backend/admin`, you see the regular website instead of the admin panel.

## Solution

### Option 1: Direct Access (Easiest - Recommended)
**Access the admin panel directly on the PHP server:**

```
http://localhost:8000/admin/login.php
```

or

```
http://localhost:8000/admin
```

**Login:**
- Username: `admin`
- Password: `admin123`

### Option 2: Via React Proxy (After Restart)

If you want to use `http://localhost:3000/backend/admin`, you need to:

1. **Stop the React server** (Ctrl+C in the terminal running `npm start`)

2. **Restart it:**
   ```bash
   npm start
   ```

3. **Wait for it to fully start** (you'll see "Compiled successfully!")

4. **Then access:** `http://localhost:3000/backend/admin`

### Option 3: Use a Different Port

You can also access the admin panel by opening it in a new tab directly:
- Open: `http://localhost:8000/admin/login.php`
- This bypasses React completely

## Why This Happens

React Router (client-side routing) tries to handle all routes, including `/backend/admin`. The proxy should intercept it, but sometimes React needs to be restarted for proxy changes to take effect.

## Quick Fix

**Just use direct access:**
```
http://localhost:8000/admin/login.php
```

This is the simplest and most reliable way to access the admin panel.

## After Login

Once logged in, you'll see:
- **Dashboard** - Overview of all content
- **Content Editor** - Edit any page's content
- Full control over the entire website


