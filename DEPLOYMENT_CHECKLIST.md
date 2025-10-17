# EasyPanel Deployment Checklist

This checklist provides a step-by-step guide for deploying your CRM application to EasyPanel.

## Pre-Deployment Checklist

### 1. Repository Preparation
- [ ] All latest changes are committed to GitHub
- [ ] Repository is clean with no uncommitted changes
- [ ] All tests are passing locally
- [ ] Application builds successfully locally
- [ ] Environment variables are documented

### 2. EasyPanel Account Setup
- [ ] EasyPanel account is active
- [ ] Server is configured and running
- [ ] You have admin access to the EasyPanel dashboard
- [ ] DNS is configured (if using custom domain)

### 3. Database Decision
- [ ] Decide between EasyPanel managed databases or Docker containers
- [ ] Database credentials are ready (if using managed)
- [ ] Database connection strings are prepared

## Configuration Setup

### 1. Environment Variables
- [ ] Copy all required environment variables from `EASYPANEL_CONFIG_TEMPLATES.md`
- [ ] Generate new secure secrets for production:
  - [ ] JWT_SECRET (at least 32 characters)
  - [ ] REFRESH_TOKEN_SECRET (at least 32 characters)
  - [ ] NEXTAUTH_SECRET (at least 32 characters)
- [ ] Update application URL placeholders with actual EasyPanel URL
- [ ] Configure email settings with real credentials
- [ ] Set up SMS credentials (if using Twilio)
- [ ] Add monitoring service credentials (if using Sentry)

### 2. Docker Configuration
- [ ] Create `docker-compose.easypanel.yml` from template
- [ ] Update `Dockerfile` with EasyPanel optimizations
- [ ] Verify all environment variables are referenced correctly
- [ ] Check volume mappings for uploads and backups

### 3. Application Configuration
- [ ] Update `next.config.ts` with your EasyPanel domain
- [ ] Verify image domains are configured correctly
- [ ] Check security headers are appropriate for production

## EasyPanel Setup

### 1. Create Application
- [ ] Log in to EasyPanel dashboard
- [ ] Create new application
- [ ] Connect to your GitHub repository
- [ ] Select the appropriate branch (usually `main`)
- [ ] Configure build settings:
  - [ ] Build Command: `npm run build`
  - [ ] Start Command: `npm start`
  - [ ] Node Version: `20.x`
  - [ ] Install Command: `npm ci`

### 2. Configure Environment Variables
- [ ] Add all environment variables in EasyPanel
- [ ] Verify database connection strings are correct
- [ ] Check all secrets are properly set
- [ ] Test variable substitution if using templates

### 3. Configure Services (Option 2 - Docker Containers)
- [ ] Add PostgreSQL service (if not using managed)
- [ ] Add Redis service (if not using managed)
- [ ] Configure service networking
- [ ] Set up service health checks
- [ ] Configure resource limits

### 4. Configure Volumes
- [ ] Create volume for uploads (`/app/public/uploads`)
- [ ] Create volume for backups (`/app/backups`)
- [ ] Set appropriate permissions
- [ ] Configure backup retention

## Deployment Process

### 1. Initial Deployment
- [ ] Trigger manual deployment from EasyPanel dashboard
- [ ] Monitor build logs for any errors
- [ ] Check that all dependencies are installed correctly
- [ ] Verify the application builds successfully

### 2. Database Setup
- [ ] Run database migrations:
  - Option 1 (Managed): Use EasyPanel terminal to run `npx prisma migrate deploy`
  - Option 2 (Docker): Migrations should run automatically
- [ ] Seed initial data:
  - [ ] Check if admin user is created
  - [ ] Verify initial restaurant settings are configured
  - [ ] Test basic functionality

### 3. Health Check
- [ ] Verify the application starts successfully
- [ ] Check the health endpoint: `https://your-app.easypanel.io/api/health`
- [ ] Monitor application logs for any errors
- [ ] Test basic functionality in the browser

## Post-Deployment Verification

### 1. Basic Functionality
- [ ] Load the application in browser
- [ ] Test user registration
- [ ] Test user login
- [ ] Create a test reservation
- [ ] Verify email notifications work
- [ ] Test file uploads

### 2. Security Verification
- [ ] HTTPS is working correctly
- [ ] Security headers are present
- [ ] No mixed content warnings
- [ ] Authentication is working properly
- [ ] API endpoints are properly secured

### 3. Performance Check
- [ ] Page load times are acceptable
- [ ] Database queries are performing well
- [ ] No memory leaks or excessive resource usage
- [ ] Static assets are cached properly

### 4. Monitoring Setup
- [ ] Application logs are being collected
- [ ] Error tracking is configured (if using Sentry)
- [ ] Resource usage monitoring is active
- [ ] Alert rules are configured for critical issues

## Backup and Recovery Setup

### 1. Configure Backups
- [ ] Automatic database backups are configured
- [ ] File backups are scheduled
- [ ] Backup retention policy is set
- [ ] Backup restoration procedure is tested

### 2. Recovery Testing
- [ ] Document recovery procedure
- [ ] Test database restoration from backup
- [ ] Verify file backup restoration
- [ ] Create runbook for common issues

## Final Checklist

### 1. Documentation
- [ ] Update README with deployment information
- [ ] Document all environment variables
- [ ] Create troubleshooting guide
- [ ] Document backup and recovery procedures

### 2. Team Preparation
- [ ] Team members have access to EasyPanel
- [ ] Documentation is shared with the team
- [ ] Emergency contacts are updated
- [ ] Deployment process is documented

### 3. Go-Live Preparation
- [ ] DNS is configured correctly
- [ ] SSL certificate is active and valid
- [ ] All monitoring is active
- [ ] Backup schedule is confirmed
- [ ] Team is notified of go-live

## Ongoing Maintenance

### Weekly Tasks
- [ ] Check application logs for errors
- [ ] Monitor resource usage
- [ ] Verify backups are completing successfully
- [ ] Check for security updates

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review and rotate secrets
- [ ] Audit user access
- [ ] Performance optimization review

## Troubleshooting Quick Reference

### Common Issues and Solutions

1. **Application won't start**
   - Check environment variables in EasyPanel
   - Review deployment logs
   - Verify database connection
   - Check for missing dependencies

2. **Database connection errors**
   - Verify DATABASE_URL format
   - Check database service status
   - Test network connectivity
   - Review database credentials

3. **Authentication issues**
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Review JWT configuration
   - Test with different browsers

4. **File upload issues**
   - Verify uploads directory permissions
   - Check disk space
   - Review file size limits
   - Test with different file types

5. **Performance issues**
   - Check resource usage in EasyPanel
   - Review database query performance
   - Verify caching is working
   - Monitor network latency

## Emergency Contacts

- EasyPanel Support: [EasyPanel support contact]
- Database Admin: [Database administrator contact]
- System Admin: [System administrator contact]
- Development Team: [Development team contact]

## Additional Resources

- [EasyPanel Documentation](https://easypanel.io/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)