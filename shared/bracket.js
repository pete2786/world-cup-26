const POOL = window.POOL;
const R32 = window.R32;
const ROUNDS = [
  {key:"r32", title:"Round of 32", count:16},
  {key:"r16", title:"Round of 16", count:8},
  {key:"qf",  title:"Quarterfinals", count:4},
  {key:"sf",  title:"Semifinals", count:2},
  {key:"final", title:"Final", count:1}
];
const TOTAL = 31;

// state: picks[roundIndex][matchIndex] = team string or null
const picks = ROUNDS.map(r => Array(r.count).fill(null));

// single pool — show its name
document.getElementById("poolBadge").textContent = POOL.label;

// candidates feeding a match in a round (round 0 = R32 has fixed teams)
function candidates(ri, mi){
  if (ri===0) return R32[mi].slice();
  const prev = picks[ri-1];
  return [prev[mi*2], prev[mi*2+1]];
}

// when a pick changes, clear any downstream pick that's no longer valid
function cascade(ri){
  for (let r=ri+1; r<ROUNDS.length; r++){
    for (let m=0; m<picks[r].length; m++){
      const cand = candidates(r, m);
      if (picks[r][m] && !cand.includes(picks[r][m])) picks[r][m] = null;
    }
  }
}

function choose(ri, mi, team){
  if (!team) return;
  picks[ri][mi] = team;
  cascade(ri);
  render();
}

function countPicked(){ return picks.reduce((a,r)=>a + r.filter(Boolean).length, 0); }

function render(){
  const root = document.getElementById("rounds");
  root.innerHTML = "";
  ROUNDS.forEach((rd, ri)=>{
    const sec = document.createElement("section");
    sec.className = "round" + (rd.key==="final" ? " finalwrap" : "");
    const done = picks[ri].filter(Boolean).length;
    sec.innerHTML = `<h2>${rd.title} <span class="n">${done}/${rd.count}</span></h2><div class="hr"></div>`;
    const grid = document.createElement("div");
    grid.className = "matches" + (rd.count>=8 ? " two" : "");
    for (let mi=0; mi<rd.count; mi++){
      const cand = candidates(ri, mi);
      const card = document.createElement("div");
      card.className = "match";
      const labelTxt = rd.key==="final" ? "The Final" : `${rd.title} · Match ${mi+1}`;
      card.innerHTML = `<div class="lab">${labelTxt}</div>`;
      cand.forEach((team, slot)=>{
        const btn = document.createElement("button");
        btn.className = "team";
        if (!team){
          btn.disabled = true;
          const fromRound = ROUNDS[ri-1] ? ROUNDS[ri-1].title.replace("Round of","R") : "";
          btn.innerHTML = `<span class="dot"></span> Winner of ${fromRound} M${mi*2+slot+1}`;
        } else {
          const sel = picks[ri][mi];
          if (sel===team) btn.classList.add("win");
          else if (sel) btn.classList.add("lose");
          btn.innerHTML = `<span class="dot"></span> ${team}`;
          btn.onclick = ()=>choose(ri, mi, team);
        }
        card.appendChild(btn);
      });
      grid.appendChild(card);
    }
    sec.appendChild(grid);
    root.appendChild(sec);
  });
  updateStatus();
}

function updateStatus(){
  const n = countPicked();
  document.getElementById("pcount").textContent = `${n} / ${TOTAL} picked`;
  document.getElementById("barFill").style.width = (n/TOTAL*100)+"%";
  const champ = picks[4][0];
  document.getElementById("champTag").textContent = champ ? "🏆 " + champ : "";
  const name = document.getElementById("who").value.trim();
  const email = document.getElementById("email").value.trim();
  const ready = n===TOTAL && name.length>0 && emailOk(email);
  const btn = document.getElementById("review");
  btn.disabled = !ready;
  document.getElementById("hint").textContent =
    n<TOTAL ? `Pick all 31 matches to finish (${TOTAL-n} left).`
            : (!name ? "Enter your name to finish." : (!emailOk(email) ? "Add your email to finish." : "All set — review your bracket."));
}

// build the tab-separated code: Name + 31 picks, in sheet column order
function buildCode(){
  const name = document.getElementById("who").value.trim();
  const email = document.getElementById("email").value.trim();
  const flat = [].concat(...picks.map(r=>r.map(x=>x||"")));
  return [name, ...flat, email].join("\t");
}

function openReview(){
  const name = document.getElementById("who").value.trim();
  if (countPicked()!==TOTAL || !name || !emailOk(document.getElementById("email").value)) return;
  document.getElementById("rChamp").textContent = picks[4][0];
  const list = document.getElementById("review-list");
  list.innerHTML = "";
  // show SF winners (finalists), QF winners, and champion path summary
  const summary = [
    ["Finalists", `${picks[3][0]}  vs  ${picks[3][1]}`],
    ["Semifinalists", picks[2].join(", ")],
    ["Quarterfinalists", picks[1].slice(0,4).join(", ") + " …"]
  ];
  summary.forEach(([k,v])=>{
    const row=document.createElement("div"); row.className="revrow";
    row.innerHTML=`<span class="k">${k}</span><span class="v">${v}</span>`;
    list.appendChild(row);
  });
  wireSubmit(POOL.bracketSubmitUrl || POOL.submitUrl, buildCode());
  document.getElementById("modal").classList.add("open");
}

// null-safe listener binding: a missing element (e.g. during a cache version
// skew) is skipped instead of throwing and aborting the rest of the script.
function on(id,ev,fn){ const el=document.getElementById(id); if(el) el.addEventListener(ev,fn); }
on("who","input",updateStatus);
on("email","input",updateStatus);
on("review","click",openReview);
on("closeX","click",()=>document.getElementById("modal").classList.remove("open"));
on("modal","click",e=>{ if(e.target.id==="modal") e.currentTarget.classList.remove("open"); });

render();
