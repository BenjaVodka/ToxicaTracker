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
        const match = document.cookie.match(/ds_user_id=(\d+)/);
        if (!match) {
            return { error: 'No se encontro sesion. Inicia sesion en Instagram desde el navegador.' };
        }

        const userId = match[1];
        const appId = '936619743392459';
        const csrfToken = (document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/) || [])[1] || '';

        const baseHeaders = {
            'X-IG-App-ID': appId,
            'X-Requested-With': 'XMLHttpRequest',
            ...(csrfToken ? { 'X-CSRFToken': decodeURIComponent(csrfToken) } : {})
        };

        async function fetchOwnProfile() {
            const candidates = [
                'https://www.instagram.com/api/v1/accounts/current_user/?edit=true',
                `https://www.instagram.com/api/v1/users/${userId}/info/`
            ];

            for (const url of candidates) {
                try {
                    const res = await fetch(url, { headers: baseHeaders });
                    if (!res.ok) continue;

                    const data = await res.json();
                    const user = data?.user || data;

                    if (user?.username) {
                        return {
                            username: user.username,
                            full_name: user.full_name || user.username,
                            pic: user.profile_pic_url || user.hd_profile_pic_url_info?.url || ''
                        };
                    }
                } catch (_) {
                    // try next source
                }
            }

            const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
            const pageTitle = document.title || '';
            const fromTitle = `${ogTitle} ${pageTitle}`.match(/\(@([a-zA-Z0-9._]+)\)/)?.[1] || '';

            const fallbackPic =
                document.querySelector('header img')?.src ||
                document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                '';

            return {
                username: fromTitle || `user_${userId}`,
                full_name: fromTitle || `user_${userId}`,
                pic: fallbackPic
            };
        }

        async function fetchList(type) {
            const list = [];
            let maxId = '';
            let hasNext = true;

            while (hasNext) {
                const url = `https://www.instagram.com/api/v1/friendships/${userId}/${type}/?count=100${maxId ? '&max_id=' + maxId : ''}`;
                const res = await fetch(url, { headers: baseHeaders });

                if (res.status === 429) {
                    await new Promise((r) => setTimeout(r, 3000));
                    continue;
                }
                if (!res.ok) throw new Error('Status ' + res.status);

                const data = await res.json();
                list.push(...data.users.map((u) => ({
                    username: u.username,
                    full_name: u.full_name,
                    pic: u.profile_pic_url
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