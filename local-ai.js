const $ = id => document.getElementById(id);
const state = $('aiState');
let engine, worker, loading = false, busy = false, stopped = false, last = '';
let history = [];
const system = {role: 'system', content: 'You are Smile Corner, a helpful creative writing assistant. Reply in the language requested. Be concise. Help with original stories and outlines. Do not claim to have published, sent email, bought items, accessed files, or verified sources. You cannot perform actions. Do not invent product links or prices.'};
function controls() {
  $('aiStart').disabled = loading || busy || !!engine;
  $('aiSend').disabled = !engine || busy;
  $('aiStop').disabled = !busy;
  $('aiReset').disabled = busy || !history.length;
  $('aiCopy').disabled = $('aiDownload').disabled = !last || busy;
}
function message(role, text) {
  const item = document.createElement('article'); item.className = 'ai-message';
  const heading = document.createElement('strong'); heading.textContent = role === 'user' ? '你' : '本機 AI';
  const content = document.createElement('p'); content.textContent = text;
  item.append(heading, content); $('aiConversation').append(item); return content;
}
$('aiStart').addEventListener('click', async () => {
  if (loading || engine) return;
  loading = true; controls(); state.textContent = '正在檢查裝置…';
  let candidate;
  try {
    if (!navigator.gpu || !await navigator.gpu.requestAdapter()) throw new Error('WEBGPU');
    state.textContent = '正在載入模型引擎，接著下載模型。請保持此分頁開啟。';
    const webllm = await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.87/+esm');
    const adapter = await navigator.gpu.requestAdapter();
    const model = adapter.features.has('shader-f16') ? 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC' : 'Qwen2.5-0.5B-Instruct-q4f32_1-MLC';
    worker = new Worker(new URL('./local-ai-worker.js', import.meta.url), {type: 'module'});
    candidate = new webllm.WebWorkerMLCEngine(worker, {initProgressCallback: report => {
      $('aiProgress').hidden = false; $('aiProgress').value = Math.max(0, Math.min(1, report.progress || 0));
      state.textContent = `正在準備本機 AI：${Math.round((report.progress || 0) * 100)}%。首次下載可能需要幾分鐘。`;
    }});
    let timer;
    try { await Promise.race([candidate.reload(model), new Promise((_, reject) => {timer = setTimeout(() => reject(new Error('TIMEOUT')), 600000);})]); }
    finally { clearTimeout(timer); }
    engine = candidate;
    state.textContent = '本機 AI 已啟動。可以輸入問題，或帶入創作需求。';
  } catch (error) {
    worker?.terminate(); worker = undefined; engine = undefined;
    state.textContent = error.message === 'WEBGPU' ? '這台裝置目前無法使用 WebGPU。請使用支援 WebGPU 的電腦版 Chrome 或 Edge，並開啟硬體加速。下方工作指令與本機草稿仍可使用。' : '模型未能啟動，可能是網路、下載、顯示記憶體或瀏覽器限制。你可以稍後重試，下方指令工具仍可使用。';
  } finally { loading = false; $('aiProgress').hidden = true; controls(); }
});
$('aiUseBrief').addEventListener('click', () => {
  const title = $('title').value.trim(), instruction = $('instruction').value.trim();
  $('aiPrompt').value = `請先規劃簡短大綱，不要一次寫完整本書。作品：${title || '未命名'}。類型：${$('genre').value}。書稿請用英文。需求：${instruction}`.slice(0, 1800);
  $('aiPrompt').focus();
});
$('aiSend').addEventListener('click', async () => {
  const prompt = $('aiPrompt').value.trim(); if (!engine || busy || !prompt) return;
  busy = true; stopped = false; controls();
  const user = {role:'user',content:prompt}; message('user', prompt);
  const output = message('assistant','正在思考…'); last = '';
  state.textContent = '正在你的裝置生成…';
  // Keep recent turns within the lightweight model context budget.
  const recent = []; let budget = 0;
  for (let i = history.length - 2; i >= 0; i -= 2) {
    const pair = history.slice(i, i + 2); const size = pair.reduce((n, m) => n + m.content.length, 0);
    if (budget + size > 1000) break; recent.unshift(...pair); budget += size;
  }
  try {
    const chunks = await engine.chat.completions.create({messages:[system,...recent,user],max_tokens:512,temperature:0.7,stream:true});
    for await (const chunk of chunks) {
      last += chunk.choices[0]?.delta?.content || ''; output.textContent = last || '正在思考…';
    }
    if (last) history.push(user, {role:'assistant',content:last});
    else output.textContent = '這次沒有產生文字，請縮短問題後重試。';
    state.textContent = stopped ? '已停止。保留目前已生成的文字。' : '回覆完成。請自行檢查內容。';
  } catch {
    output.textContent = last || '這次生成未完成，請縮短問題後重試。';
    state.textContent = '生成中斷；已產生的文字可以複製或下載。';
  } finally {busy = false; controls();}
});
$('aiStop').addEventListener('click', () => {if (busy) {stopped = true; engine.interruptGenerate();}});
$('aiReset').addEventListener('click', () => {history=[];last='';$('aiConversation').replaceChildren();state.textContent='對話已清除。';controls();});
$('aiCopy').addEventListener('click', async () => {try {await navigator.clipboard.writeText(last);state.textContent='AI 回覆已複製。';} catch {state.textContent='請選取回覆文字手動複製。';}});
$('aiDownload').addEventListener('click', () => {
  if (!last) return; const url=URL.createObjectURL(new Blob([last],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='smile-corner-ai-reply.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
});
controls();
