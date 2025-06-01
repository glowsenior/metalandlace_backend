# 🔧 Git Setup Guide - Seramic Backend

## 📋 Quick Git Initialization

### 1. Initialize Git Repository
```bash
git init
```

### 2. Add All Files
```bash
git add .
```

### 3. Initial Commit
```bash
git commit -m "🎉 Initial commit: Seramic Backend API with complete e-commerce functionality

✅ Features included:
- Express.js server with security middleware
- MongoDB integration with Mongoose ODM
- Complete Product, User, Order models
- RESTful API endpoints with CRUD operations
- File upload system with Cloudinary integration
- JWT authentication structure
- Comprehensive error handling
- Database seeding with sample ceramic products
- Postman API collection for testing
- Production-ready configuration

🚀 Ready for development and deployment"
```

## 🌐 Connect to Remote Repository

### Option 1: GitHub
```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/yourusername/seramic-backend.git
git branch -M main
git push -u origin main
```

### Option 2: GitLab
```bash
git remote add origin https://gitlab.com/yourusername/seramic-backend.git
git branch -M main
git push -u origin main
```

### Option 3: Bitbucket
```bash
git remote add origin https://bitbucket.org/yourusername/seramic-backend.git
git branch -M main
git push -u origin main
```

## 📁 What's Included in Repository

### ✅ **Tracked Files:**
- **Source Code** - All `/src` directory files
- **Configuration** - `package.json`, `.env.example`
- **Documentation** - README.md, SETUP.md, API docs
- **Postman Collection** - API testing files
- **Scripts** - Database seeding, testing utilities
- **Git Configuration** - `.gitignore`, this guide

### ❌ **Ignored Files:**
- **Dependencies** - `node_modules/`, `package-lock.json`
- **Environment** - `.env` (sensitive data)
- **Logs** - All log files
- **Temporary Files** - Cache, build artifacts
- **IDE Files** - `.vscode/`, `.idea/`
- **OS Files** - `.DS_Store`, `Thumbs.db`
- **Upload Directories** - User uploaded files
- **Database Files** - Local database files

## 🔒 Environment Variables Setup

### 1. Create .env.example
```bash
# Copy your .env to create a template
cp .env .env.example
```

### 2. Remove Sensitive Values
Edit `.env.example` and replace actual values with placeholders:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=90d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_FROM=noreply@yourapp.com
SENDGRID_API_KEY=your_sendgrid_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Add .env.example to Git
```bash
git add .env.example
git commit -m "📝 Add environment variables template"
```

## 🌿 Branching Strategy

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/product-reviews
git checkout -b feature/user-authentication
git checkout -b feature/payment-integration

# Create bugfix branch
git checkout -b bugfix/order-calculation
git checkout -b hotfix/security-patch

# Create release branch
git checkout -b release/v1.0.0
```

### Recommended Branch Structure
```
main (production)
├── develop (development)
├── feature/user-authentication
├── feature/product-reviews
├── feature/payment-integration
├── bugfix/order-calculation
└── release/v1.0.0
```

## 📝 Commit Message Conventions

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
git commit -m "feat(products): add image upload functionality"
git commit -m "fix(orders): correct total calculation logic"
git commit -m "docs(api): update endpoint documentation"
git commit -m "refactor(auth): improve JWT token handling"
git commit -m "test(users): add user registration tests"
git commit -m "chore(deps): update dependencies to latest versions"
```

## 🚀 Deployment Branches

### Production Deployment
```bash
# Deploy to production
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

### Staging Deployment
```bash
# Deploy to staging
git checkout staging
git merge develop
git push origin staging
```

## 🔄 Common Git Workflows

### Daily Development
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "feat: implement new feature"

# Push feature branch
git push origin feature/new-feature

# Create pull request on GitHub/GitLab
# After review and approval, merge to develop
```

### Hotfix Workflow
```bash
# Critical bug in production
git checkout main
git checkout -b hotfix/critical-bug

# Fix the bug
git add .
git commit -m "fix: resolve critical security issue"

# Merge to main and develop
git checkout main
git merge hotfix/critical-bug
git checkout develop
git merge hotfix/critical-bug

# Tag and deploy
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main develop --tags
```

## 📊 Repository Statistics

### Check Repository Status
```bash
git status                    # Current status
git log --oneline -10        # Recent commits
git branch -a                # All branches
git remote -v                # Remote repositories
```

### Repository Size
```bash
git count-objects -vH        # Repository size
git ls-files | wc -l         # Number of tracked files
```

## 🛡️ Security Best Practices

### 1. Never Commit Sensitive Data
- API keys, passwords, tokens
- Database credentials
- SSL certificates
- User data

### 2. Use .gitignore Properly
- Keep `.gitignore` updated
- Add patterns for new file types
- Review before committing

### 3. Environment Variables
- Use `.env` files for secrets
- Provide `.env.example` template
- Document required variables

### 4. Regular Security Audits
```bash
npm audit                    # Check for vulnerabilities
git log --grep="password"    # Search for accidentally committed secrets
```

## 🔧 Git Configuration

### Set User Information
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Useful Aliases
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

### Line Ending Configuration
```bash
# Windows
git config --global core.autocrlf true

# macOS/Linux
git config --global core.autocrlf input
```

## 📋 Pre-commit Checklist

Before committing, ensure:
- [ ] Code is tested and working
- [ ] No sensitive data in commit
- [ ] `.env` file is not included
- [ ] Code follows project standards
- [ ] Documentation is updated
- [ ] Commit message is descriptive

## 🚨 Emergency Procedures

### Undo Last Commit (Not Pushed)
```bash
git reset --soft HEAD~1      # Keep changes staged
git reset --hard HEAD~1      # Discard changes
```

### Remove File from Git History
```bash
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch path/to/file' \
--prune-empty --tag-name-filter cat -- --all
```

### Recover Deleted Branch
```bash
git reflog                   # Find commit hash
git checkout -b recovered-branch <commit-hash>
```

## 📈 Repository Maintenance

### Clean Up
```bash
git gc                       # Garbage collection
git prune                    # Remove unreachable objects
git remote prune origin      # Clean up remote references
```

### Update Dependencies
```bash
npm update                   # Update packages
git add package.json package-lock.json
git commit -m "chore(deps): update dependencies"
```

## 🎯 Next Steps

1. **Initialize Repository**: Run the quick setup commands
2. **Create Remote**: Set up GitHub/GitLab repository
3. **Set Up CI/CD**: Configure automated testing and deployment
4. **Add Collaborators**: Invite team members
5. **Create Issues**: Track features and bugs
6. **Set Up Webhooks**: Integrate with deployment services

## 📞 Support

For Git-related issues:
- Check Git documentation: `git help <command>`
- Use Git GUI tools: GitKraken, SourceTree, GitHub Desktop
- Online resources: GitHub Guides, Atlassian Git tutorials

**Happy coding with version control!** 🎉