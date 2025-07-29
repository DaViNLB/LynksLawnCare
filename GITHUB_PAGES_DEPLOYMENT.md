# GitHub Pages Deployment Guide for lynkslawncare.com

This guide will help you deploy your Lynks Lawn Care website to GitHub Pages with your custom domain.

## Prerequisites

1. **GitHub Account**: Make sure you have a GitHub account
2. **Domain Setup**: You should own the domain `lynkslawncare.com`
3. **DNS Access**: You need to be able to modify DNS records for your domain

## Step 1: Push Code to GitHub

### Option A: Using Replit's GitHub Integration (Recommended)
1. In your Replit workspace, click the **Version Control** tab (Git icon in sidebar)
2. Click **Connect to GitHub** if not already connected
3. Create a new repository or connect to existing one
4. Add commit message: "Add GitHub Pages deployment setup"
5. Click **Commit & Push**

### Option B: Manual GitHub Upload
1. Go to [GitHub.com](https://github.com) and create a new repository named `lynkslawncare-website`
2. Download your project files from Replit
3. Upload them to the GitHub repository

## Step 2: Configure GitHub Repository

1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select "GitHub Actions"
5. The deployment workflow is already configured in `.github/workflows/deploy.yml`

## Step 3: Add Environment Secrets

Your app needs API keys to work properly. Add these in GitHub:

1. In your repository, go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret** and add:
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key (if using Stripe)

## Step 4: Configure Custom Domain

### DNS Configuration
Point your domain to GitHub Pages by adding these DNS records at your domain registrar:

**For Apex Domain (lynkslawncare.com):**
```
Type: A
Name: @
Value: 185.199.108.153
```
```
Type: A  
Name: @
Value: 185.199.109.153
```
```
Type: A
Name: @
Value: 185.199.110.153
```
```
Type: A
Name: @
Value: 185.199.111.153
```

**For CNAME (www.lynkslawncare.com):**
```
Type: CNAME
Name: www
Value: [your-github-username].github.io
```

### GitHub Pages Domain Setup
1. In your repository settings, go to **Pages**
2. Under **Custom domain**, enter: `lynkslawncare.com`
3. Check **Enforce HTTPS** (after DNS propagates)

## Step 5: Deploy

1. Push any changes to the `main` branch
2. GitHub Actions will automatically build and deploy your site
3. Check the **Actions** tab to monitor deployment progress
4. Your site will be live at `https://lynkslawncare.com` once DNS propagates (can take up to 48 hours)

## How the Static Version Works

For GitHub Pages deployment, your app has been configured to work without a backend server:

- **Forms**: Contact and booking forms submit directly to FormSubmit.co
- **Email Notifications**: You'll receive emails at `davinlynksservices@gmail.com`
- **Static Assets**: All images and styles are bundled with the site
- **Client-Side Routing**: Handles page navigation without a server

## Features Available in Static Mode

✅ **Contact Form** - Works with email notifications  
✅ **Booking Form** - Works with email notifications  
✅ **Pricing Calculator** - Fully functional  
✅ **Google Maps** - Shows service area  
✅ **Responsive Design** - Works on all devices  
✅ **Professional Styling** - Full Lynks Lawn Care branding  

## Troubleshooting

**Build Fails:**
- Check that all environment variables are set in GitHub secrets
- Review the Actions tab for error details

**Domain Not Working:**
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check GitHub Pages settings

**Forms Not Working:**
- Emails go to `davinlynksservices@gmail.com` via FormSubmit.co
- Check spam folder for notifications
- FormSubmit is a free service, so emails might take a few minutes

**Need Help?**
- Check the **Issues** tab in your GitHub repository
- Review GitHub Pages documentation
- Contact your domain registrar for DNS help

## Next Steps

Once deployed, you can:
1. Monitor form submissions via email
2. Update content by pushing changes to GitHub
3. Add Google Analytics for visitor tracking
4. Consider upgrading to paid services for enhanced features

Your professional lawn care website will be live at `lynkslawncare.com` with all the features working properly!