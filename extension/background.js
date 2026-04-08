// background.js - Manages the "Turbo Unfollow" tabs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'REQUEST_UNFOLLOW') {
        const url = `https://www.instagram.com/${request.username}/?toxic_unfollow=true`;
        
        // Open the profile in a new tab
        chrome.tabs.create({ url, active: true }, (tab) => {
            // We could optionally close it from here after a timeout, 
            // but we'll let unfollow.js handle the "done" signal.
            console.log("Turbo Unfollow initiated for:", request.username);
        });
        
        sendResponse({ status: 'initiated' });
    }
});
