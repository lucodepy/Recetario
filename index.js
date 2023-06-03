const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'templates', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault(); // Evita la navegación predeterminada
    const urlPath = new URL(url).pathname;

    if (urlPath.startsWith('/search/')) {
      const query = decodeURIComponent(urlPath.substring(8)); // Elimina '/search/' de la URL y decodifica el valor
      console.log(`Redireccionando a búsqueda: ${query}`);
      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, 'templates', 'bueno.ejs'),
          protocol: 'file:',
          slashes: true,
          search: `?query=${encodeURIComponent(query)}` // Agrega el trago a consultar en la query de la URL
        })
      );
    } else if (urlPath === '/error') {
      console.log('Redireccionando a página de error');
      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, 'templates', 'error.ejs'),
          protocol: 'file:',
          slashes: true
        })
      );
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
