/* ============================================================
   afrocue.js — shared script for all AfroCue pages
   ============================================================ */

// 👇 Set your Google Apps Script URL once here
var AFROCUE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyeARt-_vK9lDvdki3hLhQ89wcE1NC3ElHXvdKfbp71w3D0HujWse8DgMe4qnz-aite/exec';

// Expose it for pages that expect different names
window.AFROCUE_SCRIPT_URL = AFROCUE_SCRIPT_URL;
window.AFROCUE_CONFIG = {
  scriptUrl: AFROCUE_SCRIPT_URL
};

// Helper to get the URL from any page
function getAfroCueScriptUrl() {
  return AFROCUE_SCRIPT_URL;
}

// Simple submit function (URL‑encoded, no‑cors)
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
