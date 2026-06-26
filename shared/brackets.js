// Everyone's Brackets — reads the pool's published "Public Knockout Picks" CSV
// (Knockout Picks columns A:AG = name + 31 picks + Final-goals, NO email) and
// renders one card per person: Champion + their road, expandable to the full funnel.

const POOL = window.POOL;
document.getElementById("poolBadge").textContent = POOL.label;
const R32 = window.R32;
const ROUND_TITLES = ["Round of 32","Round of 16","Quarterfinals","Semifinals","Final"];
const COUNTS = [16,8,4,2,1];

function parseCSV(text){
  const rows=[]; let row=[], f="", q=false;
  for(let i=0;i<text.length;i++){ const c=text[i];
    if(q){ if(c==='"'){ if(text[i+1]==='"'){f+='"';i++;} else q=false; } else f+=c; }
    else if(c==='"') q=true;
    else if(c===',') { row.push(f); f=""; }
    else if(c==='\n'){ row.push(f); rows.push(row); row=[]; f=""; }
    else if(c!=='\r') f+=c;
  }
  if(f!==""||row.length){ row.push(f); rows.push(row); }
  return rows;
}

function esc(s){ return (s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

// flat 31 picks -> rounds [R32(16), R16(8), QF(4), SF(2), Final(1)]
function unflatten(flat){ const t=[]; let i=0; for(const c of COUNTS){ t.push(flat.slice(i,i+c)); i+=c; } return t; }

function candidates(tree, ri, mi){
  if (ri===0) return (R32[mi]||[]).slice();
  const p = tree[ri-1];
  return [p[mi*2], p[mi*2+1]];
}

// the team the champion beat in round ri
function champOpponent(tree, champ, ri){
  const mi = tree[ri].indexOf(champ);
  if (mi < 0) return "";
  const c = candidates(tree, ri, mi);
  return c[0]===champ ? c[1] : c[0];
}

function parseRows(text){
  const rows = parseCSV(text); const out = [];
  for (const r of rows){
    const name = (r[0]||"").trim();
    if (!name || /knockout picks/i.test(name)) continue;
    const flat = r.slice(1,32).map(x=>(x||"").trim());
    if (flat.length < 31 || flat.some(x=>!x)) continue;   // incomplete row — skip
    out.push({ name, tree: unflatten(flat), goals: (r[32]||"").trim() });
  }
  return out;
}

function cardHTML(p, idx){
  const champ = p.tree[4][0];
  const road = ROUND_TITLES.map((t,ri)=>
    `<div class="revrow"><span class="k">${t}</span><span class="v">def. ${esc(champOpponent(p.tree, champ, ri))}</span></div>`).join("");
  let funnel = `<div class="fnl">`;
  for (let ri=0; ri<4; ri++){
    const chips = p.tree[ri].map(t=>`<span class="chip">${esc(t)}</span>`).join("");
    funnel += `<div class="fnlrow"><div class="rlab">${ROUND_TITLES[ri]} · ${p.tree[ri].length} advance</div><div class="fnlchips">${chips}</div></div>`;
  }
  funnel += `<div class="fnlrow"><div class="rlab">Champion</div><div class="fnlchips"><span class="chip champ">🏆 ${esc(champ)}</span></div></div></div>`;
  return `<div class="bcard">
    <div class="bhead"><div class="bname">${esc(p.name)}</div><div class="bchamp">🏆 ${esc(champ)}</div></div>
    <div class="broad">${road}<div class="revrow"><span class="k">Goals in the Final</span><span class="v">${esc(p.goals)||"—"}</span></div></div>
    <button class="bexpand" data-i="${idx}">Show full bracket ▾</button>
    <div class="bfunnel" id="bf${idx}" hidden>${funnel}</div>
  </div>`;
}

async function load(){
  const el = document.getElementById("brackets"), cnt = document.getElementById("bCount");
  const url = POOL.knockoutPicksCsvUrl;
  if (!url || !/^https?:\/\//.test(url)){ el.innerHTML='<div class="empty">Brackets aren’t published yet.</div>'; return; }
  try{
    const res = await fetch(url + (url.includes("?")?"&":"?") + "_=" + Date.now());
    if (!res.ok) throw new Error("fetch "+res.status);
    const people = parseRows(await res.text());
    if (!people.length){ el.innerHTML='<div class="empty">No brackets to show yet.</div>'; cnt.textContent=""; return; }
    cnt.textContent = people.length + " brackets";
    el.innerHTML = people.map((p,i)=>cardHTML(p,i)).join("");
    el.querySelectorAll(".bexpand").forEach(b=>b.addEventListener("click",()=>{
      const f = document.getElementById("bf"+b.dataset.i);
      const open = !f.hidden; f.hidden = open;
      b.textContent = open ? "Show full bracket ▾" : "Hide full bracket ▴";
    }));
  }catch(e){ el.innerHTML='<div class="empty">Couldn’t load brackets — is the Public Knockout Picks tab published?</div>'; }
}

load();
