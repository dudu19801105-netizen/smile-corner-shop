document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#bookSearch');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-book]')];
  const count = document.querySelector('#resultCount');
  const empty = document.querySelector('#emptyResults');
  let active = 'all';

  function apply() {
    const q = (input?.value || '').trim().toLocaleLowerCase();
    let matches = 0;

    cards.forEach(card => {
      const text = card.textContent.toLocaleLowerCase();
      const category = card.dataset.category || '';
      const visible = (active === 'all' || category === active) && (!q || text.includes(q));
      card.classList.toggle('hidden', !visible);
      if (visible) matches++;
    });

    document.querySelectorAll('section[data-book-section]').forEach(section => {
      section.classList.toggle('hidden', !section.querySelector('[data-book]:not(.hidden)'));
    });

    if (count) count.textContent = `找到 ${matches} 本書（書庫共 ${cards.length} 本）`;
    if (empty) empty.classList.toggle('hidden', matches !== 0);
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
  }

  input?.addEventListener('input', apply);
  buttons.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.filter || 'all';
    buttons.forEach(b => b.classList.toggle('active', b === button));
    apply();
  }));
  apply();
});
