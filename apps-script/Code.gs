/**
 * World Cup 2026 Pick'em — pick receiver.
 *
 * Bind this to ONE pool's workbook (Extensions → Apps Script), paste this code,
 * then Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
 * Copy the resulting /exec URL into that pool's config.js `submitUrl`.
 *
 * The pick pages POST a tab-separated code:
 *   Group    = Name + 12 group winners + worst team + total goals + Email      (16 fields)
 *   Knockout = Name + 31 bracket picks + Final-goals guess + Email             (34 fields)
 * Email is the LAST field, so it lands in a trailing column and never disturbs
 * the scoring columns. Re-submitting with the same email overwrites that row.
 * (33-field knockout codes from before the Final-goals tiebreaker are still accepted.)
 */

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
    if (!body && e && e.parameter && e.parameter.code) body = e.parameter.code; // form-encoded fallback
    body = String(body).replace(/[\r\n]+$/, "");
    if (!body) return out("error: empty body");

    var fields = body.split("\t");
    var n = fields.length;
    // Route by field-count RANGE so future form tweaks never need a redeploy:
    // group codes are ~16 fields, knockout codes are ~33+.
    var tab = (n >= 14 && n <= 20) ? "Group Picks" : (n >= 30) ? "Knockout Picks" : null;
    if (!tab) return out("error: unexpected field count " + n);

    var name = (fields[0] || "").trim();
    var email = (fields[n - 1] || "").trim();
    if (!name || !email) return out("error: missing name or email");

    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tab);
    if (!sh) return out("error: missing tab '" + tab + "'");

    // make sure the email column exists
    if (sh.getMaxColumns() < n) sh.insertColumnsAfter(sh.getMaxColumns(), n - sh.getMaxColumns());

    // upsert by email (last column); otherwise append
    var last = sh.getLastRow();
    var rowIndex = last + 1;
    if (last >= 1) {
      var keys = sh.getRange(1, n, last, 1).getValues();
      for (var i = 0; i < keys.length; i++) {
        if (String(keys[i][0]).trim().toLowerCase() === email.toLowerCase()) { rowIndex = i + 1; break; }
      }
    }

    sh.getRange(rowIndex, 1, 1, n).setValues([fields]);
    SpreadsheetApp.flush();
    return out("ok");
  } catch (err) {
    return out("error: " + err);
  }
}

function doGet() { return out("ok"); } // lets you sanity-check the URL in a browser

function out(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT);
}
