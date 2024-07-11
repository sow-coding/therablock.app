const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scheduleBlock: (sites, start, end, daysOfWeek) => {
    ipcRenderer.send('schedule-block', { sites, start, end, daysOfWeek });
  },
  getScheduledTasks: () => ipcRenderer.send('get-scheduled-tasks'),
  onScheduledTasksResponse: (callback) => ipcRenderer.on('scheduled-tasks-response', (event, response) => callback(response)),
  updateTask: (oldTask, newTask) => ipcRenderer.send('update-task', { oldTask, newTask }),
  onTaskUpdateResponse: (callback) => ipcRenderer.on('update-task-response', (event, response) => callback(response)),
  disableTask: (taskName) => ipcRenderer.send('disable-task', taskName),
  deleteTask: (taskName) => ipcRenderer.send('delete-task', taskName)
});