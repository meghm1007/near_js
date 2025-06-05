// This file handles access to the NEAR API loaded via CDN

// Create a global object to store our loaded modules
window.NearModules = {};

// Check if Buffer is already loaded from the script tag
function initBuffer() {
  if (typeof window.buffer !== 'undefined' && window.buffer.Buffer) {
    window.NearModules.Buffer = window.buffer.Buffer;
    console.log('Buffer loaded from global scope');
    return true;
  }
  console.error('Buffer not found in global scope');
  return false;
}

// Check if NEAR API is already loaded from the script tag
function initNearApi() {
  if (typeof window.nearApi !== 'undefined') {
    window.NearModules.nearApi = window.nearApi;
    console.log('NEAR API loaded from global scope');
    return true;
  }
  console.error('NEAR API not found in global scope');
  return false;
}

// Initialize modules
function initModules() {
  const bufferLoaded = initBuffer();
  const nearApiLoaded = initNearApi();
  return bufferLoaded && nearApiLoaded;
}

// Try to initialize immediately
initModules();

// Function to load all modules - now just returns the modules since they're loaded by script tags
export async function loadAllModules() {
  return new Promise((resolve) => {
    // Small delay to ensure scripts are fully processed
    setTimeout(() => {
      const modulesLoaded = initModules();
      if (modulesLoaded) {
        console.log('All modules loaded successfully');
      } else {
        console.warn('Some modules failed to load, check script tags');
      }
      resolve(window.NearModules);
    }, 100);
  });
}

// Export direct references to make imports cleaner
export const getBuffer = () => window.NearModules.Buffer || (window.buffer && window.buffer.Buffer);
export const getNearApi = () => window.NearModules.nearApi || window.nearApi; 