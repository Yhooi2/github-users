# Setup Guide - GitHub User Analytics

## Quick Start

The application has been configured to use Vercel's development server with serverless functions. Follow these steps to get started:

### 1. Set Up GitHub Token

You need a GitHub Personal Access Token to access the GitHub GraphQL API.

#### Create Token:

1. Visit: https://github.com/settings/tokens/new
2. **Token name**: `GitHub User Analytics`
3. **Scopes** (select these):
   - ✅ `read:user` - Read user profile data
   - ✅ `user:email` - Read email addresses
4. Click **"Generate token"**
5. **Copy the token** (you won't be able to see it again!)

#### Add Token to Environment:

1. Open the file `.env.local` in the project root
2. Replace `YOUR_GITHUB_TOKEN_HERE` with your actual token:
   ```bash
   GITHUB_TOKEN=ghp_your_actual_token_here
   ```
3. Save the file

### 2. Run Development Server

Now that your token is configured, start the development server:

```bash
npm run dev
```

This will:

- Start Vercel's development server
- Run the Vite frontend on port 3000
- Enable the `/api/github-proxy` serverless function

**Note**: The first time you run `vercel dev`, it may ask you to:

- Log in to Vercel (or continue without login)
- Set up your project

You can choose **"Continue without logging in"** for local development.

### 3. Access the Application

Once running, open your browser to:

- **Application**: http://localhost:3000
- **Storybook** (separate terminal): `npm run storybook` → http://localhost:6006

## Troubleshooting

### "GITHUB_TOKEN not configured" Error

If you see a 500 error with "GITHUB_TOKEN not configured":

1. Make sure you created the `.env.local` file
2. Verify the token is set correctly (starts with `ghp_`)
3. Restart the dev server: `Ctrl+C` and run `npm run dev` again

### Port Already in Use

If port 3000 is busy:

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Vercel CLI Issues

If Vercel CLI has problems:

```bash
# Reinstall Vercel CLI
npm uninstall vercel
npm install --save-dev vercel

# Clear Vercel cache
rm -rf .vercel
```

## Development Scripts

- `npm run dev` - Start Vercel dev server (with API proxy)
- `npm run dev:vite` - Start Vite only (no API proxy)
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run storybook` - Start Storybook

## Architecture

### Why Vercel Dev?

The application uses a **backend proxy** for GitHub API requests:

- Frontend → `/api/github-proxy` → GitHub GraphQL API
- GitHub token is kept server-side (never exposed in browser)
- Enables caching with Vercel KV (optional)
- Production-ready architecture

### Alternative: Direct API Access (Not Recommended)

For quick development without Vercel, you can:

1. Use `VITE_GITHUB_TOKEN` in `.env.local`
2. Update Apollo Client to use GitHub API directly
3. Run `npm run dev:vite`

**Warning**: This exposes your token in the browser bundle!

## Next Steps

Once the server is running:

1. Search for a GitHub username (e.g., "torvalds", "gaearon")
2. Explore the user analytics and metrics
3. Check out the component library in Storybook

## Need Help?

- Project Documentation: `docs/` directory
- Component Development: `docs/component-development.md`
- Testing Guide: `docs/testing-guide.md`
- Architecture Overview: `docs/architecture.md`
