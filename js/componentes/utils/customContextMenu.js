function initializeCustomContextMenu() {
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        const customMenu = document.getElementById('customMenu');
        if (!customMenu) {
            renderCustomMenu();
        }
        customMenu.style.display = 'block';
        customMenu.style.left = `${event.pageX}px`;
        customMenu.style.top = `${event.pageY}px`;
    });

    document.addEventListener('click', function() {
        const customMenu = document.getElementById('customMenu');
        if (customMenu) {
            customMenu.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'F12') {
            const customMenu = document.getElementById('customMenu');
            if (!customMenu) {
                renderCustomMenu();
            }
            customMenu.style.display = 'block';
        }
    });
}

function renderCustomMenu() {
    const customMenu = document.createElement('div');
    customMenu.id = 'customMenu';
    customMenu.classList.add('custom-menu');
    const currentTime = new Date().toLocaleTimeString();
        customMenu.innerHTML = `
            <ul>
                <li>${currentTime}</li>
            </ul>
        `;
    
    document.body.appendChild(customMenu);

   
}
renderCustomMenu()
initializeCustomContextMenu();