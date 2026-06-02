// Per-pool settings — the ONLY file that differs between pools.
// After publishing this pool's two Leaderboard tabs to CSV, paste those URLs below.
window.POOL = {
  label:            "Hale Field",
  submitUrl:        "",            // Apps Script web-app /exec URL for one-tap submit (group + bracket). Blank = players use Copy code. See SETUP.md.
  bracketSubmitUrl: "",            // optional; falls back to submitUrl if blank
  groupCsvUrl:      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbGs7rnyfUFQtO0hBpVhQSnbQav5SR4jpkxkskm8l_rjeImnL0dhTJClJstjQeIIWPpeuLD3z-XyMy/pub?gid=1069705092&single=true&output=csv",
  knockoutCsvUrl:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbGs7rnyfUFQtO0hBpVhQSnbQav5SR4jpkxkskm8l_rjeImnL0dhTJClJstjQeIIWPpeuLD3z-XyMy/pub?gid=825300602&single=true&output=csv",
  refreshSeconds:   60
};
