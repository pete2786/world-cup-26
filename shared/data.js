// Shared tournament data — one source of truth for every pool.
// GROUPS: the 12 groups of the 2026 draw. Verify vs FIFA; keep spellings identical to your sheet.
// R32: the 16 Round-of-32 matchups, in bracket order (winners of M1 & M2 meet, etc.).
//   >>> THESE ARE PLACEHOLDERS until June 27 <<< — replace with the real Round of 32 then.
//   Editing this one file updates the bracket for ALL pools.
window.GROUPS = {
  A:["Mexico","South Africa","South Korea","Czechia"],
  B:["Canada","Bosnia and Herzegovina","Qatar","Switzerland"],
  C:["Brazil","Morocco","Haiti","Scotland"],
  D:["United States","Paraguay","Australia","Türkiye"],
  E:["Germany","Curaçao","Ivory Coast","Ecuador"],
  F:["Netherlands","Japan","Sweden","Tunisia"],
  G:["Belgium","Egypt","Iran","New Zealand"],
  H:["Spain","Cape Verde","Saudi Arabia","Uruguay"],
  I:["France","Senegal","Iraq","Norway"],
  J:["Argentina","Algeria","Austria","Jordan"],
  K:["Portugal","DR Congo","Uzbekistan","Colombia"],
  L:["England","Croatia","Ghana","Panama"]
};
window.R32 = [
  ["Germany","Paraguay"],                       // M74
  ["France","Sweden"],                          // M77
  ["South Africa","Canada"],                    // M73
  ["Netherlands","Morocco"],                    // M75
  ["2K","2L"],                                  // M83
  ["Spain","2J"],                               // M84
  ["United States","Bosnia and Herzegovina"],   // M81
  ["Belgium","3AEHIJ"],                         // M82
  ["Brazil","Japan"],                           // M76
  ["Ivory Coast","Norway"],                     // M78
  ["Mexico","3CEFHI"],                          // M79
  ["1L","3EHIJK"],                              // M80
  ["Argentina","Cape Verde"],                   // M86
  ["Australia","Egypt"],                        // M88
  ["Switzerland","3EFGIJ"],                     // M85
  ["1K","3DEIJL"]                               // M87
];

// The "Knockout Bracket" link on each pool's leaderboard stays grayed out until
// the real Round of 32 is set. It unlocks automatically the moment window.R32
// above no longer matches the shipped placeholders below — so just edit R32 on
// knockout day and every pool's knockout link goes live. (Don't edit this line.)
window.KNOCKOUT_OPEN = JSON.stringify(window.R32) !== '[["Spain","Uruguay"],["Germany","Switzerland"],["Brazil","Japan"],["Croatia","Morocco"],["Argentina","Norway"],["Portugal","Mexico"],["France","Senegal"],["England","Netherlands"],["Belgium","Ecuador"],["United States","Colombia"],["Egypt","Australia"],["Sweden","Scotland"],["Canada","Qatar"],["South Korea","Ivory Coast"],["Ghana","Panama"],["Austria","Iraq"]]';

// Tournament-wide key dates shown on every pool's leaderboard. Edit once here.
window.SCHEDULE = [
  { date: "Jun 11", label: "Group picks lock (opening match)" },
  { date: "Jun 27", label: "Group stage ends" },
  { date: "Jun 28", label: "Knockout opens — bracket picks lock at the first match" },
  { date: "Jul 19", label: "Final" }
];

// Provisional-standings banner on the leaderboard. Set to "" to hide it (e.g. once
// the group stage is final). Update the wording as you post each matchday's results.
window.PROVISIONAL = "Provisional — group standings as of Matchday 1. Points will change as the groups finish.";
