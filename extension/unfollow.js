// unfollow.js - Runs ON instagram.com profile pages
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('toxic_unfollow')) return;

    console.log("TóxicaTracker: Modo Turbo activado para este perfil.");

    function findButtonByText(textArr) {
        const buttons = document.querySelectorAll('button');
        return Array.from(buttons).find(btn => 
            textArr.some(text => btn.textContent.includes(text))
        );
    }

    async function startUnfollowProcess() {
        // Step 1: Wait for page to load a bit
        await new Promise(r => setTimeout(r, 2500)); 

        // Step 2: Find "Following" button (might be "Siguiendo" in Spanish)
        let followingBtn = findButtonByText(['Following', 'Siguiendo']);
        
        if (followingBtn) {
            followingBtn.click();
            console.log("TóxicaTracker: Clic en 'Siguiendo'...");

            // Step 2: Wait for modal to appear
            await new Promise(r => setTimeout(r, 1500));

            // Step 3: Find "Unfollow" confirmation button
            let confirmBtn = findButtonByText(['Unfollow', 'Dejar de seguir']);
            if (confirmBtn) {
                confirmBtn.click();
                console.log("TóxicaTracker: ¡Unfollow realizado!");
                
                // Step 4: Final wait and close
                await new Promise(r => setTimeout(r, 1500));
                window.close();
            } else {
                console.warn("TóxicaTracker: No se encontró botón de confirmación.");
            }
        } else {
            console.warn("TóxicaTracker: No se encontró el botón de 'Siguiendo'. ¿Quizás ya no lo sigues?");
            await new Promise(r => setTimeout(r, 2000));
            window.close();
        }
    }

    // Execute
    if (document.readyState === 'complete') {
        startUnfollowProcess();
    } else {
        window.addEventListener('load', startUnfollowProcess);
    }
})();
