# Installation & Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional)

## Step 1: Extract the Project

Extract the downloaded ZIP file to your desired location:

\`\`\`bash
unzip school-erp.zip
cd school-erp
\`\`\`

## Step 2: Install Frontend Dependencies

\`\`\`bash
npm install
\`\`\`

This will install all required packages including:
- Next.js 15
- React 18
- Redux Toolkit
- Axios
- Tailwind CSS
- Recharts
- And more...

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=School ERP System
\`\`\`

## Step 4: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at: **http://localhost:3000**

## Step 5: Access the Application

### Admin Portal
- URL: http://localhost:3000/admin/login
- Email: admin@school.com
- Password: admin123

### Teacher Portal
- URL: http://localhost:3000/teacher/login
- Email: teacher@school.com
- Password: teacher123

### Student Portal
- URL: http://localhost:3000/student/login
- Email: student@school.com
- Password: student123

## Backend Setup (Optional)

If you want to run the backend server:

\`\`\`bash
cd backend
npm install
npm start
\`\`\`

Backend will run on: **http://localhost:5000**

## Production Build

To create an optimized production build:

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment Options

### Deploy to Vercel (Recommended for Frontend)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your repository
5. Click "Deploy"

### Deploy Backend to Heroku

\`\`\`bash
cd backend
heroku create your-app-name
git push heroku main
\`\`\`

### Deploy to AWS, DigitalOcean, or Other Platforms

Follow platform-specific deployment guides for Node.js applications.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Module Not Found Errors

Clear node_modules and reinstall:

\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

### API Connection Issues

1. Ensure backend is running (if using custom backend)
2. Check NEXT_PUBLIC_API_URL in .env.local
3. Verify CORS settings on backend

### Build Errors

Clear Next.js cache:

\`\`\`bash
rm -rf .next
npm run build
\`\`\`

## System Requirements

- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: 500MB for node_modules
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **Internet**: Required for initial setup and API calls

## Performance Tips

1. Use production build for better performance
2. Enable caching on your server
3. Use CDN for static assets
4. Optimize database queries on backend
5. Implement pagination for large datasets

## Security Recommendations

1. Change demo credentials in production
2. Use environment variables for sensitive data
3. Enable HTTPS in production
4. Implement rate limiting on backend
5. Use strong authentication tokens
6. Validate all user inputs
7. Keep dependencies updated

## Updating Dependencies

To update all packages:

\`\`\`bash
npm update
\`\`\`

To update a specific package:

\`\`\`bash
npm install package-name@latest
\`\`\`

## Getting Help

- Check README.md for feature documentation
- Review SETUP_GUIDE.md for project structure
- Check inline code comments
- Review component documentation

---

**Ready to go! Happy coding! 🚀**
\`\`\`
