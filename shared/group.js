const POOL = window.POOL;
const GROUPS = window.GROUPS;
const LETTERS = Object.keys(GROUPS);
const winners = Array(LETTERS.length).fill(null);
const TOTAL = LETTERS.length + 2; // 12 groups + worst + goals

document.getElementById("poolBadge").textContent = POOL.label;

// populate worst-team dropdown (grouped by group)
(function fillWorst(){
  const sel = document.getElementById("worst");
  LETTERS.forEach(L=>{
    const og = document.createElement("optgroup"); og.label = "Group "+L;
    GROUPS[L].forEach(t=>{ const o=document.createElement("option"); o.value=t; o.textContent=t; og.appendChild(o); });
    sel.appendChild(og);
  });
})();

function renderGroups(){
  const root = document.getElementById("groups"); root.innerHTML="";
  LETTERS.forEach((L,i)=>{
    const card=document.createElement("div"); card.className="card";
    card.innerHTML=`<div class="lab">Group ${L}</div>`;
    GROUPS[L].forEach(team=>{
      const b=document.createElement("button"); b.className="team";
      if(winners[i]===team) b.classList.add("win"); else if(winners[i]) b.classList.add("lose");
      b.innerHTML=`<span class="dot"></span> ${team}`;
      b.onclick=()=>{ winners[i]=team; renderGroups(); updateStatus(); };
      card.appendChild(b);
    });
    root.appendChild(card);
  });
}

function goalsVal(){ const v=document.getElementById("goals").value.trim(); return v!=="" && Number(v)>=0 ? v : null; }
function done(){ return winners.filter(Boolean).length + (document.getElementById("worst").value?1:0) + (goalsVal()!==null?1:0); }

function updateStatus(){
  const n=done();
  document.getElementById("pcount").textContent=`${n} / ${TOTAL} done`;
  document.getElementById("barFill").style.width=(n/TOTAL*100)+"%";
  const name=document.getElementById("who").value.trim();
  document.getElementById("review").disabled = !(n===TOTAL && name.length>0);
  document.getElementById("hint").textContent =
    n<TOTAL ? `${TOTAL-n} left — groups, worst team, goals total.` : (name? "All set — review your picks." : "Enter your name to finish.");
}

function buildCode(){
  const name=document.getElementById("who").value.trim();
  return [name, ...winners, document.getElementById("worst").value, document.getElementById("goals").value.trim()].join("\t");
}

function openReview(){
  const name=document.getElementById("who").value.trim();
  if(done()!==TOTAL || !name) return;
  const wg=document.getElementById("wgrid"); wg.innerHTML="";
  LETTERS.forEach((L,i)=>{
    const c=document.createElement("div"); c.className="cell";
    c.innerHTML=`<div class="k">Group ${L}</div><div class="v">${winners[i]}</div>`; wg.appendChild(c);
  });
  document.getElementById("rWorst").textContent=document.getElementById("worst").value;
  document.getElementById("rGoals").textContent=document.getElementById("goals").value.trim();
  document.getElementById("code").value=buildCode();
  const sb=document.getElementById("submitBtn"); const url=POOL.submitUrl;
  if(url && /^https?:\/\//.test(url)){ sb.href=url; } else { sb.href="#"; sb.textContent="2 · (submit link not set)"; }
  document.getElementById("copied").textContent="";
  document.getElementById("modal").classList.add("open");
}

document.getElementById("who").addEventListener("input",updateStatus);
document.getElementById("worst").addEventListener("change",updateStatus);
document.getElementById("goals").addEventListener("input",updateStatus);
document.getElementById("review").addEventListener("click",openReview);
document.getElementById("closeX").addEventListener("click",()=>document.getElementById("modal").classList.remove("open"));
document.getElementById("modal").addEventListener("click",e=>{ if(e.target.id==="modal") e.currentTarget.classList.remove("open"); });
document.getElementById("copyBtn").addEventListener("click",async()=>{
  const txt=document.getElementById("code").value;
  try{ await navigator.clipboard.writeText(txt); }
  catch(e){ const t=document.getElementById("code"); t.focus(); t.select(); document.execCommand("copy"); }
  document.getElementById("copied").textContent="✓ copied";
});

renderGroups(); updateStatus();
