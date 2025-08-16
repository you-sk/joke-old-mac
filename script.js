let windowZIndex = 100;
let activeWindow = null;
let draggedIcon = null;

function updateClock() {
    const clock = document.querySelector('.clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
}

updateClock();
setInterval(updateClock, 1000);

document.querySelectorAll('.menu-item[data-menu]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        const menuType = item.getAttribute('data-menu');
        const menu = document.getElementById(`${menuType}-menu`);
        
        document.querySelectorAll('.dropdown-menu').forEach(m => {
            if (m !== menu) m.classList.remove('show');
        });
        
        if (menu) {
            menu.style.left = item.offsetLeft + 'px';
            menu.classList.toggle('show');
        }
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
});

document.querySelectorAll('.menu-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = option.textContent;
        
        if (text === 'Shut Down') {
            showAlert('Are you sure you want to shut down?', () => {
                document.body.innerHTML = '<div style="background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Chicago;">It\'s now safe to turn off your computer.</div>';
            });
        } else if (text === 'Restart') {
            showAlert('Are you sure you want to restart?', () => {
                location.reload();
            });
        } else if (text === 'Empty Trash') {
            showAlert('Empty Trash permanently deletes items.');
        } else if (text === 'New Folder') {
            createNewFolder();
        }
        
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });
});

document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
    });
    
    icon.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const appType = icon.getAttribute('data-app');
        openApplication(appType);
    });
    
    icon.addEventListener('dragstart', (e) => {
        draggedIcon = icon;
        icon.style.opacity = '0.5';
    });
    
    icon.addEventListener('dragend', (e) => {
        icon.style.opacity = '1';
        draggedIcon = null;
    });
    
    icon.draggable = true;
});

document.getElementById('desktop').addEventListener('click', () => {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.classList.remove('selected');
    });
});

function openApplication(appType) {
    let title = '';
    let content = '';
    
    switch(appType) {
        case 'finder':
            title = 'Macintosh HD';
            content = `
                <div class="finder-window">
                    <div class="finder-item">
                        <div class="finder-item-icon">📁</div>
                        <div class="finder-item-label">Applications</div>
                    </div>
                    <div class="finder-item">
                        <div class="finder-item-icon">📁</div>
                        <div class="finder-item-label">System</div>
                    </div>
                    <div class="finder-item">
                        <div class="finder-item-icon">📁</div>
                        <div class="finder-item-label">Documents</div>
                    </div>
                    <div class="finder-item">
                        <div class="finder-item-icon">📁</div>
                        <div class="finder-item-label">Desktop</div>
                    </div>
                </div>
            `;
            break;
        case 'trash':
            title = 'Trash';
            content = '<p style="text-align: center; color: #808080;">Trash is empty</p>';
            break;
        case 'system':
            title = 'System Folder';
            content = `
                <div class="finder-window">
                    <div class="finder-item">
                        <div class="finder-item-icon">⚙️</div>
                        <div class="finder-item-label">Control Panels</div>
                    </div>
                    <div class="finder-item">
                        <div class="finder-item-icon">🔧</div>
                        <div class="finder-item-label">Extensions</div>
                    </div>
                    <div class="finder-item">
                        <div class="finder-item-icon">🖨️</div>
                        <div class="finder-item-label">Preferences</div>
                    </div>
                </div>
            `;
            break;
        case 'notepad':
            title = 'SimpleText';
            content = '<textarea class="notepad-content" placeholder="Welcome to SimpleText!\n\nType your text here..."></textarea>';
            break;
        case 'bomb':
            title = 'System Error';
            content = `
                <div class="bomb-display">💣</div>
                <div class="bomb-message">
                    Sorry, a system error occurred.<br><br>
                    <strong>Unimplemented trap</strong><br><br>
                    To temporarily turn off extensions, restart and hold down the Shift key.
                    <div class="error-code">ID = 02 Address = F0000000</div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="button" onclick="location.reload()">Restart</button>
                    <button class="button" onclick="this.closest('.window').remove()">Resume</button>
                </div>
            `;
            break;
        case 'dogcow':
            title = 'Clarus the Dogcow';
            content = `
                <div class="dogcow-game" id="dogcow-game">
                    <div class="game-score">Score: <span id="score">0</span></div>
                    <div class="dogcow" id="dogcow">🐄</div>
                </div>
                <div style="text-align: center; padding: 10px;">
                    Click anywhere to make Clarus moof!
                </div>
            `;
            setTimeout(() => initDogcowGame(), 100);
            break;
        case 'screensaver':
            title = 'After Dark - Flying Toasters';
            content = `
                <div class="screensaver-container" id="screensaver">
                </div>
            `;
            setTimeout(() => initScreensaver(), 100);
            break;
    }
    
    createWindow(title, content);
}

function createWindow(title, content) {
    const windowId = 'window-' + Date.now();
    const windowHtml = `
        <div class="window" id="${windowId}" style="top: ${50 + Math.random() * 100}px; left: ${50 + Math.random() * 100}px; width: 400px; height: 300px;">
            <div class="window-titlebar">
                <div class="window-controls">
                    <div class="window-control close-btn">✕</div>
                </div>
                <div class="window-title">${title}</div>
                <div class="window-controls">
                    <div class="window-control maximize-btn">□</div>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
            <div class="resize-handle"></div>
        </div>
    `;
    
    document.getElementById('windows-container').insertAdjacentHTML('beforeend', windowHtml);
    const windowElement = document.getElementById(windowId);
    
    makeWindowActive(windowElement);
    
    windowElement.querySelector('.close-btn').addEventListener('click', () => {
        windowElement.remove();
    });
    
    windowElement.querySelector('.maximize-btn').addEventListener('click', () => {
        windowElement.classList.toggle('maximized');
    });
    
    makeDraggable(windowElement);
    makeResizable(windowElement);
    
    windowElement.addEventListener('mousedown', () => {
        makeWindowActive(windowElement);
    });
}

