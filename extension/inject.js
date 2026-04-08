const ALLOWED_ORIGINS = new Set([
    "http://localhost:5173",
    "https://toxicatracker.vercel.app"
]);

const MESSAGE_TYPES = {
    extensionData: "TOXIC_EXTENSION_DATA",
    extensionDataRequest: "TOXIC_EXTENSION_DATA_REQUEST",
    sessionUpdate: "TOXIC_SESSION_UPDATE",
    turboUnfollow: "TOXIC_TURBO_UNFOLLOW"
};

const isTrustedOrigin = ALLOWED_ORIGINS.has(window.location.origin);
if (!isTrustedOrigin) {
    console.warn("ToxicTracker inject.js blocked on non-trusted origin:", window.location.origin);
} else {
    const postExtensionData = (removeAfterSend = false) => {
        chrome.storage.local.get(["toxicData"], (result) => {
            if (!result.toxicData) return;
            window.postMessage(
                { type: MESSAGE_TYPES.extensionData, payload: result.toxicData },
                window.location.origin
            );
            if (removeAfterSend) {
                chrome.storage.local.remove("toxicData");
            }
        });
    };

    // Intento inicial (si la app ya está lista lo recibe al tiro)
    postExtensionData(false);

    // Capture and Sync Session
    const syncSession = () => {
        const token = localStorage.getItem("toxic_token") || localStorage.getItem("toxic_session");
        if (token) {
            chrome.storage.local.set({ toxic_session: token, toxic_token: token });
        } else {
            chrome.storage.local.remove(["toxic_session", "toxic_token"]);
        }
    };

    // Initial sync
    syncSession();

    // Listen for messages from the React App
    window.addEventListener("message", (event) => {
        if (event.source !== window || event.origin !== window.location.origin) {
            return;
        }

        const data = event.data;
        if (!data || typeof data !== "object") {
            return;
        }

        if (data.type === MESSAGE_TYPES.extensionDataRequest) {
            postExtensionData(true);
            return;
        }

        // Session Updates
        if (data.type === MESSAGE_TYPES.sessionUpdate) {
            if (typeof data.token === "string" && data.token.length > 0) {
                chrome.storage.local.set({ toxic_session: data.token, toxic_token: data.token });
            } else {
                chrome.storage.local.remove(["toxic_session", "toxic_token"]);
            }
            return;
        }

        // Unfollow commands
        if (data.type === MESSAGE_TYPES.turboUnfollow && typeof data.username === "string" && data.username.trim()) {
            chrome.runtime.sendMessage({
                type: "REQUEST_UNFOLLOW",
                username: data.username.trim()
            });
        }
    });
}
