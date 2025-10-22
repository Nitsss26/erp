# Troubleshooting Guide

## Common Issues & Solutions

### 1. Port Already in Use

**Error**: \`Error: listen EADDRINUSE: address already in use :::3000\`

**Solution**:
\`\`\`bash
# Option 1: Use a different port
npm run dev -- -p 3001

# Option 2: Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
\`\`\`

### 2. Module Not Found

**Error**: \`Cannot find module 'next'\`

**Solution**:
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### 3. API Connection Failed

**Error**: \`Failed to fetch from API\`

**Solution**:
1. Check if backend is running
2. Verify NEXT_PUBLIC_API_URL in .env.local
3. Check CORS settings on backend
4. Ensure firewall allows connections

### 4. Build Fails

**Error**: \`Build failed\`

**Solution**:
\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Check for TypeScript errors
npx tsc --noEmit
\`\`\`

### 5. Login Not Working

**Error**: \`Invalid credentials\`

**Solution**:
1. Verify demo credentials are correct
2. Check if backend is running
3. Clear browser localStorage
4. Try incognito/private mode
5. Check browser console for errors

### 6. Styling Issues

**Error**: \`Tailwind CSS not applied\`

**Solution**:
1. Ensure globals.css is imported in layout.tsx
2. Check tailwind.config.js configuration
3. Restart dev server
4. Clear browser cache

### 7. Redux State Not Updating

**Error**: \`State not changing after dispatch\`

**Solution**:
1. Check Redux DevTools in browser
2. Verify reducer logic
3. Ensure action is dispatched correctly
4. Check for immutability issues

### 8. Slow Performance

**Solution**:
1. Use production build: \`npm run build && npm start\`
2. Enable caching
3. Optimize images
4. Reduce bundle size
5. Use pagination for large datasets

### 9. CORS Errors

**Error**: \`Access to XMLHttpRequest blocked by CORS policy\`

**Solution**:
1. Enable CORS on backend
2. Add correct origin to CORS whitelist
3. Check API_URL configuration
4. Verify request headers

### 10. Database Connection Issues

**Error**: \`Cannot connect to database\`

**Solution**:
1. Verify database is running
2. Check connection string
3. Verify credentials
4. Check firewall settings
5. Review database logs

## Performance Optimization

### Frontend Optimization
- Use production build
- Enable compression
- Optimize images
- Lazy load components
- Use React.memo for expensive components

### Backend Optimization
- Add database indexes
- Implement caching
- Use pagination
- Optimize queries
- Enable gzip compression

## Security Checklist

- [ ] Change demo credentials
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Use strong authentication
- [ ] Keep dependencies updated
- [ ] Enable CORS properly
- [ ] Use secure cookies
- [ ] Implement logging

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## System Requirements

- Node.js 18+
- npm 9+
- 2GB RAM minimum
- 500MB disk space

## Getting Help

1. Check this troubleshooting guide
2. Review README.md
3. Check inline code comments
4. Review browser console for errors
5. Check backend logs
6. Review Redux DevTools

---

**Still having issues? Check the documentation or review the code comments.**
\`\`\`
