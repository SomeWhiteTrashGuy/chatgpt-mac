const api = window.api;
const listEl = document.getElementById('list');
const titleEl = document.getElementById('title');
const contentEl = document.getElementById('content');
const saveBtn = document.getElementById('save');
const deleteBtn = document.getElementById('delete');
const useBtn = document.getElementById('use');

let prompts = [];
let selectedIndex = -1;

async function load() {
  try {
    const data = await api.loadPrompts();
    prompts = Array.isArray(data) ? data : (data && (data.prompts || data)) || [];
  } catch (e) {
    console.error('Failed to load prompts', e);
    prompts = [];
  }
  render();
}

function render() {
  listEl.innerHTML = '';
  prompts.forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'prompt';
    d.textContent = p.name;
    d.onclick = () => select(i);
    listEl.appendChild(d);
  });
}

function select(i) {
  selectedIndex = i;
  const p = prompts[i];
  titleEl.value = p.name || '';
  contentEl.value = p.content || '';
  Array.from(listEl.children).forEach((el, idx) => {
    el.style.background = idx === i ? '#eef' : 'transparent';
  });
}

saveBtn.onclick = async () => {
  const name = titleEl.value.trim();
  const content = contentEl.value.trim();
  if (!name || !content) {
    alert('Both title and content required');
    return;
  }
  if (selectedIndex >= 0) {
    prompts[selectedIndex] = { name, content };
  } else {
    prompts.push({ name, content });
    selectedIndex = prompts.length - 1;
  }
  await api.savePrompts(prompts);
  await load();
};

deleteBtn.onclick = async () => {
  if (selectedIndex < 0) return;
  if (!confirm('Delete selected prompt?')) return;
  prompts.splice(selectedIndex, 1);
  selectedIndex = -1;
  titleEl.value = '';
  contentEl.value = '';
  await api.savePrompts(prompts);
  await load();
};

useBtn.onclick = async () => {
  if (selectedIndex < 0) {
    alert('Select a prompt first');
    return;
  }
  const p = prompts[selectedIndex];
  try {
    await navigator.clipboard.writeText(p.content);
    alert('Prompt copied to clipboard. Paste into ChatGPT input (Cmd+V).');
  } catch (e) {
    alert('Unable to copy: ' + e.message);
  }
};

load();
