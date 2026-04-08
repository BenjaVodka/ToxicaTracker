// inject.js runs on ToxicTracker web to pass local data and commands
chrome.storage.local.get(['toxicData'], (result) => {
    if (result.toxicData) {
        window.postMessage({ type: 'TOXIC_EXTENSION_DATA', payload: result.toxicData }, '*');
        chrome.storage.local.remove('toxicData');
    }
});

// Listen for Turbo Unfollow commands from the React App
window.addEventListener('message', (event) => {
    if (event.data.type === 'TOXIC_TURBO_UNFOLLOW' && event.data.username) {
        chrome.runtime.sendMessage({ 
            type: 'REQUEST_UNFOLLOW', 
            username: event.data.username 
        });
    }
});
