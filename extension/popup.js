// Check session on load
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['toxic_session'], (result) => {
        const authView = document.getElementById('auth-view');
        const mainContainer = document.getElementById('main-container');

        if (result.toxic_session) {
            authView.style.display = 'none';
            mainContainer.style.display = 'block';
        } else {
            authView.style.display = 'block';
            mainContainer.style.display = 'none';
        }
    });
});

// Redirect to Web App for Login
document.getElementById('loginBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://toxicatracker.vercel.app/' });
});

document.getElementById('startBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url.includes('instagram.com')) {
        document.getElementById('status').innerText = 'Debes estar en una pestana de instagram.com';
        return;
    }

    document.getElementById('status').innerHTML = "Extrayendo datos... (Tarda unos segundos)<br><span style='font-size:10px'>(No cierres esta ventanita)</span>";
    document.getElementById('startBtn').disabled = true;

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scrapeInstagram
    }, (results) => {
        document.getElementById('startBtn').disabled = false;

        if (chrome.runtime.lastError) {
            document.getElementById('status').innerText = 'Error: ' + chrome.runtime.lastError.message;
            return;
        }

        if (!results || !results[0]) return;
        const data = results[0].result;

        if (data && data.error) {
            document.getElementById('status').innerText = 'Error: ' + data.error;
            return;
        }

        document.getElementById('status').innerText = 'Obtenidos! Redirigiendo...';

        chrome.storage.local.set({ toxicData: data }, () => {
            chrome.tabs.create({ url: 'https://toxicatracker.vercel.app/?mode=extension' });
        });
    });
});

async function scrapeInstagram() {
    try {
        const cookies = Object.fromEntries(
            document.cookie
                .split(';')
                .map((part) => part.trim())
                .filter(Boolean)
                .map((part) => {
                    const splitIndex = part.indexOf('=');
                    if (splitIndex === -1) return [part, ''];
                    const key = part.slice(0, splitIndex).trim();
                    const value = part.slice(splitIndex + 1).trim();
                    return [key, value];
                })
        );

        const userId = cookies.ds_user_id || '';
        const cookieUsernameRaw = cookies.ds_user || '';
        let cookieUsername = '';
        try {
            cookieUsername = decodeURIComponent(cookieUsernameRaw).trim();
        } catch (_) {
            cookieUsername = cookieUsernameRaw.trim();
        }

        if (!userId) {
            return { error: 'No se encontro sesion. Inicia sesion en Instagram desde el navegador.' };
        }

        const appId = '936619743392459';
        const csrfToken = cookies.csrftoken || '';

        const baseHeaders = {
            'X-IG-App-ID': appId,
            'X-Requested-With': 'XMLHttpRequest',
            ...(csrfToken ? { 'X-CSRFToken': decodeURIComponent(csrfToken) } : {})
        };

        async function fetchJson(url, extraHeaders = {}) {
            const res = await fetch(url, {
                headers: { ...baseHeaders, ...extraHeaders },
                credentials: 'include'
            });
            if (!res.ok) return null;
            try {
                return await res.json();
            } catch (_) {
                return null;
            }
        }

        async function fetchOwnProfile() {
            const candidates = [
                ...(cookieUsername
                    ? [`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(cookieUsername)}`]
                    : []),
                'https://www.instagram.com/api/v1/accounts/current_user/?edit=true',
                `https://www.instagram.com/api/v1/users/${userId}/info/`
            ];

            for (const url of candidates) {
                try {
                    const data = await fetchJson(url);
                    if (!data) continue;
                    const user = data?.data?.user || data?.user || data;

                    if (user?.username) {
                        const bestPic =
                            user.hd_profile_pic_url_info?.url ||
                            user.profile_pic_url_hd ||
                            user.profile_pic_url ||
                            '';

                        return {
                            username: user.username,
                            full_name: user.full_name || user.username,
                            pic: bestPic
                        };
                    }
                } catch (_) {
                    // try next source
                }
            }

            const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
            const pageTitle = document.title || '';
            const fromTitle = `${ogTitle} ${pageTitle}`.match(/\(@([a-zA-Z0-9._]+)\)/)?.[1] || '';
            const fromInstagramUrl =
                document.querySelector('meta[property="al:ios:url"]')?.getAttribute('content')?.match(/username=([a-zA-Z0-9._]+)/)?.[1] ||
                '';
            const fallbackUsername = cookieUsername || fromTitle || fromInstagramUrl || `user_${userId}`;

            const fallbackPic =
                document.querySelector('header img')?.src ||
                document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                `https://unavatar.io/instagram/${encodeURIComponent(fallbackUsername)}`;

            return {
                username: fallbackUsername,
                full_name: fallbackUsername,
                pic: fallbackPic
            };
        }

        async function fetchList(type) {
            const list = [];
            let maxId = '';
            let hasNext = true;

            while (hasNext) {
                const url = `https://www.instagram.com/api/v1/friendships/${userId}/${type}/?count=100${maxId ? '&max_id=' + maxId : ''}`;
                const res = await fetch(url, {
                    headers: baseHeaders,
                    credentials: 'include'
                });

                if (res.status === 429) {
                    await new Promise((r) => setTimeout(r, 3000));
                    continue;
                }
                if (!res.ok) throw new Error('Status ' + res.status);

                const data = await res.json();
                list.push(...data.users.map((u) => ({
                    username: u.username,
                    full_name: u.full_name,
                    pic:
                        u.hd_profile_pic_url_info?.url ||
                        u.profile_pic_url_hd ||
                        u.profile_pic_url ||
                        ''
                })));

                maxId = data.next_max_id;
                hasNext = !!maxId;

                await new Promise((r) => setTimeout(r, Math.random() * 800 + 400));
            }

            return list;
        }

        const owner = await fetchOwnProfile();
        const followers = await fetchList('followers');
        const following = await fetchList('following');

        return { owner, followers, following };
    } catch (e) {
        return { error: e.message };
    }
}
