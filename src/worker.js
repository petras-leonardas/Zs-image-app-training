import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    try {
      // Try to serve the asset from KV
      const options = {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
      }
      
      // Only parse manifest if it exists and is a string
      if (env.__STATIC_CONTENT_MANIFEST) {
        if (typeof env.__STATIC_CONTENT_MANIFEST === 'string') {
          options.ASSET_MANIFEST = JSON.parse(env.__STATIC_CONTENT_MANIFEST)
        } else {
          options.ASSET_MANIFEST = env.__STATIC_CONTENT_MANIFEST
        }
      }
      
      const response = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil ? ctx.waitUntil.bind(ctx) : () => {},
        },
        options
      )
      
      // Add CORS headers for development
      const headers = new Headers(response.headers)
      headers.set('Access-Control-Allow-Origin', '*')
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    } catch (e) {
      // If asset not found, serve index.html for SPA routing
      // Don't serve index.html for actual asset requests (like .jpg, .css, .js)
      const hasExtension = /\.[a-zA-Z0-9]+$/.test(url.pathname)
      
      if (!hasExtension || url.pathname === '/') {
        try {
          const indexOptions = {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
          }
          
          if (env.__STATIC_CONTENT_MANIFEST) {
            if (typeof env.__STATIC_CONTENT_MANIFEST === 'string') {
              indexOptions.ASSET_MANIFEST = JSON.parse(env.__STATIC_CONTENT_MANIFEST)
            } else {
              indexOptions.ASSET_MANIFEST = env.__STATIC_CONTENT_MANIFEST
            }
          }
          
          const indexResponse = await getAssetFromKV(
            {
              request: new Request(`${url.origin}/index.html`, request),
              waitUntil: ctx.waitUntil ? ctx.waitUntil.bind(ctx) : () => {},
            },
            indexOptions
          )
          
          const headers = new Headers(indexResponse.headers)
          headers.set('Access-Control-Allow-Origin', '*')
          headers.set('Content-Type', 'text/html')
          
          return new Response(indexResponse.body, {
            status: 200,
            headers,
          })
        } catch (e) {
          return new Response('Not Found', { status: 404 })
        }
      }
      
      return new Response(`Asset not found: ${url.pathname}`, { status: 404 })
    }
  },
}
