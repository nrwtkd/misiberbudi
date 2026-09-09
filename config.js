window.MISI_BERBUDI_CONFIG = Object.freeze({
  // Isi dengan URL Web App Google Apps Script yang berakhiran /exec.
  // Contoh: https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
  appsScriptUrl: '',

  appVersion: '2.0.0',
  submitTimeoutMs: 30000,

  // Biasanya tidak perlu diubah. Origin Google Apps Script standar sudah
  // diverifikasi langsung oleh app.js.
  allowedMessageOrigins: []
});
