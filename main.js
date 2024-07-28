const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const sudo = require('sudo-prompt');

const options = {
  name: 'Therablock',
};

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
  Menu.setApplicationMenu(null);

  if (app.isPackaged) {
    win.loadURL("https://therablock.app/home");
  } else {
    win.loadURL("http://localhost:3000/home");
  }

}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
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

    sudo.exec(setupCommand, options);
  });
});

ipcMain.on('schedule-block-app', (event, { apps, start, end, daysOfWeek }) => {
  const scriptDirectory = app.isPackaged
    ? path.join(process.resourcesPath, 'scripts')
    : path.join(__dirname, 'scripts');

  apps.forEach(app => {
    const setupCommand = `powershell -File "${path.join(scriptDirectory, 'setupAppTasks.ps1')}" -appName "${app.trim()}" -startHour ${start.hour} -startMinute ${start.minute} -endHour ${end.hour} -endMinute ${end.minute} -daysOfWeek "${daysOfWeek}"`;

    sudo.exec(setupCommand, options);
  });
});

ipcMain.on('get-scheduled-tasks', (event) => {
  const scriptPath = app.isPackaged
    ? path.join(process.resourcesPath, 'scripts', 'getScheduledTasks.ps1')
    : path.join(__dirname, 'scripts', 'getScheduledTasks.ps1');
  
  
  sudo.exec(`powershell -File "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      event.reply('scheduled-tasks-response', { success: false, error: error.message });
      return;
    }
    if (stderr) {
      event.reply('scheduled-tasks-response', { success: false, error: stderr });
      return;
    }
    event.reply('scheduled-tasks-response', { success: true, data: JSON.parse(stdout) });
  });
});

ipcMain.on('update-task', (event, { oldTask, newTask }) => {
  const { blockTaskName, unblockTaskName } = oldTask;

  const deleteBlockCommand = `powershell -Command "Unregister-ScheduledTask -TaskName '${blockTaskName}' -Confirm:\$false"`;
  const deleteUnblockCommand = `powershell -Command "Unregister-ScheduledTask -TaskName '${unblockTaskName}' -Confirm:\$false"`;

  sudo.exec(deleteBlockCommand, options, (error, stdout, stderr) => {
    if (error) {
      event.reply('update-task-response', { success: false, error: error.message });
      return;
    }

    sudo.exec(deleteUnblockCommand, options, (error, stdout, stderr) => {
      if (error) {
        event.reply('update-task-response', { success: false, error: error.message });
        return;
      }

      // Ensure daysOfWeek is not empty
      if (!newTask.daysOfWeek || newTask.daysOfWeek.length === 0) {
        event.reply('update-task-response', { success: false, error: 'Days of week are required to set up a new task.' });
        return;
      }

      const scriptDirectory = app.isPackaged
      ? path.join(process.resourcesPath, 'scripts')
      : path.join(__dirname, 'scripts');

      const setupCommand = `powershell -File "${path.join(scriptDirectory, 'setupTasks.ps1')}" -site ${newTask.site} -startHour ${newTask.start.hour} -startMinute ${newTask.start.minute} -endHour ${newTask.end.hour} -endMinute ${newTask.end.minute} -daysOfWeek "${newTask.daysOfWeek}"`;

      sudo.exec(setupCommand, options, (error, stdout, stderr) => {
        if (error) {
          event.reply('update-task-response', { success: false, error: error.message });
          return;
        }
        event.reply('update-task-response', { success: true });
      });
    });
  });
});

ipcMain.on('delete-task', (event, taskName) => {
  const blockTaskName = `BlockSite_${taskName}`;
  const unblockTaskName = `UnblockSite_${taskName}`;

  const deleteBlockCommand = `powershell -Command "Unregister-ScheduledTask -TaskName '${blockTaskName}' -Confirm:\$false"`;
  const deleteUnblockCommand = `powershell -Command "Unregister-ScheduledTask -TaskName '${unblockTaskName}' -Confirm:\$false"`;

  sudo.exec(deleteBlockCommand, options, (error, stdout, stderr) => {

    sudo.exec(deleteUnblockCommand, options);
  });
});
