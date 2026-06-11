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
  const email=document.getElementById("email").value.trim();
  document.getElementById("review").disabled = !(n===TOTAL && name.length>0 && emailOk(email));
  document.getElementById("hint").textContent =
    n<TOTAL ? `${TOTAL-n} left — groups, worst team, goals total.`
            : (!name ? "Enter your name to finish." : (!emailOk(email) ? "Add your email to finish." : "All set — review your picks."));
}

function buildCode(){
  const name=document.getElementById("who").value.trim();
  const email=document.getElementById("email").value.trim();
  return [name, ...winners, document.getElementById("worst").value, document.getElementById("goals").value.trim(), email].join("\t");
}

function openReview(){
  const name=document.getElementById("who").value.trim();
  if(done()!==TOTAL || !name || !emailOk(document.getElementById("email").value)) return;
  const wg=document.getElementById("wgrid"); wg.innerHTML="";
  LETTERS.forEach((L,i)=>{
    const c=document.createElement("div"); c.className="cell";
    c.innerHTML=`<div class="k">Group ${L}</div><div class="v">${winners[i]}</div>`; wg.appendChild(c);
  });
  document.getElementById("rWorst").textContent=document.getElementById("worst").value;
  document.getElementById("rGoals").textContent=document.getElementById("goals").value.trim();
  wireSubmit(POOL.submitUrl, buildCode());
  document.getElementById("modal").classList.add("open");
}

// Locked state: swap the picker for a "closed" card and hide the submit bar.
function renderLocked(){
  const a = document.querySelector(".actions"); if (a) a.style.display = "none";
  const w = document.querySelector(".wrap");
  if (w) w.innerHTML =
    `<header>
      <a class="backlink" href="./">← Standings</a>
      <div class="kicker">FIFA World Cup • Group Stage</div>
      <h1>Group Picks <span class="yr">’26</span></h1>
      <div class="poolbadge">${POOL.label}</div>
    </header>
    <div class="lockcard">
      <div class="lockicon">🔒</div>
      <h2>Group picks are locked</h2>
      <p>Submissions are closed for the group stage. Head to the standings to follow along.</p>
      <a class="btn primary" href="./">See the standings →</a>
    </div>`;
}

// null-safe listener binding: a missing element (e.g. during a cache version
// skew) is skipped instead of throwing and aborting the rest of the script.
function on(id,ev,fn){ const el=document.getElementById(id); if(el) el.addEventListener(ev,fn); }
on("who","input",updateStatus);
on("email","input",updateStatus);
on("worst","change",updateStatus);
on("goals","input",updateStatus);
on("review","click",openReview);
on("closeX","click",()=>document.getElementById("modal").classList.remove("open"));
on("modal","click",e=>{ if(e.target.id==="modal") e.currentTarget.classList.remove("open"); });

if (POOL.groupLocked) renderLocked();
else { renderGroups(); updateStatus(); }
