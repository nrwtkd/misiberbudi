const MISI_BERBUDI_BRIDGE = Object.freeze({
  DATA_SHEET: 'DATA_INVESTOR',
  ALLOWED_CALLBACK_ORIGINS: [
    'https://misiberbudi.web.app',
    'https://nrwtkd.github.io'
  ],
  LOCK_WAIT_MS: 10000
});

/**
 * Web App entry point untuk frontend MISI BERBUDI.
 *
 * Tujuan bridge ini sengaja sempit:
 * 1) validasi payload minimum;
 * 2) cegah submit ganda berdasarkan idempotencyToken;
 * 3) tulis data ke DATA_INVESTOR dengan cepat;
 * 4) segera kembalikan konfirmasi ke iframe frontend melalui postMessage.
 *
 * Hindari email, generate PDF, lookup berat, atau pekerjaan lintas layanan di
 * jalur doPost ini. Pekerjaan lanjutan sebaiknya diproses oleh trigger terpisah
 * agar browser tidak menunggu terlalu lama.
 */
function doPost(e) {
  const requestId = safeString_(e && e.parameter && e.parameter.requestId);
  const callbackOrigin = normalizeCallbackOrigin_(e && e.parameter && e.parameter.callbackOrigin);

  try {
    const raw = e && e.parameter && e.parameter.payload;
    if (!raw) throw new Error('Payload tidak ditemukan.');

    const payload = JSON.parse(raw);
    validatePayload_(payload);

    // Honeypot: dianggap sukses secara diam-diam agar bot tidak mendapat sinyal.
    if (safeString_(payload.website)) {
      return bridgeResponse_({
        type: 'MISI_BERBUDI_SUBMIT_RESULT',
        ok: true,
        requestId: requestId || safeString_(payload.requestId),
        reference: 'IGNORED'
      }, callbackOrigin);
    }

    const result = persistSubmission_(payload);

    return bridgeResponse_({
      type: 'MISI_BERBUDI_SUBMIT_RESULT',
      ok: true,
      requestId: requestId || safeString_(payload.requestId),
      reference: result.reference,
      duplicate: result.duplicate === true
    }, callbackOrigin);
  } catch (err) {
    console.error(err);
    return bridgeResponse_({
      type: 'MISI_BERBUDI_SUBMIT_RESULT',
      ok: false,
      requestId: requestId,
      message: 'Profil belum dapat dicatat. Silakan coba kembali.',
      code: 'SUBMIT_ERROR'
    }, callbackOrigin);
  }
}

function persistSubmission_(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Apps Script harus terikat pada Spreadsheet backend.');

  let sheet = ss.getSheetByName(MISI_BERBUDI_BRIDGE.DATA_SHEET);
  if (!sheet) sheet = ss.insertSheet(MISI_BERBUDI_BRIDGE.DATA_SHEET);

  const lock = LockService.getScriptLock();
  lock.waitLock(MISI_BERBUDI_BRIDGE.LOCK_WAIT_MS);

  try {
    const headerMap = ensureHeaders_(sheet);
    const idem = safeString_(payload.idempotencyToken);

    const existing = findExistingSubmission_(sheet, headerMap, idem);
    if (existing) {
      return { reference: existing.reference, duplicate: true };
    }

    const reference = createReference_(payload);
    const valuesByHeader = buildRowValues_(payload, reference);
    const lastColumn = sheet.getLastColumn();
    const row = Array(lastColumn).fill('');

    Object.keys(valuesByHeader).forEach(header => {
      const col = headerMap[normalizeHeader_(header)];
      if (col) row[col - 1] = valuesByHeader[header];
    });

    sheet.appendRow(row);
    SpreadsheetApp.flush();

    return { reference: reference, duplicate: false };
  } finally {
    lock.releaseLock();
  }
}

