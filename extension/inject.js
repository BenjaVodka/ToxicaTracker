// inject.js runs on ToxicTracker web to pass local data securely
chrome.storage.local.get(['toxicData'], (result) => {
    if (result.toxicData) {
        // Send data directly to React via browser events
        window.postMessage({ type: 'TOXIC_EXTENSION_DATA', payload: result.toxicData }, '*');
        
        // Clean up memory
        chrome.storage.local.remove('toxicData');
    }
});
