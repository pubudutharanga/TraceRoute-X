/**
 * IndexNow Protocol Implementation
 * https://www.indexnow.org/documentation
 */

const INDEXNOW_API_KEY = 'dcaf3c5ee7764f1682bc927ce510e7f4';

/**
 * Pings the IndexNow API to notify search engines about URL changes.
 * @param urls An array of URLs that have been added, updated, or deleted.
 */
export async function submitToIndexNow(urls: string[]) {
  if (!urls || urls.length === 0) {
    console.log('No URLs provided for IndexNow submission.');
    return;
  }

  // Determine the host based on the SITE_URL env variable, fallback to localhost for development
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let host = '';

  try {
    const parsedUrl = new URL(siteUrl);
    host = parsedUrl.host;
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_SITE_URL environment variable:', siteUrl);
    return;
  }

  // The central IndexNow API endpoint that distributes to all participating search engines (Bing, Yandex, etc.)
  const endpoint = 'https://api.indexnow.org/indexnow';

  const payload = {
    host: host,
    key: INDEXNOW_API_KEY,
    keyLocation: `${siteUrl}/${INDEXNOW_API_KEY}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`Successfully submitted ${urls.length} URL(s) to IndexNow.`);
    } else {
      console.error(
        `Failed to submit to IndexNow. Status: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
  }
}
