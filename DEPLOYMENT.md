# Cloudflare Workers Deployment Guide

This Image Gallery app is configured to deploy to **Cloudflare Workers** (not Pages).

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed (already included in dev dependencies)
3. Authenticated with Cloudflare

## Authentication

First, authenticate with Cloudflare:

```bash
npx wrangler login
```

This will open a browser window for you to log in to your Cloudflare account.

## Local Development

Test the worker locally:

```bash
npm run wrangler:dev
```

This will:
1. Build the Vite app
2. Start a local Cloudflare Workers environment
3. Serve your app at `http://localhost:8787`

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

This will:
1. Build the production bundle with Vite
2. Upload the static assets to Cloudflare KV
3. Deploy the worker script
4. Provide you with a `*.workers.dev` URL

## Configuration

The deployment is configured in `wrangler.toml`:

- **name**: `image-gallery` (your worker name)
- **main**: `src/worker.js` (worker entry point)
- **site.bucket**: `./dist` (static assets directory)

## How It Works

1. **Build**: Vite builds your React app into the `dist/` folder
2. **Worker**: The worker script (`src/worker.js`) uses Cloudflare's KV Asset Handler
3. **Assets**: Static files are uploaded to Cloudflare KV storage
4. **Routing**: The worker serves assets from KV and falls back to `index.html` for SPA routing

## Custom Domain

To use a custom domain:

1. Add your domain to Cloudflare
2. Add a route in `wrangler.toml`:

```toml
routes = [
  { pattern = "yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

3. Deploy again: `npm run deploy`

## Environment Variables

If you need environment variables, add them to `wrangler.toml`:

```toml
[vars]
API_KEY = "your-api-key"
```

Or use secrets for sensitive data:

```bash
npx wrangler secret put API_KEY
```

## Troubleshooting

- **Build fails**: Run `npm run build` separately to see detailed errors
- **Assets not loading**: Check that `dist/` folder exists and contains your built files
- **Worker errors**: Check logs with `npx wrangler tail`
