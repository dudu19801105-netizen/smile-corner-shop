document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#bookSearch');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-book]')];
  const sections = [...document.querySelectorAll('section[data-book-section]')];
  const statusButtons = [...document.querySelectorAll('[data-status-filter]')];
  let statusActive = 'all';
  const sort = document.querySelector('#bookSort');
  const clear = document.querySelector('#clearBookFilters');
  const originalPositions = new Map(cards.map((card, index) => [card, index]));
  const count = document.querySelector('#resultCount');
  const empty = document.querySelector('#emptyResults');
  const allowed = new Set(['all', ...buttons.map(button => button.dataset.filter)]);
  let active = allowed.has(decodeURIComponent(location.hash.slice(1))) ? decodeURIComponent(location.hash.slice(1)) : 'all';

  function apply() {
    const ordering = sort?.value || 'default';
    const ordered = [...cards].sort((a, b) => {
      if (ordering === 'default') return originalPositions.get(a) - originalPositions.get(b);
      const first = a.querySelector('h3')?.textContent.trim() || '';
      const second = b.querySelector('h3')?.textContent.trim() || '';
      const difference = first.localeCompare(second, 'en', { sensitivity: 'base' });
      return ordering === 'za' ? -difference : difference;
    });
    for (const card of ordered) card.parentElement.appendChild(card);
    const query = (input?.value || '').trim().toLocaleLowerCase();
    let matches = 0;
    for (const card of cards) {
      const category = card.dataset.category || '';
      const visible = (active === 'all' || category === active) &&
        (statusActive === 'all' || card.dataset.status === statusActive) &&
        (!query || card.textContent.toLocaleLowerCase().includes(query));
      card.classList.toggle('hidden', !visible);
      if (visible) matches++;
    }
    for (const section of sections) {
      section.classList.toggle('hidden', !section.querySelector('[data-book]:not(.hidden)'));
    }
    buttons.forEach(button => {
      const selected = button.dataset.filter === active;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    statusButtons.forEach(button => {
      const selected = button.dataset.statusFilter === statusActive;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (count) count.textContent = `找到 ${matches} 本書（書庫共 ${cards.length} 本）`;
    if (empty) empty.classList.toggle('hidden', matches > 0);
  }

  input?.addEventListener('input', apply);
  sort?.addEventListener('change', apply);
  clear?.addEventListener('click', () => {
    if (input) input.value = '';
    if (sort) sort.value = 'default';
    active = 'all';
    statusActive = 'all';
    history.replaceState(null, '', location.pathname + location.search);
    apply();
    input?.focus();
  });
  buttons.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.filter || 'all';
    if (active === 'all') history.replaceState(null, '', location.pathname + location.search);
    else history.replaceState(null, '', '#' + active);
    apply();
  }));
  statusButtons.forEach(button => button.addEventListener('click', () => {
    statusActive = button.dataset.statusFilter || 'all';
    apply();
  }));
  window.addEventListener('hashchange', () => {
    const selected = decodeURIComponent(location.hash.slice(1));
    if (allowed.has(selected)) { active = selected; apply(); }
  });
  apply();
});