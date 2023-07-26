const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("list-directory", (event, path) => {
  console.log(`Listing directory: ${path}`);
  exec(`ls "${path}"`, (error, stdout) => {
    if (error) {
      event.reply("directory-listing-error", error.message);
    } else {
      event.reply("directory-listing-success", stdout);
    }
  });
});
