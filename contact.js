(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  let recipient='', summary='';
  const fields=['clientName','clientEmail','service','format','deadline','budget','details'];
  const value=id=>$(id).value.trim();
  function make() {
    summary=['微笑角落｜合作詢問','稱呼：'+(value('clientName')||'未填'),'回覆信箱：'+(value('clientEmail')||'請直接回覆此封郵件'),'服務項目：'+value('service'),'交付格式：'+value('format'),'預計完成日期：'+(value('deadline')||'待討論'),'預算：'+(value('budget')||'待討論'),'','專案需求：',value('details')].join('\n');
    $('result').textContent=summary;$('copy').disabled=$('download').disabled=false;
  }
  fields.forEach(id=>$(id).addEventListener('input',()=>{summary='';$('copy').disabled=$('download').disabled=true;}));
  fetch('contact-config.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(config=>{
    if(typeof config.email==='string' && /^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(config.email)) {
      recipient=config.email;
      $('contactState').textContent='合作信箱：'+recipient+'。填寫後可開啟郵件軟體，檢查內容並自行寄出。';
      $('mail').disabled=false;
    } else $('contactState').textContent='合作收件信箱尚未啟用。目前可以整理、複製與下載需求摘要；網站不會寄送資料。';
  }).catch(()=>{$('contactState').textContent='暫時無法取得收件設定。仍可複製或下載摘要；網站尚未寄出資料。';});
  $('briefForm').addEventListener('submit',event=>{event.preventDefault();make();$('message').textContent='需求摘要已準備好，尚未寄送。';});
  $('mail').addEventListener('click',()=>{
    if(!recipient || !$('briefForm').reportValidity())return;
    make();const href='mailto:'+recipient+'?subject='+encodeURIComponent('微笑角落合作詢問｜'+value('service'))+'&body='+encodeURIComponent(summary);
    window.location.href=href;
    $('message').textContent='正在嘗試開啟郵件軟體，尚未寄送。請在郵件軟體中確認收件人並按寄出。若沒有開啟，可複製摘要寄至 '+recipient+'。';
  });
  $('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary);$('message').textContent='摘要已複製，尚未寄送。';}catch{$('message').textContent='請手動選取下方摘要並複製。';}});
  $('download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([summary],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='smile-corner-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);});
})();
