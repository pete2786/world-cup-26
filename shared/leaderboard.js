const POOL = window.POOL;
document.getElementById("poolBadge").textContent = POOL.label;

// Nav buttons: gray out (lock) the group link once picks close, and the knockout
// link until the real Round of 32 is in (window.KNOCKOUT_OPEN).
(function initNav(){
  const gp = document.getElementById("groupLink");
  if (gp && POOL.groupLocked){
    gp.classList.add("locked");
    gp.setAttribute("aria-disabled","true");
    gp.removeAttribute("href");          // not navigable once locked
    gp.title = "Group picks are locked.";
    if (!gp.querySelector(".lock")) gp.insertAdjacentHTML("beforeend", ' <span class="lock">🔒</span>');
  }
  const ko = document.getElementById("koLink");
  if (ko){
    if (window.KNOCKOUT_OPEN){
      ko.classList.remove("locked");
      ko.removeAttribute("aria-disabled");
      ko.title = "";
      const lock = ko.querySelector(".lock"); if (lock) lock.remove();
    } else {
      ko.removeAttribute("href");        // not navigable while locked
      ko.title = "Opens once the group stage is over and the Round of 32 is set.";
    }
  }
  // "Everyone's Picks" button: only show once picks are published for this pool.
  const pk = document.getElementById("picksLink");
  if (pk && POOL.picksCsvUrl && /^https?:\/\//.test(POOL.picksCsvUrl)) pk.style.display = "";
})();

// Rotating top banner: a random photo of footballing despair on each load.
// (Link-preview image stays fixed in the page <head>, so previews are consistent.)
(function rotateBanner(){
  const img = document.querySelector(".toplogo");
  if (!img) return;
  const BANNERS = [
    "../shared/seven-one.png",
    "../shared/despair-2.png",
    "../shared/despair-3.png",
    "../shared/despair-4.png",
    "../shared/despair-5.png"
  ];
  img.src = BANNERS[Math.floor(Math.random() * BANNERS.length)];
})();

// Info card: how-it-works + key dates (shared SCHEDULE) + pay buttons (from config).
(function renderInfo(){
  const el = document.getElementById("info");
  if (!el) return;
  const fee = POOL.entryFee;
  const dates = (window.SCHEDULE || []).map(s =>
    `<li><span class="d">${s.date}</span><span class="l">${s.label}</span></li>`).join("");
  const pay = [];
  if (POOL.venmo)  pay.push(`<a class="pay venmo" href="${POOL.venmo}" target="_blank" rel="noopener">Venmo</a>`);
  if (POOL.paypal) pay.push(`<a class="pay paypal" href="${POOL.paypal}" target="_blank" rel="noopener">PayPal</a>`);
  el.innerHTML =
    `<p class="info-how">Two contests, two pots — <b>Group stage</b> and <b>Knockout</b>${fee?`, <b>$${fee} to enter each round</b>`:""}. Group picks are open now; the knockout bracket opens after the group stage.</p>`
    + (dates ? `<ul class="info-dates">${dates}</ul>` : "")
    + (pay.length ? `<div class="info-pay"><span class="pl">Pay your entry${fee?` · $${fee}/round`:""}</span><span class="paybtns">${pay.join("")}</span></div>` : "");
})();

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

// pull {name, val, rank} from a published leaderboard CSV using a value-column name
function extract(text, valueHeader){
  const rows=parseCSV(text);
  let hi=-1;
  for(let i=0;i<rows.length;i++){ if(rows[i].some(c=>/^player$/i.test((c||"").trim()))){ hi=i; break; } }
  if(hi<0) return [];
  const head=rows[hi].map(c=>(c||"").trim().toLowerCase());
  const pi=head.indexOf("player");
  const vi=head.indexOf(valueHeader.toLowerCase());
  const ri=head.indexOf("rank");
  const out=[];
  for(let i=hi+1;i<rows.length;i++){
    const name=(rows[i][pi]||"").trim();
    if(!name || /^(tiebreak|if two|knockout champion|want flat)/i.test(name)) continue;
    const val=vi>=0?parseFloat(rows[i][vi]):NaN;
    const rank=ri>=0?parseInt(rows[i][ri],10):NaN;
    out.push({name, val:isNaN(val)?0:val, rank:isNaN(rank)?null:rank});
  }
  out.sort((a,b)=> (a.rank&&b.rank)? a.rank-b.rank : (b.val-a.val) || a.name.localeCompare(b.name));
  return out;
}

function rowHTML(p, idx, unit){
  const rk = p.rank || (idx+1);
  const cls = rk===1?"r1":rk===2?"r2":rk===3?"r3":"";
  return `<div class="lrow ${cls}"><div class="rk">${rk}</div>
    <div class="nm">${escapeHTML(p.name)}</div>
    <div class="pt">${p.val}<small>${unit}</small></div></div>`;
}
function escapeHTML(s){ return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

function paint(elId, countId, data, unit){
  const el=document.getElementById(elId), cnt=document.getElementById(countId);
  if(!data.length){ el.innerHTML='<div class="empty">No entries yet — be the first in.</div>'; cnt.textContent=""; return; }
  cnt.textContent = data.length + " playing";
  el.innerHTML = data.map((p,i)=>rowHTML(p,i,unit)).join("");
}

async function load(url, valueHeader){
  if(!url || !/^https?:\/\//.test(url)) return null;
  const res = await fetch(url + (url.includes("?")?"&":"?") + "_=" + Date.now());
  if(!res.ok) throw new Error("fetch "+res.status);
  return extract(await res.text(), valueHeader);
}

async function refresh(){
  const st=document.getElementById("status"); st.textContent="updating…";
  let ok=true;
  try{ const g=await load(POOL.groupCsvUrl,"Points"); if(g===null) document.getElementById("gBoard").innerHTML='<div class="empty">Group leaderboard link not set.</div>'; else paint("gBoard","gCount",g,"pts"); }
  catch(e){ ok=false; document.getElementById("gBoard").innerHTML='<div class="empty">Couldn’t load yet — is the Group leaderboard published?</div>'; }
  try{ const k=await load(POOL.knockoutCsvUrl,"Total"); if(k===null) document.getElementById("kBoard").innerHTML='<div class="empty">Knockout leaderboard link not set.</div>'; else paint("kBoard","kCount",k,"pts"); }
  catch(e){ ok=false; document.getElementById("kBoard").innerHTML='<div class="empty">Couldn’t load yet — is the Knockout leaderboard published?</div>'; }
  st.textContent = ok ? "updated " + new Date().toLocaleTimeString() : "couldn’t reach the sheet";
}

document.getElementById("refreshBtn").addEventListener("click", refresh);
refresh();
setInterval(refresh, Math.max(15, POOL.refreshSeconds||60)*1000);
