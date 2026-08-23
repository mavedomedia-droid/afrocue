// afrocue-config.js
window.AFROCUE_CONFIG = {
  // Replace with your deployed Google Apps Script Web App URL
  scriptUrl: 'https://script.google.com/macros/s/AKfycbxDt8SSQZpGSePoWXMf7oTnkuFzEDLDxqiMaaNZrGM79FGTkMidgCu0JEGV8SI2o5-L/exec',

  // Map form source to sheet tab name.
  // Each form sends a "source" field (e.g. 'newsletter', 'join', 'dj', 'roamers')
  // and the script uses this to append to the correct tab.
  sheetBySource: {
    newsletter: 'Users',
    join: 'Users',
    roamers: 'Users',
    dj: 'DJ'
  },

  // Optional column mapping: form field name -> sheet column name.
  // If your form fields already match the sheet headers, you can omit this.
  columnMap: {
    name: 'Name',
    email: 'Email',
    dj_name: 'DJ Name',
    city: 'City',
    instagram: 'Instagram',
    role: 'Role',
    primary_genre: 'Primary Genre',
    secondary_genres: 'Secondary Genres',
    resident_events: 'Resident Events',
    booking_email: 'Booking Email',
    booking_phone: 'Booking Phone',
    booking_same: 'Booking Same',
    newsletter: 'Newsletter',
    // Roamers-specific fields
    roamers_type: 'Roamer Type',
    parties: 'Parties',
    notify: 'Notify',
    phone: 'Phone',
    area: 'Area',
    is_creator: 'Is Creator',
    creator_type: 'Creator Type',
    portfolio: 'Portfolio',
    other_party: 'Other Party'
  }
};