function buildRowValues_(payload, reference) {
  const score = typeof calculatePriorityScore_ === 'function'
    ? calculatePriorityScore_(payload)
    : '';

  return {
    'Timestamp': new Date(),
    'Reference': reference,
    'Nomor Referensi': reference,
    'Nama': safeString_(payload.fullName),
    'Nama Lengkap': safeString_(payload.fullName),
    'Perusahaan': safeString_(payload.company),
    'Perusahaan/Organisasi': safeString_(payload.company),
    'Email': safeString_(payload.email),
    'Telepon': safeString_(payload.phone),
    'WhatsApp/Telepon': safeString_(payload.phone),
    'Sektor': safeString_(payload.sector),
    'Bidang': safeString_(payload.sector),
    'Jenis Investasi': safeString_(payload.investmentType),
    'Arah Investasi': safeString_(payload.investmentType),
    'Usaha Eksisting': safeString_(payload.existingBusiness),
    'Lokasi': safeString_(payload.district),
    'Kecamatan': safeString_(payload.district),
    'Catatan Lokasi': safeString_(payload.locationNote),
    'Nilai Investasi': finiteNumber_(payload.investmentValue),
    'Estimasi Nilai Investasi': finiteNumber_(payload.investmentValue),
    'Tenaga Kerja': finiteNumber_(payload.jobs),
    'Potensi Tenaga Kerja': finiteNumber_(payload.jobs),
    'Dukungan': joinArray_(payload.support),
    'Kebutuhan Dukungan': joinArray_(payload.support),
    'Ide Proyek': safeString_(payload.projectIdea),
    'Gambaran Proyek': safeString_(payload.projectIdea),
    'Kendala': safeString_(payload.obstacle),
    'Kendala/Pertanyaan': safeString_(payload.obstacle),
    'Skor Prioritas': score,
    'Idempotency Token': safeString_(payload.idempotencyToken),
    'Request ID': safeString_(payload.requestId),
    'Bahasa': safeString_(payload.language),
    'Sumber': safeString_(payload.source || 'github-pages'),
    'Submitted At': safeString_(payload.submittedAt),
    'Status': 'BARU',
    'Raw Payload': JSON.stringify(payload)
  };
}

/**
 * Menjaga header lama tetap utuh. Hanya menambahkan kolom penting bila belum ada.
 * Dengan begitu dashboard lama yang membaca kolom eksisting tidak dipindah/ditimpa.
 */
function ensureHeaders_(sheet) {
  const required = [
    'Timestamp',
    'Nomor Referensi',
    'Nama Lengkap',
    'Perusahaan/Organisasi',
    'Email',
    'WhatsApp/Telepon',
    'Bidang',
    'Arah Investasi',
    'Usaha Eksisting',
    'Kecamatan',
    'Catatan Lokasi',
    'Estimasi Nilai Investasi',
    'Potensi Tenaga Kerja',
    'Kebutuhan Dukungan',
    'Gambaran Proyek',
    'Kendala/Pertanyaan',
    'Skor Prioritas',
    'Idempotency Token',
    'Request ID',
    'Bahasa',
    'Sumber',
    'Submitted At',
    'Status',
    'Raw Payload'
  ];

  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, required.length).setValues([required]);
  } else {
    const current = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
    const normalized = current.map(normalizeHeader_);
    const missing = required.filter(h => normalized.indexOf(normalizeHeader_(h)) === -1);
    if (missing.length) {
      sheet.getRange(1, sheet.getLastColumn() + 1, 1, missing.length).setValues([missing]);
    }
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  return headers.reduce((map, h, index) => {
    const key = normalizeHeader_(h);
    if (key && !map[key]) map[key] = index + 1;
    return map;
  }, {});
}

function findExistingSubmission_(sheet, headerMap, idempotencyToken) {
  if (!idempotencyToken) return null;
  const idemCol = headerMap[normalizeHeader_('Idempotency Token')];
  if (!idemCol || sheet.getLastRow() < 2) return null;

  const finder = sheet
    .getRange(2, idemCol, sheet.getLastRow() - 1, 1)
    .createTextFinder(idempotencyToken)
    .matchEntireCell(true)
    .findNext();

  if (!finder) return null;

  const row = finder.getRow();
  const refCol =
    headerMap[normalizeHeader_('Nomor Referensi')] ||
    headerMap[normalizeHeader_('Reference')];

  const reference = refCol
    ? safeString_(sheet.getRange(row, refCol).getDisplayValue())
    : createReference_({ idempotencyToken: idempotencyToken });

  return { row: row, reference: reference };
}

