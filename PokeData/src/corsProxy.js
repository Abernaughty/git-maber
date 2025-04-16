// Enhanced fetch with detailed debugging - relies on your API Management service to handle CORS
export async function fetchWithProxy(url, options = {}) {
  // Just use the standard fetch with the provided options
  try {
    console.log(`Fetching from: ${url}`);
    
    // Enhanced header debugging
    if (options.headers) {
      console.log('Headers summary:');
      
      // Check Authorization header
      const authHeader = options.headers['Authorization'] || options.headers['authorization'];
      if (authHeader) {
        console.log('- Authorization header present:', 
          authHeader.substring(0, 10) + '...' + 
          (authHeader.length > 20 ? authHeader.substring(authHeader.length - 4) : ''));
        console.log('- Authorization header length:', authHeader.length);
        
        // Check if it's just "Bearer " without a token
        if (authHeader === 'Bearer ' || authHeader === 'Bearer') {
          console.warn('⚠️ Authorization header contains "Bearer" but no token!');
        }
      } else {
        console.warn('⚠️ No Authorization header found!');
      }
      
      // Check Subscription Key header
      const subKeyHeader = options.headers['Ocp-Apim-Subscription-Key'] || 
                          options.headers['ocp-apim-subscription-key'];
      if (subKeyHeader) {
        console.log('- Subscription Key present:', 
          subKeyHeader.substring(0, 4) + '...' + 
          (subKeyHeader.length > 8 ? subKeyHeader.substring(subKeyHeader.length - 4) : ''));
        console.log('- Subscription Key length:', subKeyHeader.length);
      } else {
        console.warn('⚠️ No Subscription Key header found!');
      }
      
      // Log all headers for debugging
      console.log('All headers:');
      Object.entries(options.headers).forEach(([key, value]) => {
        // Mask the actual values for security
        const maskedValue = typeof value === 'string' && value.length > 8 
          ? value.substring(0, 4) + '...' + value.substring(value.length - 4) 
          : value;
        console.log(`- ${key}: ${maskedValue}`);
      });
    } else {
      console.warn('⚠️ No headers provided in request options!');
    }
    
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Use CORS mode to allow cross-origin requests
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to get error details');
      console.error(`HTTP Error: ${response.status} - ${response.statusText}\nURL: ${url}\nDetails: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Fetch error for URL [${url}]:`, error);
    throw error;
  }
}