function makeWindowActive(windowElement) {
    if (activeWindow) {
        activeWindow.style.zIndex = activeWindow.style.zIndex;
    }
    windowElement.style.zIndex = ++windowZIndex;
    activeWindow = windowElement;
}

function makeDraggable(windowElement) {
    const titlebar = windowElement.querySelector('.window-titlebar');
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    titlebar.addEventListener('mousedown', (e) => {
        if (windowElement.classList.contains('maximized')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = windowElement.offsetLeft;
        initialY = windowElement.offsetTop;
        
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
    });
    
    function handleDrag(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        windowElement.style.left = initialX + dx + 'px';
        windowElement.style.top = initialY + dy + 'px';
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
    }
}

function makeResizable(windowElement) {
    const resizeHandle = windowElement.querySelector('.resize-handle');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        if (windowElement.classList.contains('maximized')) return;
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = windowElement.offsetWidth;
        startHeight = windowElement.offsetHeight;
        
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
        e.preventDefault();
    });
    
    function handleResize(e) {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        windowElement.style.width = Math.max(200, startWidth + dx) + 'px';
        windowElement.style.height = Math.max(150, startHeight + dy) + 'px';
    }
    
    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    }
}

function showAlert(message, onOk) {
    const alertHtml = `
        <div class="alert-box" id="alert-${Date.now()}">
            <div class="alert-message">${message}</div>
            <div class="alert-buttons">
                <button class="button ok-btn">OK</button>
                ${onOk ? '<button class="button cancel-btn">Cancel</button>' : ''}
            </div>
        </div>
    `;
    
    document.getElementById('desktop').insertAdjacentHTML('beforeend', alertHtml);
    const alertBox = document.querySelector('.alert-box:last-child');
    
    alertBox.querySelector('.ok-btn').addEventListener('click', () => {
        if (onOk) onOk();
        alertBox.remove();
    });
    
    const cancelBtn = alertBox.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            alertBox.remove();
        });
    }
}

function createNewFolder() {
    const folderIcon = document.createElement('div');
    folderIcon.className = 'desktop-icon';
    folderIcon.draggable = true;
    folderIcon.innerHTML = `
        <div class="icon-image">📁</div>
        <div class="icon-label">New Folder</div>
    `;
    
    folderIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        folderIcon.classList.add('selected');
    });
    
    folderIcon.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        createWindow('New Folder', '<p style="text-align: center; color: #808080;">This folder is empty</p>');
    });
    
    document.getElementById('desktop-icons').appendChild(folderIcon);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

const desktop = document.getElementById('desktop');
desktop.addEventListener('dragover', (e) => {
    e.preventDefault();
});

desktop.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedIcon) {
        draggedIcon.style.position = 'absolute';
        draggedIcon.style.left = e.clientX - 32 + 'px';
        draggedIcon.style.top = e.clientY - 32 + 'px';
        desktop.appendChild(draggedIcon);
    }
});

function initDogcowGame() {
    const gameContainer = document.getElementById('dogcow-game');
    const dogcow = document.getElementById('dogcow');
    const scoreElement = document.getElementById('score');
    
    if (!gameContainer || !dogcow) return;
    
    let score = 0;
    let position = 50;
    let isMovingRight = true;
    
    const moveInterval = setInterval(() => {
        if (!document.getElementById('dogcow-game')) {
            clearInterval(moveInterval);
            return;
        }
        
        if (isMovingRight) {
            position += 2;
            if (position > gameContainer.offsetWidth - 60) {
                isMovingRight = false;
                dogcow.classList.add('flip');
            }
        } else {
            position -= 2;
            if (position < 20) {
                isMovingRight = true;
                dogcow.classList.remove('flip');
            }
        }
        dogcow.style.left = position + 'px';
    }, 50);
    
    gameContainer.addEventListener('click', (e) => {
        const rect = gameContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        dogcow.classList.add('jumping');
        setTimeout(() => dogcow.classList.remove('jumping'), 500);
        
        const moof = document.createElement('div');
        moof.className = 'moof-sound';
        moof.textContent = 'Moof!';
        moof.style.left = x + 'px';
        moof.style.top = y + 'px';
        gameContainer.appendChild(moof);
        
        setTimeout(() => moof.remove(), 1000);
        
        score += 10;
        scoreElement.textContent = score;
        
        if (score >= 100) {
            const celebration = document.createElement('div');
            celebration.style.position = 'absolute';
            celebration.style.top = '50%';
            celebration.style.left = '50%';
            celebration.style.transform = 'translate(-50%, -50%)';
            celebration.style.fontSize = '48px';
            celebration.textContent = '🎉';
            gameContainer.appendChild(celebration);
            setTimeout(() => celebration.remove(), 2000);
        }
    });
}

function initScreensaver() {
    const containers = document.querySelectorAll('#screensaver');
    const container = containers[containers.length - 1];
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(star);
    }
    
    function createToaster() {
        const toaster = document.createElement('div');
        toaster.className = 'flying-toaster';
        toaster.textContent = '🍞';
        toaster.style.top = Math.random() * 80 + '%';
        toaster.style.animationDuration = (8 + Math.random() * 4) + 's';
        container.appendChild(toaster);
        
        toaster.addEventListener('animationend', () => {
            toaster.remove();
            if (container.parentElement) {
                createToaster();
            }
        });
    }
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createToaster(), i * 3000);
    }
    
    container.addEventListener('click', () => {
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'white';
        flash.style.opacity = '0.5';
        container.appendChild(flash);
        
        setTimeout(() => flash.remove(), 100);
    });
}