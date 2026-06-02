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
  ["Spain","Uruguay"],      ["Germany","Switzerland"],
  ["Brazil","Japan"],       ["Croatia","Morocco"],
  ["Argentina","Norway"],   ["Portugal","Mexico"],
  ["France","Senegal"],     ["England","Netherlands"],
  ["Belgium","Ecuador"],    ["United States","Colombia"],
  ["Egypt","Australia"],    ["Sweden","Scotland"],
  ["Canada","Qatar"],       ["South Korea","Ivory Coast"],
  ["Ghana","Panama"],       ["Austria","Iraq"]
];
