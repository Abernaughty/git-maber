// Simple direct fetch - relies on your API Management service to handle CORS
export async function fetchWithProxy(url, options = {}) {
  // Just use the standard fetch with the provided options
  try {
    console.log(`Fetching from: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Use CORS mode to allow cross-origin requests
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}