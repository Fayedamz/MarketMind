# Deployment Guide

## Overview

MarketMind can be deployed to various cloud providers. This guide covers deployment to AWS, but the principles apply to other platforms.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis
- AWS Account (or alternative cloud provider)
- Domain name (optional)

## Environment Setup

### Production Environment Variables

Create a `.env.production` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/marketmind_prod"

# API
API_PORT=3001
NODE_ENV="production"

# JWT
JWT_SECRET="strong-secret-key-change-this"
JWT_EXPIRES_IN="7d"

# AI
OPENAI_API_KEY="your-production-key"

# Market Data
ALPHA_VANTAGE_API_KEY="your-key"
FINNHUB_API_KEY="your-key"
POLYGON_API_KEY="your-key"

# Redis
REDIS_URL="redis://production-host:6379"

# AWS
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET="marketmind-prod-assets"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

## Deployment Options

### Option 1: AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
eb init -p node.js-18 marketmind
```

3. **Create environment**
```bash
eb create marketmind-prod
```

4. **Deploy**
```bash
npm run build
eb deploy
```

### Option 2: AWS ECS (Containerized)

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Build and push**
```bash
docker build -t marketmind .
docker tag marketmind:latest YOUR_ECR_REPO:latest
docker push YOUR_ECR_REPO:latest
```

3. **Deploy via ECS**
- Create ECS cluster
- Define task definition
- Create service
- Configure load balancer

### Option 3: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)

1. **Connect GitHub repo to Vercel**
2. **Configure build settings:**
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`

3. **Set environment variables in Vercel dashboard**

#### Backend (Railway)

1. **Connect GitHub repo to Railway**
2. **Configure service:**
   - Root Directory: `apps/api`
   - Start Command: `npm start`

3. **Add PostgreSQL and Redis services**
4. **Set environment variables**

## Database Migration

### Production Migration

```bash
# Set production database URL
export DATABASE_URL="your-production-url"

# Run migrations
npm run db:migrate

# Seed initial data (if needed)
npm run db:seed
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to production
        run: |
          # Deploy commands here
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Monitoring

### Health Checks

The API includes a health check endpoint:

```
GET /health
```

Configure your load balancer to use this endpoint.

### Logging

- **Application logs**: Winston logger
- **Error tracking**: Sentry
- **Performance monitoring**: AWS CloudWatch / Datadog

### Alerts

Set up alerts for:
- High error rates
- Slow response times
- Database connection issues
- High memory usage
- Failed deployments

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Enable CORS with specific origins
- [ ] Set up rate limiting
- [ ] Enable database SSL
- [ ] Rotate secrets regularly
- [ ] Set up WAF rules
- [ ] Enable DDoS protection
- [ ] Configure security headers (helmet.js)
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Scaling Strategy

### Horizontal Scaling

1. **API Servers**: Add more instances behind load balancer
2. **Database**: Read replicas for read-heavy operations
3. **Caching**: Redis cluster for distributed caching

### Vertical Scaling

1. Increase server resources as needed
2. Monitor resource usage
3. Optimize database queries

## Backup and Recovery

### Automated Backups

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL | gzip > backup_$DATE.sql.gz
aws s3 cp backup_$DATE.sql.gz s3://marketmind-backups/
```

### Recovery Process

1. Download backup from S3
2. Restore to new database instance
3. Update connection strings
4. Verify data integrity

## Post-Deployment

### Verification Steps

1. Check health endpoint
2. Test user authentication
3. Verify API endpoints
4. Test stock data retrieval
5. Check AI tutor functionality
6. Monitor error rates
7. Review logs

### Rollback Plan

If issues occur:

1. Revert to previous deployment
2. Restore database if needed
3. Investigate issues
4. Fix and redeploy

## Cost Optimization

- Use AWS Reserved Instances for predictable workloads
- Set up auto-scaling based on traffic
- Use S3 lifecycle policies for old data
- Monitor and optimize database queries
- Use CDN for static assets
- Implement efficient caching

## Support and Troubleshooting

Common issues and solutions documented in the wiki.

For support, contact the DevOps team or open an issue on GitHub.
