// This file handles loading all external dependencies via CDN

// Create a global object to store our loaded modules
window.NearModules = {};

// Load the Buffer module
async function loadBuffer() {
  try {
    // Load buffer from a CDN
    await import('https://cdn.jsdelivr.net/npm/buffer@6.0.3/index.js');
    window.NearModules.Buffer = window.buffer.Buffer;
    console.log('Buffer loaded successfully');
    return window.NearModules.Buffer;
  } catch (error) {
    console.error('Failed to load Buffer:', error);
    return null;
  }
}

// Load the NEAR API JS module
async function loadNearApi() {
  try {
    // Load near-api-js from a CDN
    await import('https://cdn.jsdelivr.net/npm/near-api-js@2.1.4/dist/near-api-js.min.js');
    window.NearModules.nearApi = window.nearApi;
    console.log('NEAR API loaded successfully');
    return window.NearModules.nearApi;
  } catch (error) {
    console.error('Failed to load NEAR API:', error);
    return null;
  }
}

// Function to load all modules
export async function loadAllModules() {
  await Promise.all([
    loadBuffer(),
    loadNearApi()
  ]);
  
  console.log('All modules loaded successfully');
  return window.NearModules;
}

// Export direct references to make imports cleaner
export const getBuffer = () => window.NearModules.Buffer;
export const getNearApi = () => window.NearModules.nearApi; 