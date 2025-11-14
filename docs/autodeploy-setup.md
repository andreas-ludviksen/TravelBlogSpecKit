# Autodeploy Setup for Cloudflare

This guide shows how to set up automatic deployments for both Cloudflare Workers and Pages using GitHub Actions.

When you push code to GitHub, both Workers and Pages will automatically deploy to Cloudflare.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Cloudflare API Token](#step-1-create-cloudflare-api-token)
4. [Step 2: Add GitHub Secrets](#step-2-add-github-secrets)
5. [Step 3: Deploy Workflows](#step-3-deploy-workflows)
6. [Step 4: Test Autodeploy](#step-4-test-autodeploy)
7. [Workflow Behavior](#workflow-behavior)
8. [Monitoring and Rollback](#monitoring-and-rollback)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Both Cloudflare Workers and Pages will autodeploy using GitHub Actions:

- **Workers**: Deploys when `travel-blog/workers/**` files change
- **Pages**: Deploys when any `travel-blog/**` files change
- **Tests run first**: Deployments fail if tests fail
- **Manual trigger**: Can be triggered manually from GitHub Actions tab

---

## Prerequisites

- ✅ GitHub repository with code pushed
- ✅ Cloudflare account with Workers and Pages already deployed once manually
- ✅ Node.js 18+ and npm installed locally (for testing)

---

## Step 1: Create Cloudflare API Token

### 1.1 Navigate to API Tokens

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click your profile icon (top right)
3. Select **My Profile** → **API Tokens**

### 1.2 Create Token

1. Click **Create Token**
2. Use template: **Edit Cloudflare Workers**
3. Click **Use template**

### 1.3 Configure Permissions

Set these permissions:

| Resource | Permission |
|----------|------------|
| Account → Workers Scripts | Edit |
| Account → Workers KV Storage | Edit |
| Account → D1 | Edit |
| Account → Cloudflare Pages | Edit |

### 1.4 Set Account Resources

- **Account Resources**: Include → Select your account

### 1.5 Complete Token Creation

1. Click **Continue to summary**
2. Review permissions
3. Click **Create Token**
4. **Copy the token immediately** (you won't see it again!)

Example token format:
```
abc123def456ghi789jkl012mno345pqr678stu
```

---

## Step 2: Add GitHub Secrets

### 2.1 Find Your Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Workers & Pages** in sidebar
3. Your **Account ID** is shown in the right column

Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### 2.2 Add Secrets to GitHub Repository

1. Go to your GitHub repository: `https://github.com/andreas-ludviksen/firstSpecKitProject`
2. Click **Settings** (top menu)
3. In sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

Add these two secrets:

**Secret 1:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: (paste the API token from Step 1.5)
- Click **Add secret**

**Secret 2:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: (paste your Account ID from Step 2.1)
- Click **Add secret**

### 2.3 Verify Secrets

You should now see two secrets listed:
- ✅ `CLOUDFLARE_API_TOKEN`
- ✅ `CLOUDFLARE_ACCOUNT_ID`

---

## Step 3: Deploy Workflows

The workflows are already created in your repository:
- `.github/workflows/deploy-workers.yml`
- `.github/workflows/deploy-pages.yml`

### 3.1 Commit and Push Workflows

If you haven't already pushed the workflows:

```bash
git add .github/workflows/
git commit -m "Add autodeploy workflows for Workers and Pages"
git push origin main
```

### 3.2 Verify Workflows Exist

1. Go to GitHub repository
2. Click **Actions** tab
3. You should see two workflows:
   - **Deploy Workers**
   - **Deploy Pages**

---

## Step 4: Test Autodeploy

### 4.1 Trigger Manual Deployment

Test that everything works:

1. Go to GitHub repository → **Actions** tab
2. Click **Deploy Workers** workflow
3. Click **Run workflow** dropdown
4. Select branch `main`
5. Click **Run workflow**
6. Watch the deployment progress

Repeat for **Deploy Pages** workflow.

### 4.2 Test Automatic Deployment

Make a small change and push:

**Bash:**
```bash
# Edit a file
echo "# Test autodeploy" >> travel-blog/README.md

# Commit and push
git add travel-blog/README.md
git commit -m "Test autodeploy"
git push origin main
```

**PowerShell:**
```powershell
# Edit a file
"# Test autodeploy" | Add-Content travel-blog/README.md

# Commit and push
git add travel-blog/README.md
git commit -m "Test autodeploy"
git push origin main
```

### 4.3 Watch Deployment

1. Go to GitHub → **Actions** tab
2. You should see a new workflow run appear
3. Click it to see live logs
4. Wait for ✅ completion (usually 2-3 minutes)

---

## Workflow Behavior

### When Workers Deploy

The **Deploy Workers** workflow runs when:

✅ Files in `travel-blog/workers/**` change  
✅ `travel-blog/wrangler.toml` changes  
✅ `.github/workflows/deploy-workers.yml` changes  
✅ Manually triggered from Actions tab  

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Run tests (`npm test`)
5. Deploy to Cloudflare Workers

**If tests fail:** Deployment is skipped ❌

### When Pages Deploy

The **Deploy Pages** workflow runs when:

✅ Any files in `travel-blog/**` change  
✅ `.github/workflows/deploy-pages.yml` changes  
✅ Manually triggered from Actions tab  

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Run tests (`npm test`)
5. Build Next.js site (`npm run build`)
6. Deploy to Cloudflare Pages

**If tests or build fail:** Deployment is skipped ❌

### Smart Triggering

- **Change only Workers code**: Only Workers workflow runs
- **Change only Pages code**: Only Pages workflow runs
- **Change both**: Both workflows run in parallel
- **Change other files**: No workflows run

---

## Monitoring and Rollback

### Monitoring Deployments

**GitHub Actions:**
1. Go to repository → **Actions** tab
2. See all workflow runs and their status
3. Click a run to see detailed logs
4. Green ✅ = Success, Red ❌ = Failed

**Cloudflare Dashboard:**
1. **Workers**: Dashboard → Workers & Pages → `travel-blog-auth` → View logs
2. **Pages**: Dashboard → Workers & Pages → `travel-blog-4my` → Deployments

### Rollback Workers

**Option 1: Use Wrangler Rollback**

```bash
# List recent deployments
npx wrangler deployments list

# Rollback to previous version
npx wrangler rollback --message "Rollback due to bug"
```

**Option 2: Redeploy Previous Commit**

**Bash:**
```bash
# Find the commit hash
git log --oneline

# Checkout previous commit
git checkout <commit-hash>

# Redeploy manually
cd travel-blog
npx wrangler deploy

# Return to main branch
git checkout main
```

**PowerShell:**
```powershell
# Find the commit hash
git log --oneline

# Checkout previous commit
git checkout <commit-hash>

# Redeploy manually
cd travel-blog
npx wrangler deploy

# Return to main branch
git checkout main
```

### Rollback Pages

**Via Cloudflare Dashboard:**
1. Go to Dashboard → Workers & Pages → `travel-blog-4my`
2. Click **Deployments** tab
3. Find the previous successful deployment
4. Click **...** → **Rollback to this deployment**

**Via Redeployment:**
Follow same steps as Workers rollback above, but use:
```bash
npx wrangler pages deploy out --project-name=travel-blog-4my
```

---

## Troubleshooting

### ❌ Workflow Fails: "Unauthorized"

**Problem:** GitHub Actions can't authenticate with Cloudflare

**Solution:**
1. Verify `CLOUDFLARE_API_TOKEN` is correct in GitHub Secrets
2. Check token hasn't expired (go to Cloudflare → API Tokens)
3. Verify token has these permissions:
   - Workers Scripts: Edit
   - Workers KV Storage: Edit
   - D1: Edit
   - Cloudflare Pages: Edit
4. Recreate token if needed

### ❌ Workflow Fails: "Tests Failed"

**Problem:** `npm test` fails

**Solution:**
1. Run tests locally: `cd travel-blog && npm test`
2. Fix failing tests
3. Commit and push fixes
4. Workflow will run again automatically

### ❌ Workflow Fails: "Build Failed"

**Problem:** Next.js build fails

**Solution:**
1. Run build locally: `cd travel-blog && npm run build`
2. Fix TypeScript errors or build issues
3. Commit and push fixes

### ❌ Workers Deploy but Don't Work

**Problem:** Deployment succeeds but API returns errors

**Solution:**
1. Check Wrangler logs: `npx wrangler tail travel-blog-auth`
2. Verify environment variables in `wrangler.toml`
3. Check D1 database binding is correct
4. Test locally first: `npx wrangler dev`

### ❌ Pages Deploy but Show Old Version

**Problem:** Deployment succeeds but site shows stale content

**Solution:**
1. Check deployment ID in Cloudflare dashboard
2. Clear browser cache (Ctrl+Shift+R)
3. Wait 1-2 minutes for CDN propagation
4. Verify correct deployment is "Active"

### ⚠️ Workflow Runs on Every Push

**Problem:** Want to push without triggering deployment

**Solution:**
Add `[skip ci]` to commit message:

```bash
git commit -m "Update documentation [skip ci]"
```

This skips all GitHub Actions workflows.

---

## Security Best Practices

✅ **Never commit API tokens** to git  
✅ **Use GitHub Secrets** for sensitive values  
✅ **Rotate API tokens** regularly (every 90 days)  
✅ **Limit token permissions** to only what's needed  
✅ **Enable branch protection** on `main`:
   - Require pull request reviews
   - Require status checks to pass
   - Prevent force pushes
✅ **Review workflow logs** for suspicious activity  

---

## Next Steps

- ✅ Set up autodeploy for Workers
- ✅ Set up autodeploy for Pages
- 📝 Configure branch protection rules
- 📝 Set up deployment notifications (Slack/Discord)
- 📝 Create staging environment (optional)
- 📝 Document rollback procedures for team

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Wrangler Action](https://github.com/cloudflare/wrangler-action)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

