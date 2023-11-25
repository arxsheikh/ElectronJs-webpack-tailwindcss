const { app, BrowserWindow, Menu, Notification, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');


let win
// Create a new Electron application window
function createWindow() {
  win = new BrowserWindow({
    width: 1200,   // Set the initial width of the window
    height: 680,  // Set the initial height of the window
    minWidth: 1300,
    minHeight: 780,
    webPreferences: {
      nodeIntegration: true,
      // Enable Node.js integration in the renderer process
    },
   

    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './render.bundle.js')
    }

  });

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("update_state")
  })


  // Load your HTML file into the window
  win.loadFile('./dist/index.html');

  // Open the DevTools for debugging
  // win.webContents.openDevTools();

  // Listen for the window being closed
  win.on('closed', () => {
    // Dereference the window object
    win = null;
  });




}


// Create the main window when the app is ready
app.whenReady().then(createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create a new window when the app is activated (on macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});







ipcMain.handle("active_printer", () => {

  const printer_list = win.webContents.getPrinters()
  return printer_list[0].name
})


ipcMain.on('print_rcipt', async (e, order) => {

  let printWindow = new BrowserWindow({ show: false, webPreferences: { contextIsolation: true } });

  console.log('Print Initiating on google page');
  printWindow.loadFile("print.html")
  printWindow.webContents.executeJavaScript(`
    document.body.innerHTML = \`${order}\`;
    document.body.style.background = 'white';
    document.body.style.color = 'black';
 
  `).then((/*event*/) => {
    let options = {
      silent: true,

      landscape: false,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
    }
    printWindow.webContents.print(options, (success, failureReason) => {
      showNotification(`Printing external web page ${success ? 'success' : 'failed (' + failureReason + ')'}`);
      printWindow.close();
    });
  })
    .catch(err => console.log('page load error', err))
    .then(() => console.log("success"))
}


)

