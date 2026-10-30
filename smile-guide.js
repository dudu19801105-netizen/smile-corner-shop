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
const toggle=document.createElement("button");toggle.id="sc-assist-toggle";toggle.type="button";toggle.textContent="🤖 Ask Smile Corner";
const panel=document.createElement("section");panel.id="sc-assist";panel.setAttribute("aria-label","Smile Corner virtual guide");
panel.innerHTML='<header><strong>🤖 Smile Corner Guide</strong><button type="button" id="sc-assist-close" aria-label="Close assistant">×</button></header><div id="sc-assist-log" role="log" aria-live="polite"></div><div id="sc-assist-actions"></div><form id="sc-assist-form"><input id="sc-assist-input" aria-label="Ask the assistant" maxlength="240" placeholder="Ask about books, services, YouTube..." required><button id="sc-assist-send" type="submit">Send</button></form><label id="sc-assist-voice"><input id="sc-assist-speak" type="checkbox"> Read replies aloud (browser voice)</label>';
document.body.append(toggle,panel);
const log=panel.querySelector("#sc-assist-log"),actions=panel.querySelector("#sc-assist-actions"),input=panel.querySelector("#sc-assist-input"),speak=panel.querySelector("#sc-assist-speak");
function append(message,who){const node=document.createElement("div");node.className="sc-msg "+who;node.textContent=message;log.append(node);log.scrollTop=log.scrollHeight}
const link=(text,href)=>{const a=document.createElement("a");a.href=href;a.textContent=text;a.target=href.startsWith("http")?"_blank":"_self";if(a.target==="_blank")a.rel="noopener noreferrer";return a};
function answer(q){const s=q.toLowerCase();if(/youtube|video|影片|油管|頻道/.test(s))return ["Our YouTube channel is ready to visit.","YouTube channel","https://www.youtube.com/channel/UCiMfU5up2GtF8NHKtxO75PA"];if(/book|amazon|書|買|購買|小說|pc|server|cloud|kindle/.test(s))return ["Browse the Smile Corner book catalog. Verify availability and author on Amazon before buying.","Browse books","books.html"];if(/adver|sponsor|廣告|贊助|合作/.test(s))return ["We welcome advertising and collaboration inquiries. Contact details are still being configured; this guide does not accept bookings or payment.","Advertising information","index.html#advertise"];if(/hire|design|quote|contact|service|設計|接案|聯絡|報價|委託|pdf/.test(s))return ["Explore our creative services. Direct inquiries are not yet connected, so please do not send sensitive details here.","Creative services","index.html#services"];if(/ai|studio|創作/.test(s))return ["Explore our creative planning tools. The AI Studio is a local planning workspace, not an automatic publishing service.","AI Studio","ai-studio.html"];if(/hello|hi|你好|哈囉|早安/.test(s))return ["Hello! I am the Smile Corner website guide. I can help you find books, videos, services, and advertising information."];return ["I'm a simple website guide, not a live AI agent yet. Ask about books, YouTube, services, advertising, or AI Studio."];}
function respond(q){append(q,"user");const [msg,label,url]=answer(q);append(msg,"bot");if(url){const wrap=document.createElement("div");wrap.style.padding="0 14px 8px";wrap.append(link("↗ "+label,url));log.append(wrap)}if(speak.checked&&"speechSynthesis"in window){try{window.speechSynthesis.cancel();const utt=new SpeechSynthesisUtterance(msg);utt.lang=/[\u4e00-\u9fff]/.test(msg)?"zh-TW":"en-US";window.speechSynthesis.speak(utt)}catch(e){}}}
for(const name of ["Books","YouTube","Services","Advertising"]){const b=document.createElement("button");b.type="button";b.textContent=name;b.addEventListener("click",()=>respond(name));actions.append(b)}
toggle.addEventListener("click",()=>{panel.classList.toggle("open");if(panel.classList.contains("open"))input.focus()});
panel.querySelector("#sc-assist-close").addEventListener("click",()=>{panel.classList.remove("open");if("speechSynthesis"in window)window.speechSynthesis.cancel()});
panel.querySelector("#sc-assist-form").addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value="";respond(q)});
append("Welcome! I can guide you to books, YouTube, creative services, and advertising information. This is an automated FAQ guide; your messages stay in this browser and are not sent to Smile Corner.","bot");
})();