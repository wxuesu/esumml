(() => {
  'use strict';
  const boxes = Array.from(document.querySelectorAll('[data-step]'));
  const progress = document.getElementById('progress');
  const text = document.getElementById('progress-text');
  const note = document.getElementById('storage-note');
  const key = 'esu-ob-preparation-v1';
  let storageAvailable = true;
  function unavailable() {
    storageAvailable = false;
    note.textContent = 'Your checklist works for this visit, but this browser could not save progress. No information is submitted to ESU.';
  }
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      boxes.forEach(box => { box.checked = saved[box.dataset.step] === true; });
    }
  } catch { unavailable(); }
  function update(save) {
    const count = boxes.filter(box => box.checked).length;
    progress.value = count;
    text.textContent = `${count} of ${boxes.length} complete`;
    if (save && storageAvailable) {
      try {
        localStorage.setItem(key, JSON.stringify(Object.fromEntries(boxes.map(box => [box.dataset.step, box.checked]))));
      } catch { unavailable(); }
    }
  }
  boxes.forEach(box => box.addEventListener('change', () => update(true)));
  document.getElementById('reset').addEventListener('click', () => {
    boxes.forEach(box => { box.checked = false; });
    update(true);
  });
  update(false);
})();
