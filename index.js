// index.js
const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  shell,
  clipboard,
  globalShortcut
} = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let notesWindow = null;

// Optional: experiment later turning this on/off for your old Mac.
// For now we leave hardware acceleration ON (commented out below).
// app.disableHardwareAcceleration();

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    title: 'GPT', // Window title
    show: false,  // Create hidden, then show when ready (avoids white flash)
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: false,          // tiny perf win
      contextIsolation: true,     // default safety
      nodeIntegration: false      // keep renderer lean
    }
  });

  mainWindow.loadURL('https://chatgpt.com');

  // Show only when ready to paint
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function ensureMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
  } else {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
}

function newChat() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
  } else {
    mainWindow.loadURL('https://chatgpt.com');
  }
}

async function saveChatAsPdf() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  try {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Chat as PDF',
      defaultPath: 'chatgpt-chat.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) return;

    const pdfData = await mainWindow.webContents.printToPDF({
      pageSize: 'A4',
      printBackground: true
    });

    await fs.promises.writeFile(filePath, pdfData);
  } catch (err) {
    console.error('Failed to save PDF:', err);
    dialog.showErrorBox('Save Chat as PDF Failed', String(err.message || err));
  }
}

async function saveChatAsText() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  try {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Chat as Text',
      defaultPath: 'chatgpt-chat.txt',
      filters: [{ name: 'Text', extensions: ['txt'] }]
    });

    if (canceled || !filePath) return;

    const text = await mainWindow.webContents.executeJavaScript(
      'document.body.innerText',
      true
    );

    await fs.promises.writeFile(filePath, text || '', 'utf8');
  } catch (err) {
    console.error('Failed to save text:', err);
    dialog.showErrorBox('Save Chat as Text Failed', String(err.message || err));
  }
}

async function screenshotWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  try {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Screenshot',
      defaultPath: 'gpt-window.png',
      filters: [{ name: 'PNG Image', extensions: ['png'] }]
    });

    if (canceled || !filePath) return;

    const image = await mainWindow.webContents.capturePage();
    const pngBuffer = image.toPNG();

    await fs.promises.writeFile(filePath, pngBuffer);
  } catch (err) {
    console.error('Failed to save screenshot:', err);
    dialog.showErrorBox('Screenshot Failed', String(err.message || err));
  }
}

function copyChatUrl() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const url = mainWindow.webContents.getURL();
  if (!url) return;
  try {
    clipboard.writeText(url);
  } catch (err) {
    console.error('Failed to copy URL:', err);
    dialog.showErrorBox('Copy URL Failed', String(err.message || err));
  }
}

function openInBrowser() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const url = mainWindow.webContents.getURL();
  if (!url) return;
  shell.openExternal(url).catch(err => {
    console.error('Failed to open in browser:', err);
    dialog.showErrorBox('Open in Browser Failed', String(err.message || err));
  });
}

function resetWindowSize() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.setSize(900, 700);
  mainWindow.center();
}

function createNotesWindow() {
  if (notesWindow && !notesWindow.isDestroyed()) {
    notesWindow.focus();
    return;
  }

  notesWindow = new BrowserWindow({
    width: 400,
    height: 500,
    title: 'GPT Notes',
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false
    }
  });

  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>GPT Notes</title>
<style>
  body {
    font-family: -apple-system, system-ui, sans-serif;
    margin: 0;
    padding: 8px;
    background: #f5f5f5;
  }
  h1 {
    font-size: 16px;
    margin: 0 0 8px;
  }
  textarea {
    width: 100%;
    height: calc(100vh - 40px);
    resize: none;
    font-family: -apple-system, system-ui, sans-serif;
    font-size: 13px;
    padding: 6px;
    box-sizing: border-box;
  }
</style>
</head>
<body>
<h1>Notes</h1>
<textarea placeholder="Type notes here…"></textarea>
</body>
</html>`.trim();

  notesWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

  notesWindow.on('closed', () => {
    notesWindow = null;
  });
}

function createAppMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    // macOS application menu (uses app.name)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // File menu: new chat, reload, URL helpers, save/backup, screenshot
    {
      label: 'File',
      submenu: [
        {
          label: 'New Chat',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            newChat();
          }
        },
        {
          label: 'Reload Chat',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.reload();
            }
          }
        },
        {
          label: 'Copy Chat URL',
          click: () => {
            copyChatUrl();
          }
        },
        {
          label: 'Open in Browser',
          click: () => {
            openInBrowser();
          }
        },
        { type: 'separator' },
        {
          label: 'Save Chat as PDF…',
          click: () => {
            saveChatAsPdf().catch(err => {
              console.error('SaveChatAsPdf error:', err);
            });
          }
        },
        {
          label: 'Save Chat as Text…',
          click: () => {
            saveChatAsText().catch(err => {
              console.error('SaveChatAsText error:', err);
            });
          }
        },
        {
          label: 'Screenshot Window…',
          click: () => {
            screenshotWindow().catch(err => {
              console.error('ScreenshotWindow error:', err);
            });
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },

    // Edit menu (copy/paste, etc.)
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },

    // View menu: zoom + fullscreen + reset window size
    {
      label: 'View',
      submenu: [
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            const wc = mainWindow.webContents;
            wc.getZoomFactor(f => wc.setZoomFactor(f + 0.1));
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            const wc = mainWindow.webContents;
            wc.getZoomFactor(f => wc.setZoomFactor(Math.max(0.5, f - 0.1)));
          }
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            mainWindow.webContents.setZoomFactor(1.0);
          }
        },
        { type: 'separator' },
        {
          label: 'Reset Window Size',
          click: () => {
            resetWindowSize();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Cmd+F',
          click: () => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            const isFull = mainWindow.isFullScreen();
            mainWindow.setFullScreen(!isFull);
          }
        }
      ]
    },

    // Window menu (macOS) with Always On Top and Notes Window
    ...(isMac ? [{
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        {
          label: 'Always On Top',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: () => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            const currentlyOnTop = mainWindow.isAlwaysOnTop();
            mainWindow.setAlwaysOnTop(!currentlyOnTop);
          }
        },
        {
          label: 'Notes Window',
          click: () => {
            createNotesWindow();
          }
        },
        { type: 'separator' },
        { role: 'front' }
      ]
    }] : []),

    // Help menu with app info
    {
      label: 'Help',
      submenu: [
        {
          label: 'GPT App Info',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'GPT App Info',
              message: 'GPT Desktop Wrapper',
              detail:
                'A lightweight Electron-based desktop wrapper for ChatGPT.\n\n' +
                'Shortcuts:\n' +
                '- Cmd+N: New Chat\n' +
                '- Cmd+R: Reload Chat\n' +
                '- Cmd+= / Cmd- / Cmd+0: Zoom\n' +
                '- Ctrl+Cmd+F: Full Screen\n' +
                '- Cmd+Shift+T: Always On Top\n' +
                '- Ctrl+Option+G: Global shortcut to focus GPT (Mac)\n' +
                '\nFile menu: Save as PDF, Save as Text, Screenshot, Copy URL, Open in Browser.',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function registerGlobalShortcuts() {
  const isMac = process.platform === 'darwin';
  const combo = isMac ? 'Control+Option+G' : 'Control+Alt+G';

  const ok = globalShortcut.register(combo, () => {
    ensureMainWindow();
  });

  if (!ok) {
    console.error('Failed to register global shortcut');
  }
}

app.whenReady().then(() => {
  // This controls the name in the macOS menu bar
  app.setName('GPT');

  createAppMenu();
  createMainWindow();
  registerGlobalShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
