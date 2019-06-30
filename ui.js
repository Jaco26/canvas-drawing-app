// get reference to <section id="toolbar">
const toolbar = document.getElementById('toolbar');

// create a select element
const select = document.createElement('select');

// generate option elements with keys from brushes
Object.keys(brushes).forEach(key => {
  const opt = document.createElement('option');
  opt.setAttribute('value', key);
  opt.textContent = key;
  // append option to select
  select.appendChild(opt);
});

// append select to toolbar
toolbar.appendChild(select);

// set event listeners
select.addEventListener('change', e => {
  brushes[e.target.value].init();
});



