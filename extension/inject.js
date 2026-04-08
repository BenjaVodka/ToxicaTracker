// Pass data to web app
chrome.storage.local.get(['toxicData'], (result) => {
    if (result.toxicData) {
        window.postMessage({ type: 'TOXIC_EXTENSION_DATA', payload: result.toxicData }, '*');
        chrome.storage.local.remove('toxicData');
    }
});

// Capture and Sync Session
const syncSession = () => {
    const token = localStorage.getItem('toxic_session');
    if (token) {
        chrome.storage.local.set({ toxic_session: token });
    } else {
        chrome.storage.local.remove('toxic_session');
    }
};

// Initial sync
syncSession();

// Listen for messages from the React App
window.addEventListener('message', (event) => {
    // Session Updates
    if (event.data.type === 'TOXIC_SESSION_UPDATE') {
        if (event.data.token) {
            chrome.storage.local.set({ toxic_session: event.data.token });
        } else {
            chrome.storage.local.remove('toxic_session');
        }
    }

    // Unfollow commands
    if (event.data.type === 'TOXIC_TURBO_UNFOLLOW' && event.data.username) {
        chrome.runtime.sendMessage({ 
            type: 'REQUEST_UNFOLLOW', 
            username: event.data.username 
        });
    }
});