function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Payload tidak valid.');
  if (!safeString_(payload.idempotencyToken)) throw new Error('Idempotency token wajib ada.');
  if (!safeString_(payload.fullName)) throw new Error('Nama wajib diisi.');
  if (!safeString_(payload.email)) throw new Error('Email wajib diisi.');
  if (!safeString_(payload.phone)) throw new Error('Kontak wajib diisi.');
  if (!safeString_(payload.sector)) throw new Error('Bidang wajib dipilih.');
  if (!safeString_(payload.investmentType)) throw new Error('Arah investasi wajib dipilih.');
  if (!safeString_(payload.district)) throw new Error('Lokasi wajib dipilih.');
  if (!(finiteNumber_(payload.investmentValue) > 0)) throw new Error('Nilai investasi tidak valid.');
  if (!Array.isArray(payload.support) || !payload.support.length) throw new Error('Dukungan belum dipilih.');
  if (payload.consent !== true) throw new Error('Persetujuan penggunaan data belum diberikan.');
}

function bridgeResponse_(message, callbackOrigin) {
  const origin = callbackOrigin || MISI_BERBUDI_BRIDGE.ALLOWED_CALLBACK_ORIGINS[0];
  const json = JSON.stringify(message).replace(/<\//g, '<\\/');
  const originJson = JSON.stringify(origin);

  const html = [
    '<!doctype html><html><head><meta charset="utf-8"></head><body>',
    '<script>',
    '(function(){',
    'var msg=' + json + ';',
    'var target=' + originJson + ';',
    'try { window.parent.postMessage(msg,target); } catch(e) {}',
    'setTimeout(function(){try{window.parent.postMessage(msg,target);}catch(e){}},250);',
    '})();',
    '<\/script>',
    '</body></html>'
  ].join('');

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function normalizeCallbackOrigin_(origin) {
  origin = safeString_(origin).replace(/\/$/, '');
  return MISI_BERBUDI_BRIDGE.ALLOWED_CALLBACK_ORIGINS.indexOf(origin) !== -1
    ? origin
    : MISI_BERBUDI_BRIDGE.ALLOWED_CALLBACK_ORIGINS[0];
}

function createReference_(payload) {
  const tz = Session.getScriptTimeZone() || 'Asia/Jakarta';
  const date = Utilities.formatDate(new Date(), tz, 'yyyyMMdd');
  const token = safeString_(payload && payload.idempotencyToken) || Utilities.getUuid();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token, Utilities.Charset.UTF_8);
  const suffix = digest.slice(0, 4).map(function(b) {
    return ('0' + ((b + 256) % 256).toString(16)).slice(-2);
  }).join('').toUpperCase();
  return 'SRG-' + date + '-' + suffix;
}

function normalizeHeader_(value) {
  return safeString_(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function safeString_(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function finiteNumber_(value) {
  const n = Number(value);
  return isFinite(n) ? n : 0;
}

function joinArray_(value) {
  return Array.isArray(value) ? value.map(safeString_).filter(Boolean).join(', ') : safeString_(value);
}

/**
 * Jalankan sekali setelah menempelkan bridge bila ingin memastikan header inti
 * tersedia sebelum uji kirim. Fungsi ini tidak menghapus/memindahkan kolom lama.
 */
function setupMisiBerbudiBridge() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Buka Apps Script dari Spreadsheet backend.');
  let sheet = ss.getSheetByName(MISI_BERBUDI_BRIDGE.DATA_SHEET);
  if (!sheet) sheet = ss.insertSheet(MISI_BERBUDI_BRIDGE.DATA_SHEET);
  ensureHeaders_(sheet);
  return 'MISI BERBUDI bridge siap.';
}
