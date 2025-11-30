const fs = require('fs');
const path = require('path');
const P = path.join(__dirname, 'prompts.json');

function loadPromptLibrary() {
  try {
    return JSON.parse(fs.readFileSync(P, 'utf8'));
  } catch (e) {
    return [];
  }
}

function savePromptLibrary(data) {
  fs.writeFileSync(P, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { loadPromptLibrary, savePromptLibrary };
