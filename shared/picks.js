// Everyone's Picks page — reads the pool's published "Public Picks" CSV
// (Group Picks columns A:O = name + 12 group winners + worst + goals, NO email)
// and renders one card per player.

const POOL = window.POOL;
document.getElementById("poolBadge").textContent = POOL.label;

const LETTERS = "ABCDEFGHIJKL";

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

function escHTML(s){ return (s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

// Skip the tab's title row and any empty rows; positions are fixed:
// 0=name, 1..12=group winners A..L, 13=worst team, 14=total goals.
function parsePicks(text){
  const rows=parseCSV(text); const out=[];
  for(const r of rows){
    const name=(r[0]||"").trim();
    if(!name || /group picks/i.test(name)) continue;
    const winners=r.slice(1,13).map(x=>(x||"").trim());
    if(winners.every(w=>!w)) continue; // not a data row
    out.push({ name, winners, worst:(r[13]||"").trim(), goals:(r[14]||"").trim() });
  }
  return out;
}

function cardHTML(p){
  const cells=p.winners.map((t,i)=>
    `<div class="pcell"><span class="pg">${LETTERS[i]}</span><span class="pt">${escHTML(t)||"—"}</span></div>`).join("");
  return `<div class="pcard">
    <div class="pname">${escHTML(p.name)}</div>
    <div class="pgrid">${cells}</div>
    <div class="pmeta"><span>Worst team: <b>${escHTML(p.worst)||"—"}</b></span><span>Total goals: <b>${escHTML(p.goals)||"—"}</b></span></div>
  </div>`;
}

async function load(){
  const el=document.getElementById("picks"), cnt=document.getElementById("pCount");
  const url=POOL.picksCsvUrl;
  if(!url || !/^https?:\/\//.test(url)){ el.innerHTML='<div class="empty">Picks aren’t published yet.</div>'; return; }
  try{
    const res=await fetch(url + (url.includes("?")?"&":"?") + "_=" + Date.now());
    if(!res.ok) throw new Error("fetch "+res.status);
    const players=parsePicks(await res.text());
    if(!players.length){ el.innerHTML='<div class="empty">No picks to show.</div>'; cnt.textContent=""; return; }
    cnt.textContent=players.length+" players";
    el.innerHTML=players.map(cardHTML).join("");
  }catch(e){ el.innerHTML='<div class="empty">Couldn’t load picks — is the Public Picks tab published?</div>'; }
}

load();
