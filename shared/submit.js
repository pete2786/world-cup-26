// One-tap submit: POST the tab-separated picks code straight to the pool's Google
// Apps Script web app (which writes it into the workbook). The request is
// cross-origin and Apps Script doesn't send CORS headers, so we use mode:"no-cors"
// and resolve once the request is sent (we can't read the response body). The
// "Copy code" button stays as a manual fallback if anything goes wrong.

async function postCode(url, code){
  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // simple request — no CORS preflight
    body: code
  });
}

// Wire the review modal's Submit button to POST whatever is currently in #code.
// Called from openReview() each time the modal opens (url is the pool's web app).
function wireSubmit(url){
  const sb = document.getElementById("submitBtn");
  const note = document.getElementById("submitNote");
  if (!sb) return;
  sb.disabled = false;
  sb.textContent = "Submit my picks";
  sb.onclick = async () => {
    const code = document.getElementById("code").value;
    if (!url || !/^https?:\/\//.test(url)){
      if (note) note.textContent = "Direct submit isn’t set up yet — tap “Copy code” and send it to the organizer.";
      return;
    }
    sb.disabled = true;
    sb.textContent = "Submitting…";
    try {
      await postCode(url, code);
      sb.textContent = "Submitted ✓";
      if (note) note.textContent = "Got it! You can re-submit anytime to change your picks.";
    } catch (e) {
      sb.disabled = false;
      sb.textContent = "Submit my picks";
      if (note) note.textContent = "Couldn’t send just now — tap “Copy code” and send it to the organizer.";
    }
  };
}

// Light email check shared by the group + bracket pages.
function emailOk(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((v || "").trim()); }

window.wireSubmit = wireSubmit;
window.emailOk = emailOk;
