// rendererDR.js
const { ipcRenderer } = require('electron');

document.getElementById('inputField').addEventListener('input', (event) => {
  const value = event.target.value;
  if (isNaN(value)) {
    event.target.value = value.slice(0, -1);
  }
});

document.getElementById('updateButton').addEventListener('click', () => {
  const inputValue = document.getElementById('inputField').value;
  ipcRenderer.send('update-text', { action: 'update', value: inputValue });
});

document.getElementById('addButton').addEventListener('click', () => {
  const inputValue = document.getElementById('inputField').value;
  ipcRenderer.send('update-text', { action: 'add', value: inputValue });
});

ipcRenderer.on('update-display', (event, newValue) => {
  document.getElementById('display').innerText = newValue;
});
