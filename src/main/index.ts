import {app, BrowserWindow, ipcMain} from 'electron';
import {fork} from 'child_process';
import {join} from 'path';
import {format} from 'url';


const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {


  /**
   * Workaround for TypeScript bug
   * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
   */
  const env = import.meta.env;


  // Install "Vue.js devtools BETA"
  if (env.MODE === 'development') {
    app.whenReady()
      .then(() => import('electron-devtools-installer'))
      .then(({default: installExtension}) => {
        /** @see https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg */
        const VUE_DEVTOOLS_BETA = 'ljjemllljcmogpfapbkkighbhhppjdbg';
        return installExtension(VUE_DEVTOOLS_BETA);
      })
      .catch(e => console.error('Failed install extension:', e));
  }

  let mainWindow: BrowserWindow | null = null;
  let server;

  async function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      center: true,
      alwaysOnTop: true,
      show: false,
      resizable: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.cjs.js'),
        contextIsolation: env.MODE !== 'test',   // Spectron tests can't work with contextIsolation: true
        enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
      },
    });

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    const URL = env.MODE === 'development'
      ? env.VITE_DEV_SERVER_URL
      : format({
        protocol: 'file',
        pathname: join(__dirname, '../renderer/index.html'),
        slashes: true,
      });

    await mainWindow.loadURL(URL);
    mainWindow.maximize();
    mainWindow.show();

    if (env.MODE === 'development') {
      mainWindow.webContents.openDevTools();
    }
  }


  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });


  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });


  app.whenReady()
    .then(createWindow)
    .then(() => console.log('window created'))
    .catch((e) => console.error('Failed create window:', e));


  // Auto-updates
  if (env.PROD) {
    app.whenReady()
      .then(() => import('electron-updater'))
      .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
      .catch((e) => console.error('Failed check updates:', e));
  }

  ipcMain.on('server-launch', (e) => {
    // @NOTE: below args are not currently wired up eg changing them will not do anything
    const serverArgs = ['--host', '127.0.0.1', '--port', '3720'];
    // Fork the server as another process
    // @TODO: Need to replace the below with grpc server when @mikemilano has it ready
    server = fork(join(process.cwd(), 'src', 'server', 'fake-server.js'), serverArgs, {stdio: ['pipe', 'pipe', 'pipe', 'ipc']});
    // Send stuff back
    // @TODO: Do we have some better idea on how to determine whether the server started or not?
    e.reply('server-status', {on: true});
    // Send stderr/stdout back to renderer as is appropriate
    server.stdout.on('data', d => {
      e.reply('server-stdout', '[landod] ' + d.toString());
    });
    server.stderr.on('data', d => {
      e.reply('server-stderr', '[landod] ' + d.toString());
    });
    server.on('exit', (code, signal) => {
      if (code === 0) e.reply('server-stdout', `[landod] server exited with code ${code}`);
      else if (code > 0) e.reply('server-stderr', `[landod] server exited with code ${code}`);
      else if (signal) e.reply('server-stdout', `[landod] server terminated with ${signal}`);
      else e.reply('server-err', `[landod] server exited and we honestly aren't sure why`);
      e.reply('server-status', {on: false});
    });
  });

  ipcMain.on('server-kill', (e, sig = 'SIGTERM') => {
    // Log the kill request
    e.reply('server-stdout', `[landod] sending ${sig} to server...`);
    // Send the kill signal
    server.kill(sig);

  });
}
