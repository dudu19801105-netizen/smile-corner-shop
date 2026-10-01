document.addEventListener('DOMContentLoaded',()=>{
 const input=document.querySelector('#bookSearch');
 const buttons=[...document.querySelectorAll('[data-filter]')];
 const cards=[...document.querySelectorAll('[data-book]')];
 let active='all';
 function apply(){
   const q=(input?.value||'').trim().toLowerCase();
   cards.forEach(card=>{
     const text=card.innerText.toLowerCase();
     const cat=card.dataset.category||'';
     const okCat=active==='all'||cat===active;
     const okText=!q||text.includes(q);
     card.classList.toggle('hidden',!(okCat&&okText));
   });
 }
 input?.addEventListener('input',apply);
 buttons.forEach(btn=>btn.addEventListener('click',()=>{
   active=btn.dataset.filter;
   buttons.forEach(x=>x.classList.toggle('active',x===btn));
   apply();
 }));
});