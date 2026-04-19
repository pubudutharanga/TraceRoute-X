import type { AstroIntegration } from 'astro';

export default function indexNowSubmitter(apiKey: string, siteUrl: string): AstroIntegration {
  return {
    name: 'indexnow-submitter',
    hooks: {
      'astro:build:done': async ({ routes, logger }) => {
        logger.info('Preparing to ping IndexNow...');

        // 1. Gather all generated paths
        const urls = routes
          // Filter out endpoints and fallbacks, typically keeping standard pages
          .filter(route => route.type === 'page' && route.pathname)
          .map(route => {
            // pathname might be empty for the root, or contain leading slash. handle safely
            const pathName = route.pathname || '';
            const normalizedPath = pathName.startsWith('/') ? pathName : `/${pathName}`;
            return `${siteUrl}${normalizedPath}`;
          });

        if (urls.length === 0) {
          logger.info('No URLs found for IndexNow submission.');
          return;
        }

        logger.info(`Found ${urls.length} URLs. Submitting to IndexNow...`);

        // 2. Submit to IndexNow API
        try {
          const host = new URL(siteUrl).host;
          const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              host: host,
              key: apiKey,
              keyLocation: `${siteUrl}/${apiKey}.txt`,
              urlList: urls
            })
          });

          if (res.ok) {
            logger.info('✅ Successfully submitted to IndexNow!');
          } else {
            logger.error(`❌ Failed IndexNow Submission: ${res.statusText}`);
          }
        } catch (error) {
          logger.error('❌ Error hitting IndexNow endpoint', error);
        }
      }
    }
  };
}
