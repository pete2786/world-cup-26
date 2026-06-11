// Per-pool settings — the ONLY file that differs between pools.
// After publishing this pool's two Leaderboard tabs to CSV, paste those URLs below.
window.POOL = {
  label:            "Hale Field",
  groupLocked:      true,                                  // group picks closed — set false to reopen the group page
  submitUrl:        "https://script.google.com/macros/s/AKfycbxOeIMPwO_kLzgroH-2O0Av7-X6EsXSsiknwfqvcR4yoeH3m9g6iDXm-2J-ijwMeQIXtQ/exec", // Apps Script one-tap submit (group + bracket)
  bracketSubmitUrl: "",            // optional; falls back to submitUrl if blank
  groupCsvUrl:      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbGs7rnyfUFQtO0hBpVhQSnbQav5SR4jpkxkskm8l_rjeImnL0dhTJClJstjQeIIWPpeuLD3z-XyMy/pub?gid=1069705092&single=true&output=csv",
  knockoutCsvUrl:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbGs7rnyfUFQtO0hBpVhQSnbQav5SR4jpkxkskm8l_rjeImnL0dhTJClJstjQeIIWPpeuLD3z-XyMy/pub?gid=825300602&single=true&output=csv",
  refreshSeconds:   60,
  entryFee:         10,                                    // $ per round (shown on the leaderboard; set the sheet's Settings buy-ins to match)
  venmo:            "https://account.venmo.com/u/davidehp",
  paypal:           "https://paypal.me/davidehp",
  picksCsvUrl:      ""                                     // published 'Public Picks' tab CSV (name + group picks, NO email). Blank hides the button.
};
