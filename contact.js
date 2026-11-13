(() => {
  'use strict';
  const english = document.documentElement.lang === 'en';
  const translations = {
    "微笑角落｜合作詢問": "Smile Corner | Project inquiry",
    "稱呼：": "Name: ",
    "未填": "Not provided",
    "回覆信箱：": "Reply email: ",
    "請直接回覆此封郵件": "Reply to this email",
    "服務項目：": "Service: ",
    "交付格式：": "Delivery format: ",
    "預計完成日期：": "Preferred date: ",
    "待討論": "To be discussed",
    "預算：": "Budget: ",
    "專案需求：": "Project details: ",
    "合作信箱：": "Contact email: ",
    "；副本：": "; CC: ",
    "。填寫後可開啟郵件軟體，檢查內容並自行寄出。": ". Open the draft in your email app, then review and send it.",
    "合作收件信箱尚未啟用。目前可以整理、複製與下載需求摘要；網站不會寄送資料。": "The contact inbox is unavailable. You can still prepare, copy, and download your brief.",
    "暫時無法取得收件設定。仍可複製或下載摘要；網站尚未寄出資料。": "Contact settings could not be loaded. You can still copy or download your brief.",
    "需求摘要已準備好，尚未寄送。": "Your brief is ready.",
    "微笑角落合作詢問｜": "Smile Corner project inquiry | ",
    "正在嘗試開啟郵件軟體，尚未寄送。請在郵件軟體中確認收件人並按寄出。若沒有開啟，可複製摘要寄至 ": "Review and send the draft in your email app. You can also copy the brief and email it to ",
    "。": ".",
    "摘要已複製，尚未寄送。": "Brief copied.",
    "請手動選取下方摘要並複製。": "Select and copy the brief below."
  };
  const t = text => english ? translations[text] : text;
  const $=id=>document.getElementById(id);
  let recipient='', copyRecipient='', summary='';
  const fields=['clientName','clientEmail','service','format','deadline','budget','details'];
  const value=id=>$(id).value.trim();
  function make() {
    summary=[t('微笑角落｜合作詢問'),t('稱呼：')+(value('clientName')||t('未填')),t('回覆信箱：')+(value('clientEmail')||t('請直接回覆此封郵件')),t('服務項目：')+value('service'),t('交付格式：')+value('format'),t('預計完成日期：')+(value('deadline')||t('待討論')),t('預算：')+(value('budget')||t('待討論')),'',t('專案需求：'),value('details')].join('\n');
    $('result').textContent=summary;$('copy').disabled=$('download').disabled=false;
  }
  fields.forEach(id=>$(id).addEventListener('input',()=>{summary='';$('copy').disabled=$('download').disabled=true;}));
  fetch('contact-config.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(config=>{
    if(typeof config.email==='string' && /^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(config.email)) {
      recipient=config.email;
      if(typeof config.cc==='string' && /^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(config.cc)) copyRecipient=config.cc;
      $('contactState').textContent=t('合作信箱：')+recipient+(copyRecipient?t('；副本：')+copyRecipient:'')+t('。填寫後可開啟郵件軟體，檢查內容並自行寄出。');
      $('mail').disabled=false;
    } else $('contactState').textContent=t('合作收件信箱尚未啟用。目前可以整理、複製與下載需求摘要；網站不會寄送資料。');
  }).catch(()=>{$('contactState').textContent=t('暫時無法取得收件設定。仍可複製或下載摘要；網站尚未寄出資料。');});
  $('briefForm').addEventListener('submit',event=>{event.preventDefault();make();$('message').textContent=t('需求摘要已準備好，尚未寄送。');});
  $('mail').addEventListener('click',()=>{
    if(!recipient || !$('briefForm').reportValidity())return;
    make();const href='mailto:'+recipient+'?'+(copyRecipient?'cc='+encodeURIComponent(copyRecipient)+'&':'')+'subject='+encodeURIComponent('微笑角落合作詢問｜'+value('service'))+'&body='+encodeURIComponent(summary);
    window.location.href=href;
    $('message').textContent=t('正在嘗試開啟郵件軟體，尚未寄送。請在郵件軟體中確認收件人並按寄出。若沒有開啟，可複製摘要寄至 ')+recipient+t('。');
  });
  $('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary);$('message').textContent=t('摘要已複製，尚未寄送。');}catch{$('message').textContent=t('請手動選取下方摘要並複製。');}});
  $('download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([summary],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='smile-corner-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);});
})();
