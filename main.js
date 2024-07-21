const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const sudo = require('sudo-prompt');
const log = require('electron-log');

const options = {
  name: 'Therablock',
};

log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs', 'main.log');

log.info('App starting...');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  //Menu.setApplicationMenu(null);

  if (app.isPackaged) {
    win.loadURL("https://therablock.app/home");
  } else {
    win.loadURL("http://localhost:3000/home");
  }

  log.info('Window created and loaded');
}

app.on('window-all-closed', () => {
  log.info('All windows closed');
  if (process.platform !== 'darwin') {
    log.info('Quitting app as all windows are closed');
    app.quit();
  }
});

app.on('activate', () => {
  log.info('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('ready', createWindow);

ipcMain.on('schedule-block', (event, { sites, start, end, daysOfWeek }) => {
  const scriptDirectory = app.isPackaged
    ? path.join(process.resourcesPath, 'scripts')
    : path.join(__dirname, 'scripts');

  sites.forEach(site => {
    const trimmedSite = `www.${site.trim()}`;
    const setupCommand = `powershell -File "${path.join(scriptDirectory, 'setupTasks.ps1')}" -site "${trimmedSite}" -startHour ${start.hour} -startMinute ${start.minute} -endHour ${end.hour} -endMinute ${end.minute} -daysOfWeek "${daysOfWeek}"`;

    log.info(`Setting up schedule block for ${trimmedSite} with command: ${setupCommand}`);

    sudo.exec(setupCommand, options, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error setting up scheduled tasks for ${trimmedSite}: ${error.message}`);
        return;
      }
      log.info(`Scheduled tasks set up for site: ${trimmedSite}`);
      log.info(stdout);
    });
  });
});

ipcMain.on('get-scheduled-tasks', (event) => {
  const scriptPath = app.isPackaged
    ? path.join(process.resourcesPath, 'scripts', 'getScheduledTasks.ps1')
    : path.join(__dirname, 'scripts', 'getScheduledTasks.ps1');
  
  log.info(`Getting scheduled tasks with script: ${scriptPath}`);
  
  sudo.exec(`powershell -File "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      log.error(`Error retrieving scheduled tasks: ${error.message}`);
      event.reply('scheduled-tasks-response', { success: false, error: error.message });
      return;
    }
    if (stderr) {
      log.error(`Error retrieving scheduled tasks: ${stderr}`);
      event.reply('scheduled-tasks-response', { success: false, error: stderr });
      return;
    }
    log.info('Scheduled tasks retrieved successfully');
    event.reply('scheduled-tasks-response', { success: true, data: JSON.parse(stdout) });
  });
});

ipcMain.on('update-task', (event, { oldTask, newTask }) => {
  const { blockTaskName, unblockTaskName } = oldTask;
  log.info(`Attempting to delete old tasks: ${blockTaskName} and ${unblockTaskName}`);

  const deleteBlockCommand = `powershell -Command "Unregister-ScheduledTask -TaskName '${blockTaskName}' -Confirm:\$false"`;
  const deleteUnblockCommand = `powershell -Command "Unregister-ScheduledTask -TaskName '${unblockTaskName}' -Confirm:\$false"`;

  sudo.exec(deleteBlockCommand, options, (error, stdout, stderr) => {
    if (error) {
      log.error(`Error deleting old block task: ${error.message}`);
      event.reply('update-task-response', { success: false, error: error.message });
      return;
    }
    log.info(`Old block task deleted: ${blockTaskName}`);

    sudo.exec(deleteUnblockCommand, options, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error deleting old unblock task: ${error.message}`);
        event.reply('update-task-response', { success: false, error: error.message });
        return;
      }
      log.info(`Old unblock task deleted: ${unblockTaskName}`);

      // Ensure daysOfWeek is not empty
      if (!newTask.daysOfWeek || newTask.daysOfWeek.length === 0) {
        log.error('Days of week are required to set up a new task.');
        event.reply('update-task-response', { success: false, error: 'Days of week are required to set up a new task.' });
        return;
      }

      const scriptDirectory = app.isPackaged
      ? path.join(process.resourcesPath, 'scripts')
      : path.join(__dirname, 'scripts');

      const setupCommand = `powershell -File "${path.join(scriptDirectory, 'setupTasks.ps1')}" -site ${newTask.site} -startHour ${newTask.start.hour} -startMinute ${newTask.start.minute} -endHour ${newTask.end.hour} -endMinute ${newTask.end.minute} -daysOfWeek "${newTask.daysOfWeek}"`;

      log.info(`Setting up new task with command: ${setupCommand}`);

      sudo.exec(setupCommand, options, (error, stdout, stderr) => {
        if (error) {
          log.error(`Error setting up new task: ${error.message}`);
          event.reply('update-task-response', { success: false, error: error.message });
          return;
        }
        log.info(`Scheduled tasks updated for sites: ${newTask.sites}`);
        log.info(stdout);
        event.reply('update-task-response', { success: true });
      });
    });
  });
});

ipcMain.on('delete-task', (event, taskName) => {
  const blockTaskName = `BlockSite_${taskName}`;
  const unblockTaskName = `UnblockSite_${taskName}`;

  log.info(`Deleting tasks: ${blockTaskName} and ${unblockTaskName}`);

  const deleteBlockCommand = `powershell -Command "Unregister-ScheduledTask -TaskName '${blockTaskName}' -Confirm:\$false"`;
  const deleteUnblockCommand = `powershell -Command "Unregister-ScheduledTask -TaskName '${unblockTaskName}' -Confirm:\$false"`;

  sudo.exec(deleteBlockCommand, options, (error, stdout, stderr) => {
    if (error) {
      log.error(`Error deleting block task: ${error.message}`);
      return;
    }
    log.info(`Block task deleted: ${blockTaskName}`);

    sudo.exec(deleteUnblockCommand, options, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error deleting unblock task: ${error.message}`);
        return;
      }
      log.info(`Unblock task deleted: ${unblockTaskName}`);
    });
  });
});
