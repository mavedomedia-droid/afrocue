/* ============================================================
   afrocue.js — shared script for all AfroCue pages
   ============================================================ */

// 👇 Set your Google Apps Script URL once here
var AFROCUE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzoQ1MZRbz2UPUIox6A0LEP4_Qt0hLTO72YbE1ZaRMJUWS5Zu2-lZKTLKwAOVOB8Xn/exec';

/* 👇 The Clayface guestlist runs on its OWN deployment, bound to its own
   spreadsheet, so it has its own URL. Keeping it separate means the
   guestlist cannot break the main site and a main-site redeploy cannot
   break the guestlist.

   Paste the /exec URL from the standalone Guestlist script here.
   Deploy > New deployment > Web app > Execute as: Me,
   Who has access: Anyone. glCheck() in that script prints the URL too. */
var AFROCUE_GUESTLIST_URL = 'https://script.google.com/macros/s/AKfycbw--OAhMb-KiIXLdctov7p6eFO2U8jVxnQc158fTbKQO7gf9tC2qPEGRhbjaMzLPonzyA/exec';

// Expose it for pages that expect different names
window.AFROCUE_SCRIPT_URL    = AFROCUE_SCRIPT_URL;
window.AFROCUE_GUESTLIST_URL = AFROCUE_GUESTLIST_URL;
window.AFROCUE_CONFIG = {
  scriptUrl:    AFROCUE_SCRIPT_URL,
  guestlistUrl: AFROCUE_GUESTLIST_URL
};

// Helper to get the URL from any page
function getAfroCueScriptUrl() {
  return AFROCUE_SCRIPT_URL;
}

// Same, for the guestlist deployment
function getAfroCueGuestlistUrl() {
  return AFROCUE_GUESTLIST_URL;
}

// Simple submit function (URL-encoded, no-cors)
function submitToGAS(data) {
  var body = 'payload=' + encodeURIComponent(JSON.stringify(data));
  return fetch(AFROCUE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  });
}

// Fire signup event for GTM
function fireSignupEvent(data) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'order_created_before_payment',
      source: data.source || 'unknown',
      email: data.email || '',
      phone: data.phone || '',
      name: data.name || '',
      instagram: data.instagram || ''
    });
  } catch (err) {
    console.warn('AfroCue: dataLayer push failed', err);
  }
}
