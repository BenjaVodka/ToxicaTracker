document.getElementById('startBtn').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url.includes("instagram.com")) {
        document.getElementById('status').innerText = "❌ Debes estar en una pestaña de instagram.com";
        return;
    }

    document.getElementById('status').innerHTML = "🔄 Extrayendo datos... (Tarda unos segundos)<br><span style='font-size:10px'>(No cierres esta ventanita)</span>";
    document.getElementById('startBtn').disabled = true;

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scrapeInstagram
    }, (results) => {
        document.getElementById('startBtn').disabled = false;
        
        if (chrome.runtime.lastError) {
             document.getElementById('status').innerText = "❌ Error: " + chrome.runtime.lastError.message;
             return;
        }
        
        if (!results || !results[0]) return;
        const data = results[0].result;
        
        if(data && data.error) {
             document.getElementById('status').innerText = "❌ Error: " + data.error;
             return;
        }

        document.getElementById('status').innerText = `✅ ¡Obtenidos! Redirigiendo...`;
        
        chrome.storage.local.set({ toxicData: data }, () => {
             chrome.tabs.create({ url: "http://localhost:5173/?mode=extension" });
        });
    });
});

async function scrapeInstagram() {
    try {
        const match = document.cookie.match(/ds_user_id=(\d+)/);
        if (!match) return { error: "No se encontró sesión. Inicia sesión en Instagram desde el navegador." };
        const userId = match[1];

        const appId = "936619743392459"; 

        async function fetchList(type) {
            let list = [];
            let maxId = "";
            let hasNext = true;
            while(hasNext) {
                const url = `https://www.instagram.com/api/v1/friendships/${userId}/${type}/?count=100${maxId ? "&max_id="+maxId : ""}`;
                const res = await fetch(url, {
                    headers: {
                        "X-IG-App-ID": appId,
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });
                
                if(res.status === 429) {
                    await new Promise(r => setTimeout(r, 3000));
                    continue;
                }
                if(!res.ok) throw new Error("Status " + res.status);
                
                const data = await res.json();
                list.push(...data.users.map(u => ({ username: u.username, full_name: u.full_name, pic: u.profile_pic_url })));
                
                maxId = data.next_max_id;
                hasNext = !!maxId;
                
                await new Promise(r => setTimeout(r, Math.random() * 800 + 400));
            }
            return list;
        }

        const followers = await fetchList('followers');
        const following = await fetchList('following');

        return { followers, following };

    } catch (e) {
        return { error: e.message };
    }
}
