(()=>{"use strict";
const style=document.createElement("style");
style.textContent=`
#sc-assist-toggle{position:fixed;right:20px;bottom:20px;z-index:1000;border:0;border-radius:999px;padding:14px 18px;background:#95ebc6;color:#082334;box-shadow:0 8px 30px #0008;cursor:pointer;font:bold 15px system-ui}
#sc-assist{position:fixed;z-index:1001;right:20px;bottom:76px;width:min(370px,calc(100vw - 28px));max-height:min(530px,75vh);display:none;flex-direction:column;background:#10243a;color:#f6f8fb;border:1px solid #55768b;border-radius:19px;box-shadow:0 18px 50px #0009;overflow:hidden;font:14px/1.5 system-ui}
#sc-assist.open{display:flex}
#sc-assist header{position:static;background:#17334b;border:0;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}
#sc-assist header strong{color:#fff}#sc-assist header button{border:0;background:transparent;color:white;font-size:22px;cursor:pointer}
#sc-assist-log{overflow:auto;min-height:135px;padding:14px;display:flex;flex-direction:column;gap:10px}
.sc-msg{padding:10px 12px;border-radius:12px;max-width:95%;white-space:pre-wrap}
.sc-msg.bot{background:#1c4158;align-self:start}.sc-msg.user{background:#95ebc6;color:#082334;align-self:end}
#sc-assist-actions{padding:0 12px 8px;display:flex;gap:6px;flex-wrap:wrap}
#sc-assist-actions button{background:#233f59;color:#fff;border:1px solid #547389;border-radius:99px;padding:7px 10px;cursor:pointer}
#sc-assist-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #55768b}
#sc-assist-input{min-width:0;flex:1;border:1px solid #55768b;border-radius:8px;background:#071a2b;color:#fff;padding:10px;font:inherit}
#sc-assist-send{background:#95ebc6;border:0;border-radius:8px;padding:10px 13px;color:#082334;font-weight:bold;cursor:pointer}
#sc-assist-voice{padding:0 13px 11px;display:flex;gap:8px;align-items:center;color:#c8d8e4;font-size:12px}
#sc-assist a{color:#aeeed0;text-decoration:underline}
`;
document.head.append(style);
const toggle=document.createElement("button");toggle.id="sc-assist-toggle";toggle.type="button";toggle.textContent="🤖 中英雙語助手 / AI Guide";
const panel=document.createElement("section");panel.id="sc-assist";panel.setAttribute("aria-label","Smile Corner virtual guide");
panel.innerHTML='<header><strong>🤖 Smile Corner Guide</strong><button type="button" id="sc-assist-close" aria-label="Close assistant">×</button></header><div id="sc-assist-log" role="log" aria-live="polite"></div><div id="sc-assist-actions"></div><form id="sc-assist-form"><input id="sc-assist-input" aria-label="Ask the assistant" maxlength="220" placeholder="Ask about books, services, YouTube..." required><button id="sc-assist-send" type="submit">Send</button></form><label id="sc-assist-voice"><input id="sc-assist-speak" type="checkbox"> Read replies aloud (browser voice)</label>';
document.body.append(toggle,panel);
const langbar=document.createElement("div");langbar.style.cssText="padding:10px 13px 0;display:flex;gap:8px;align-items:center";langbar.innerHTML='<label for="sc-lang">🌐 Language</label><select id="sc-lang" aria-label="Select language" style="border:1px solid #55768b;border-radius:8px;background:#071a2b;color:white;padding:7px"><option value="zh-TW">繁體中文</option><option value="en-US">English</option></select>';panel.insertBefore(langbar,panel.querySelector("#sc-assist-log"));const lang=langbar.querySelector("#sc-lang");lang.value=localStorage.getItem("sc-guide-lang")==="en-US"?"en-US":"zh-TW";lang.addEventListener("change",()=>{localStorage.setItem("sc-guide-lang",lang.value);panel.querySelector("#sc-assist-log").replaceChildren();append(lang.value==="zh-TW"?"歡迎光臨 Smile Corner！我可以介紹書籍、YouTube、設計接案及廣告合作。這是固定問答導覽助手，不會傳送對話給網站管理員。":"Welcome to Smile Corner! I can guide you to books, YouTube, services and advertising. This is an FAQ guide, not a live AI agent.","bot")});const log=panel.querySelector("#sc-assist-log"),actions=panel.querySelector("#sc-assist-actions"),input=panel.querySelector("#sc-assist-input"),speak=panel.querySelector("#sc-assist-speak");
function append(message,who){const node=document.createElement("div");node.className="sc-msg "+who;node.textContent=message;log.append(node);log.scrollTop=log.scrollHeight}
const link=(text,href)=>{const a=document.createElement("a");a.href=href;a.textContent=text;a.target=href.startsWith("http")?"_blank":"_self";if(a.target==="_blank")a.rel="noopener noreferrer";return a};

// One free book-making lesson per local browser per day. This is a convenience limit, not server-enforced.
const tutorKey="sc-tutorial-day-v1";
function dayCode(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
function wantsTutorial(q){return /(?:怎麼|如何|教我|教學|步驟|教程|製作|做出|create|make|how to|tutorial|guide|format|排版|封面|內頁|出版|kdp|ebook|電子書|精裝|平裝|上架|pdf)/i.test(q)&&/(?:書|book|kdp|kindle|ebook|封面|內頁|排版|出版|pdf|paperback|hardcover|cover)/i.test(q)}
function lesson(q){
 const cn=lang.value==="zh-TW",advanced=/進階|困難|複雜|專業|advanced|complex|hard|精裝|ebook|kindle|出版|kdp/i.test(q);
 if(cn)return advanced?
 "進階製書流程：①確認讀者、主題與目錄，避免重複內容。②完成原創稿件並校對事實、語法及圖片授權。③依平裝尺寸排版，檢查安全邊界、出血與字體嵌入。④封面另外製作，按頁數與紙張選擇正確書脊尺寸。⑤輸出並預覽 PDF，逐頁檢查。⑥於 KDP 核對書名、作者、語言、權利、分類與定價，再送審。遇到格式錯誤，先看 KDP 預覽器的具體提示。這是簡要教學，不會替你產生整本書或保證審核通過。":
 "簡易製書教學：①選一個明確主題與讀者。②寫下書名及 5～8 個章節。③每章先完成重點，再補充例子並校對。④選擇固定頁面尺寸，讓內文清晰、四周保留安全邊界。⑤封面與內頁分開製作。⑥輸出 PDF，檢查頁碼、文字和圖片。⑦上傳 Amazon KDP，先預覽再送審。本站目前提供教學和導覽，並不能直接替你產生或上架完整書籍。";
 return advanced?
 "Advanced book workflow: 1. Define your readers and outline. 2. Write original, fact-checked content and verify image rights. 3. Format trim size, margins, bleed and embedded fonts. 4. Make a separate cover with the correct spine width. 5. Export and proof every PDF page. 6. Check KDP metadata, rights, language, categories and pricing. 7. Use the print previewer and address its warnings before submitting. This is guidance, not automated book production or approval.":
 "Simple book workflow: 1. Pick one audience and topic. 2. Outline 5–8 chapters. 3. Draft and proofread each chapter. 4. Choose a consistent trim size and safe margins. 5. Design your cover separately. 6. Export a print-ready PDF and check each page. 7. Upload to Amazon KDP, preview and submit. This guide cannot create or publish a complete book for you.";
}
function tutorialReply(q){const cn=lang.value==="zh-TW";
 if(localStorage.getItem(tutorKey)===dayCode())return [cn?"今天的免費製書教學已使用完畢，明天可再使用一次。你仍可詢問書店、YouTube、接案等網站資訊。需要進一步協助，請前往服務介紹頁；目前尚未設定公開客服信箱。":"Today's free book tutorial has been used. Try again tomorrow. Site navigation remains unlimited. For more help, please see our services page; a public support email has not been configured yet.",cn?"服務介紹":"Services","index.html#services"];
 localStorage.setItem(tutorKey,dayCode());
 const msg=lesson(q);return [Array.from(msg).slice(0,550).join("")];
}
function answer(q){const chinese=lang.value==="zh-TW";const s=q.toLowerCase();if(wantsTutorial(q))return tutorialReply(q);if(/email|e-mail|mailto|寄信|信箱|客服信箱|聯絡誰|郵件/.test(s))return [chinese?"目前網站尚未設定已確認的公開客服信箱，請先查看服務介紹頁，勿將個人資料留在聊天視窗。":"A verified public contact email has not been set up yet. Please consult the services page and do not share personal details in chat.",chinese?"服務介紹":"Services","index.html#services"];if(/youtube|video|影片|油管|頻道/.test(s))return [(chinese?"歡迎前往 Smile Corner 的 YouTube 頻道觀看影片。":"Our YouTube channel is ready to visit."),(chinese?"YouTube 頻道":"YouTube channel"),"https://www.youtube.com/channel/UCiMfU5up2GtF8NHKtxO75PA"];if(/book|amazon|書|買|購買|小說|pc|server|cloud|kindle/.test(s))return [(chinese?"歡迎瀏覽 Smile Corner 書籍目錄。購買前請在 Amazon 確認作者與供貨狀態。":"Browse the Smile Corner book catalog. Verify availability and author on Amazon before buying."),(chinese?"查看書籍":"Browse books"),"books.html"];if(/adver|sponsor|廣告|贊助|合作/.test(s))return [(chinese?"歡迎了解廣告與品牌合作，目前聯絡管道還在設定，這裡不收訂單或款項。":"We welcome advertising and collaboration inquiries. Contact details are still being configured; this guide does not accept bookings or payment."),(chinese?"廣告合作":"Advertising information"),"index.html#advertise"];if(/hire|design|quote|contact|service|設計|接案|聯絡|報價|委託|pdf/.test(s))return [(chinese?"歡迎了解書籍排版、封面與網站設計服務。目前尚未開通正式詢價收件，請勿輸入個人敏感資料。":"Explore our creative services. Direct inquiries are not yet connected, so please do not send sensitive details here."),(chinese?"創意設計服務":"Creative services"),"index.html#services"];if(/ai|studio|創作/.test(s))return [(chinese?"歡迎使用 AI Studio 創作規劃工具，目前它還不能自動出版或連接大型 AI 模型。":"Explore our creative planning tools. The AI Studio is a local planning workspace, not an automatic publishing service."),(chinese?"AI 創作工作室":"AI Studio"),"ai-studio.html"];if(/hello|hi|你好|哈囉|早安/.test(s))return [(chinese?"你好！我是 Smile Corner 網站小管家，可以幫你找書籍、影片、設計服務及廣告合作。":"Hello! I am the Smile Corner website guide. I can help you find books, videos, services, and advertising information.")];return [(chinese?"我是網站固定問答助手，目前還不是真正的即時 AI。你可以問我書籍、YouTube、接案、廣告或 AI Studio。":"I'm a simple website guide, not a live AI agent yet. Ask about books, YouTube, services, advertising, or AI Studio.")];}
function respond(q){append(q,"user");const [msg,label,url]=answer(q);append(msg,"bot");if(url){const wrap=document.createElement("div");wrap.style.padding="0 14px 8px";wrap.append(link("↗ "+label,url));log.append(wrap)}if(speak.checked&&"speechSynthesis"in window){try{window.speechSynthesis.cancel();const utt=new SpeechSynthesisUtterance(msg);utt.lang=/[\u4e00-\u9fff]/.test(msg)?"zh-TW":"en-US";window.speechSynthesis.speak(utt)}catch(e){}}}
for(const name of ["Books","YouTube","Services","Advertising"]){const b=document.createElement("button");b.type="button";b.textContent=name;b.addEventListener("click",()=>respond(name));actions.append(b)}
toggle.addEventListener("click",()=>{panel.classList.toggle("open");if(panel.classList.contains("open"))input.focus()});
panel.querySelector("#sc-assist-close").addEventListener("click",()=>{panel.classList.remove("open");if("speechSynthesis"in window)window.speechSynthesis.cancel()});
panel.querySelector("#sc-assist-form").addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value="";respond(q)});
append(lang.value==="zh-TW"?"歡迎光臨！我是 Smile Corner 中英雙語導覽員，可以介紹書籍、YouTube、設計服務和廣告合作。訊息不會寄給網站管理員。":"Welcome! I can guide you to books, YouTube, creative services, and advertising information. This is an automated FAQ guide; your messages stay in this browser and are not sent to Smile Corner.","bot");
})();