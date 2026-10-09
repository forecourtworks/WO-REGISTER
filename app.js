/**
 * FORECOURT WORKS LTD — Work Order Register (Controlled Document)
 * Admin authorisation required for ADD / EDIT / DELETE.
 * Audit trail of every change with admin name, date and time.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'fsw_wo_register_v1';
  const AUDIT_KEY = 'fsw_wo_register_audit_v1';
  const STATUS_OPTS = ['Completed', 'Ongoing', 'Pending', 'Started', 'Stopped', 'Cancelled'];
  const TYPE_OPTS = ['Labour Only', 'Parts + Labour', 'Parts Only', ''];

  // Document Control Admins (passwords stored as SHA-256 hex)
  // Admin 1: Oguta  / 1986!@
  // Admin 2: Kamando / 2004!@
  const ADMINS = [
    { name: 'Oguta', hash: 'e4dd5bd04b25dd2902a92a4a14217d922dffd0786e2e786d34ae794689871efc' },
    { name: 'Kamando', hash: '27da462fd0cbe25e7b8c04cb674db6a7a7488fcd16c72ccb1bd86135cb2585b7' }
  ];

  // Seed data (historical 0001–0068)
  const SEED = [{"wo":"0001","type":"Labour Only","entry":"","start":"","end":"","status":"Completed","client":"MULTI DEAL","location":"KOMBANI","title":"TYRE INFLATOR INSTALLATION","zoho":"00128","etims":"","inv":"4,000.00","paid":"4,000.00","bal":"0.00"},{"wo":"0002","type":"Labour Only","entry":"24.12.25","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BUNYALA RD","title":"AST PIPING","zoho":"00129","etims":"","inv":"30,000.00","paid":"30,000.00","bal":"0.00"},{"wo":"0003","type":"Parts + Labour","entry":"07.01.26","start":"","end":"","status":"Completed","client":"AINUSHAMSI","location":"KALOLENI","title":"FDU#4 (WAYNE 3G) KEYPADS","zoho":"00137","etims":"","inv":"14,700.00","paid":"14,700.00","bal":"0.00"},{"wo":"0004","type":"Parts + Labour","entry":"","start":"","end":"","status":"Completed","client":"NOMAD","location":"KISERIAN","title":"PM Inspections & CA","zoho":"00132","etims":"","inv":"38,500.00","paid":"38,500.00","bal":"0.00"},{"wo":"0005","type":"Parts + Labour","entry":"07.01.26","start":"","end":"","status":"Completed","client":"AINU","location":"PUMWANI","title":"FDU#003 REPAIR","zoho":"00136","etims":"","inv":"8,800.00","paid":"8,800.00","bal":"0.00"},{"wo":"0006","type":"Parts + Labour","entry":"07.01.26","start":"","end":"","status":"Completed","client":"AINU","location":"KALOLENI","title":"FDU#01, GILBERCO VEEDER ROOT","zoho":"00138","etims":"","inv":"6,500.00","paid":"6,500.00","bal":"0.00"},{"wo":"0007","type":"Parts + Labour","entry":"29.11.2025","start":"","end":"","status":"Completed","client":"SALAMA ROADS","location":"MALINDI","title":"FDU#2 REPAIR (TOKHEIM)","zoho":"00121","etims":"","inv":"62,870.00","paid":"2,000.00","bal":"60,870.00"},{"wo":"0008","type":"Parts + Labour","entry":"31.07.2025","start":"","end":"","status":"Completed","client":"SALAMA ROADS","location":"SABAKI","title":"COMPRESSED AIR PIPING - Rework","zoho":"00106","etims":"","inv":"48,000.00","paid":"48,000.00","bal":"0.00"},{"wo":"0009","type":"Parts + Labour","entry":"20.12.2025","start":"","end":"","status":"Completed","client":"MOSHA","location":"MARIAKANI","title":"PM Inspections & CA","zoho":"00127","etims":"","inv":"64,930.00","paid":"64,930.00","bal":"0.00"},{"wo":"0010","type":"Labour Only","entry":"02.12.2025","start":"","end":"","status":"Completed","client":"HAKUUZ","location":"TONONOKA","title":"GARAGE EQUIPMENT SERVICING","zoho":"00124","etims":"","inv":"18,000.00","paid":"0.00","bal":"18,000.00"},{"wo":"0011","type":"Labour Only","entry":"10.10.2025","start":"","end":"","status":"Completed","client":"HAKUUZ","location":"TONONOKA","title":"WHEEL ALIGNMENT MACHINE INSTALLATION","zoho":"0018","etims":"","inv":"10,000.00","paid":"0.00","bal":"10,000.00"},{"wo":"0012","type":"Parts + Labour","entry":"07.01.2026","start":"","end":"","status":"Completed","client":"AINUSHAMSI","location":"KALOLENI","title":"GENSET ROOM & M.HOLE REPAIRS","zoho":"00139","etims":"","inv":"28,745.00","paid":"28,745.00","bal":"0.00"},{"wo":"0013","type":"Labour Only","entry":"","start":"","end":"","status":"Completed","client":"TARABI","location":"NAMANGA","title":"AIR COMPRESSOR REPAIR","zoho":"00140","etims":"","inv":"5,000.00","paid":"5,000.00","bal":"0.00"},{"wo":"0014","type":"Labour Only","entry":"","start":"","end":"","status":"Completed","client":"NOMAD","location":"NGONG","title":"FDU CALIBRATION","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0015","type":"Parts + Labour","entry":"17.01.2026","start":"","end":"","status":"Completed","client":"AINUSHAMSI","location":"PUMWANI","title":"FDU PM Inspections & Servicing","zoho":"00142","etims":"","inv":"64,240.00","paid":"64,240.00","bal":"0.00"},{"wo":"0016","type":"Labour Only","entry":"19.01.2026","start":"","end":"","status":"Completed","client":"MOSHA","location":"MARIAKANI","title":"AIR LINE RELOCATION","zoho":"","etims":"","inv":"5,000.00","paid":"5,000.00","bal":"0.00"},{"wo":"0017","type":"Labour Only","entry":"20.01.2026","start":"","end":"","status":"Completed","client":"MULTI DEAL","location":"KOMBANI","title":"AIR COMPRESSOR RELOCATION","zoho":"00144","etims":"","inv":"3,000.00","paid":"3,000.00","bal":"0.00"},{"wo":"0018","type":"","entry":"21.01.2026","start":"","end":"","status":"Completed","client":"AINUSHAMSI","location":"MARIAKANI","title":"FDU REPAIR","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0019","type":"Labour Only","entry":"31.07.2025","start":"","end":"","status":"Completed","client":"HAKUUZ","location":"MOMBASA","title":"REWORK - AIR COMPRESSOR REPAIR","zoho":"00146","etims":"","inv":"27,500.00","paid":"27,500.00","bal":"0.00"},{"wo":"0020","type":"Parts + Labour","entry":"28.01.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BUNYALA","title":"FDU PM","zoho":"00149","etims":"","inv":"50,399.00","paid":"50,000.00","bal":"399.00"},{"wo":"0021","type":"Parts + Labour","entry":"28.01.2026","start":"","end":"","status":"Ongoing","client":"TAHMEED","location":"BONJE","title":"REMEDIATION OF UST'S","zoho":"00153","etims":"","inv":"350,000.00","paid":"250,000.00","bal":"100,000.00"},{"wo":"0022","type":"Parts Only","entry":"03.02.2026","start":"","end":"","status":"Completed","client":"KENNYLAX","location":"LONGISA","title":"FDU's HOSE PURCHASE & DELIVERY","zoho":"00147","etims":"","inv":"7,500.00","paid":"7,500.00","bal":"0.00"},{"wo":"0023","type":"Parts + Labour","entry":"05.02.2026","start":"","end":"","status":"Completed","client":"MASS","location":"UTANGE","title":"FDU MAINTENANCE","zoho":"00148","etims":"","inv":"48,500.00","paid":"48,500.00","bal":"0.00"},{"wo":"0024","type":"Parts + Labour","entry":"05.02.2026","start":"","end":"","status":"Pending","client":"RADIUS CIRCLE","location":"KILIFI","title":"5T JACK SEALS REPLACEMENT","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0025","type":"Labour Only","entry":"05.02.2026","start":"","end":"","status":"Completed","client":"RANWAY","location":"KIKAMBALA","title":"COMPRESSED AIR RETICULATION","zoho":"00151","etims":"","inv":"24,100.00","paid":"22,000.00","bal":"2,100.00"},{"wo":"0026","type":"Labour Only","entry":"05.02.2026","start":"","end":"","status":"Pending","client":"MANCO","location":"MIKINDANI","title":"UST FABRICATION","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0027","type":"Labour Only","entry":"18.02.2026","start":"","end":"","status":"Pending","client":"TRIKAKA","location":"UKUNDA","title":"GENSET SERVICE","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0028","type":"Labour Only","entry":"","start":"","end":"","status":"Pending","client":"STARWAYS","location":"PORT REITZ","title":"FUEL SYSTEM PIPING","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0029","type":"Labour Only","entry":"07.03.2026","start":"","end":"","status":"Completed","client":"MOSHA","location":"MARIAKANI","title":"AIRGUAGE REPAIR","zoho":"00152","etims":"","inv":"2,000.00","paid":"2,000.00","bal":"0.00"},{"wo":"0030","type":"Parts Only","entry":"","start":"","end":"","status":"Pending","client":"MOSHA","location":"MARIAKANI","title":"MANHOLE COVER GASKET","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0031","type":"","entry":"13.03.2026","start":"","end":"","status":"Completed","client":"NEWLIFE","location":"MAVUENI","title":"SUPPLY AND INSTALLATION","zoho":"00154","etims":"","inv":"8,950.00","paid":"8,950.00","bal":"0.00"},{"wo":"0032","type":"Parts Only","entry":"16.03.2026","start":"","end":"","status":"Completed","client":"NEWLIFE","location":"MAVUENI","title":"SAFETY DECALS SUPPLY","zoho":"00155","etims":"","inv":"9,600.00","paid":"9,600.00","bal":"0.00"},{"wo":"0033","type":"Parts + Labour","entry":"02.12.2025","start":"","end":"","status":"Completed","client":"NYALI LINKS RD","location":"MAVUENI","title":"SUPPLY OF STICK ON WEIGHTS","zoho":"00123","etims":"","inv":"28,700.00","paid":"28,700.00","bal":""},{"wo":"0034","type":"Labour Only","entry":"20.03.2026","start":"","end":"","status":"Pending","client":"NEWLIFE","location":"MAVUENI","title":"GENSET PM SERVICE","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0035","type":"Parts + Labour","entry":"25.03.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BUNYALA","title":"FDU FLOW RATE RECTIFICATION","zoho":"00156","etims":"","inv":"11,000.00","paid":"11,000.00","bal":"0.00"},{"wo":"0036","type":"Labour Only","entry":"","start":"","end":"","status":"Completed","client":"MULTIDEAL","location":"KOMBANI","title":"AIR COMPRESSOR MAINTENANCE","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0037","type":"Labour Only","entry":"06.04.2026","start":"","end":"","status":"Pending","client":"EAGOL","location":"VIPINGO","title":"GARAGE EQ'PMENT INSTALLATION","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0038","type":"Labour Only","entry":"07.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BONJE","title":"AST#004 LADDER FABRICATION","zoho":"00161","etims":"","inv":"15,000.00","paid":"15,000.00","bal":"0.00"},{"wo":"0039","type":"Labour Only","entry":"08.04.2026","start":"","end":"","status":"Completed","client":"NOMAD","location":"KISERIAN","title":"FDU TROUBLESHOOTING & REPAIR","zoho":"00157","etims":"","inv":"6,000.00","paid":"6,000.00","bal":"0.00"},{"wo":"0040","type":"Parts + Labour","entry":"10.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BUNYALA","title":"REWORK - CHANGE OF CLOGGED FILTER","zoho":"00158","etims":"","inv":"0.00","paid":"0.00","bal":"0.00"},{"wo":"0041","type":"Parts + Labour","entry":"11.04.2026","start":"","end":"","status":"Pending","client":"TAHMEED","location":"BUNYALA","title":"TANK#002 CLEANING","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0042","type":"Parts + Labour","entry":"11.04.2026","start":"","end":"","status":"Pending","client":"TAHMEED","location":"BUNYALA","title":"AGO TRANSFER PUMP SERVICING","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0043","type":"Parts + Labour","entry":"11.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BONJE","title":"CALIBRATION OF TANK#004","zoho":"00159","etims":"","inv":"78,000.00","paid":"78,000.00","bal":"0.00"},{"wo":"0044","type":"Parts + Labour","entry":"11.04.2026","start":"","end":"","status":"Pending","client":"TAHMEED","location":"BONJE","title":"FDU, AST, BLACKMER & STP PM","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0045","type":"Parts Only","entry":"18.04.2026","start":"","end":"","status":"Completed","client":"KENNYLAX","location":"LONGISA","title":"SUPPLY OF 2PCS ¾\" FDU HOSE","zoho":"00160","etims":"","inv":"11,000.00","paid":"10,000.00","bal":"1,000.00"},{"wo":"0046","type":"Parts + Labour","entry":"28.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BONJE","title":"AST#004 PIPING","zoho":"00163","etims":"","inv":"60,000.00","paid":"60,000.00","bal":"0.00"},{"wo":"0047","type":"Labour Only","entry":"28.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BONJE","title":"STP MECH/ELECT INSTALLATION TK#004","zoho":"00164","etims":"","inv":"15,000.00","paid":"15,000.00","bal":"0.00"},{"wo":"0048","type":"Labour Only","entry":"04.05.2026","start":"09.07.2026","end":"09.07.2026","status":"Completed","client":"NOMAD","location":"KISERIAN","title":"WHEEL ALIGNMENT MACHINE REPAIR","zoho":"00166","etims":"KRASRN000258075/12","inv":"42,400.00","paid":"42,400.00","bal":""},{"wo":"0049","type":"Parts + Labour","entry":"04.05.2026","start":"09.07.2026","end":"","status":"Ongoing","client":"NOMAD","location":"KISERIAN","title":"4 POST LIFT MAINTENANCE","zoho":"00168","etims":"KRASRN000258075/11","inv":"14,500.00","paid":"14,500.00","bal":""},{"wo":"0050","type":"Parts Only","entry":"21.05.2026","start":"","end":"","status":"Completed","client":"KENNYLAX","location":"LONGISA","title":"SUPPLY 3No. FDU V-Belt","zoho":"00162","etims":"","inv":"4,500.00","paid":"4,000.00","bal":"500.00"},{"wo":"0051","type":"Parts + Labour","entry":"02.06.2026","start":"","end":"","status":"Completed","client":"NOMAD","location":"KISERIAN","title":"WHIP HOSE REPLACEMENT","zoho":"00165","etims":"","inv":"11,000.00","paid":"6,960.00","bal":"4,040.00"},{"wo":"0052","type":"Parts + Labour","entry":"07.06.2026","start":"07.06.2026","end":"07.06.2026","status":"Ongoing","client":"MOSHA","location":"MARIAKANI","title":"REPAIR AIRGAUGE'S UNRESPONSIVE (+) BUTTON","zoho":"00166","etims":"","inv":"900.00","paid":"900.00","bal":"0.00"},{"wo":"0053","type":"Parts + Labour","entry":"09.07.2026","start":"09.07.2026","end":"","status":"Ongoing","client":"NEWLIFE","location":"MAVUENI 1","title":"FDU LEAK REPAIR","zoho":"00167","etims":"","inv":"13,000.00","paid":"","bal":"13,000.00"},{"wo":"0054","type":"Parts Only","entry":"09.07.2026","start":"09.07.2026","end":"","status":"Completed","client":"SALAMA ROADS","location":"MALINDI","title":"SALE OF TWIN TYRE CONNECTOR","zoho":"00169","etims":"","inv":"3,500.00","paid":"3,500.00","bal":"0.00"},{"wo":"0055","type":"Labour Only","entry":"10.07.2026","start":"","end":"","status":"Pending","client":"NEWLIFE","location":"MAVUENI","title":"WHEEL ALIGNER DIAGNOSIS & REPAIR","zoho":"","etims":"","inv":"10,000.00","paid":"5,000.00","bal":"5,000.00"},{"wo":"0056","type":"","entry":"13.07.2026","start":"","end":"","status":"","client":"EAGOL-VIPINGO","location":"VIPINGO","title":"UST LID MODIFICATION & STP INSTALLATION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0057","type":"","entry":"13.07.2026","start":"","end":"","status":"","client":"PETROSOMA","location":"SALGAA","title":"AIR COMPRESSOR SERVICE","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0058","type":"Labour Only","entry":"27.07.2026","start":"27.07.2026","end":"28.07.2026","status":"Completed","client":"MULTI DEAL","location":"KOMBANI","title":"TYRE INFLATOR HOSE REPLACEMENT","zoho":"00177","etims":"","inv":"7,500.00","paid":"7,500.00","bal":"0.00"},{"wo":"0059","type":"Parts + Labour","entry":"01.08.2026","start":"","end":"","status":"","client":"MASS","location":"VOI","title":"FUEL SYSTEM PIPING","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0060","type":"Parts Only","entry":"13.08.2026","start":"13.08.2026","end":"13.08.2026","status":"Completed","client":"MASS","location":"MAKUPA","title":"SUPPLY OF ¾\" FDU HOSE - 1PC","zoho":"00178","etims":"","inv":"4,500.00","paid":"4,500.00","bal":"0.00"},{"wo":"0061","type":"","entry":"17.08.2026","start":"17.08.2026","end":"17.08.2026","status":"Completed","client":"PMC","location":"NAIROBI","title":"SALES COMMISSION","zoho":"N/A","etims":"","inv":"30,000.00","paid":"30,000.00","bal":"0.00"},{"wo":"0062","type":"Labour Only","entry":"17.08.2026","start":"21.08.2026","end":"","status":"","client":"MULTI DEAL","location":"KOMBANI","title":"FRP MANHOLE COVER INSTALLATION","zoho":"","etims":"","inv":"35,000.00","paid":"","bal":"35,000.00"},{"wo":"0063","type":"Labour Only","entry":"23.08.2026","start":"","end":"","status":"Completed","client":"MASS","location":"UTANGE","title":"REPAIR OF LLJ08 FLOWMETER","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0064","type":"Labour Only","entry":"05.09.2026","start":"05.09.2026","end":"","status":"Completed","client":"AINUSHAMSI","location":"PUMWANI","title":"CONDITION INSPECTION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0065","type":"Labour Only","entry":"","start":"","end":"","status":"Ongoing","client":"MOSHA","location":"MARIAKANI","title":"CARWASH REPAIR","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0066","type":"Parts + Labour","entry":"","start":"","end":"","status":"Completed","client":"NEW LIFE","location":"MAVUENI","title":"STP INSTALLATION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0067","type":"","entry":"","start":"","end":"","status":"","client":"AINUSHAMSI","location":"PUMWANI","title":"CONDITION INSPECTION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0068","type":"","entry":"","start":"","end":"","status":"","client":"PETROSOMA","location":"SALGAA","title":"MOTOR PROTECTION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"}];

  let records = [];
  let filtered = [];
  let auditLog = [];
  let showAll = false;
  let deleteTarget = null;
  let pendingAuth = null; // { action, resolve, reject, meta }

  // ---------- Crypto helpers ----------
  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function verifyAdmin(name, password) {
    const n = (name || '').trim().toLowerCase();
    const hash = await sha256Hex(password || '');
    return ADMINS.find(a => a.name.toLowerCase() === n && a.hash === hash) || null;
  }

  // ---------- Audit ----------
  function loadAudit() {
    try {
      const raw = localStorage.getItem(AUDIT_KEY);
      auditLog = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(auditLog)) auditLog = [];
    } catch (_) {
      auditLog = [];
    }
  }

  function saveAudit() {
    try {
      localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog));
    } catch (_) {}
  }

  function logChange(action, adminName, wo, detail) {
    const entry = {
      action: action,
      admin: adminName,
      wo: wo || '',
      detail: detail || '',
      at: new Date().toISOString()
    };
    auditLog.unshift(entry);
    // keep last 500 entries
    if (auditLog.length > 500) auditLog = auditLog.slice(0, 500);
    saveAudit();
  }

  function formatTs(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    } catch (_) {
      return iso;
    }
  }

  // ---------- Auth modal ----------
  function requestAuth(actionLabel, meta) {
    return new Promise((resolve, reject) => {
      pendingAuth = { resolve, reject, meta: meta || {}, actionLabel };
      document.getElementById('auth-title').textContent = 'Admin Authorisation Required';
      document.getElementById('auth-msg').textContent =
        'Authorise to ' + actionLabel + '. Enter Document Control Admin name and password.';
      document.getElementById('auth-name').value = '';
      document.getElementById('auth-pass').value = '';
      document.getElementById('auth-error').classList.remove('show');
      document.getElementById('auth-modal').classList.add('open');
      setTimeout(() => document.getElementById('auth-name').focus(), 50);
    });
  }

  function closeAuth(success, admin) {
    document.getElementById('auth-modal').classList.remove('open');
    const p = pendingAuth;
    pendingAuth = null;
    if (!p) return;
    if (success) p.resolve(admin);
    else p.reject(new Error('cancelled'));
  }

  async function onAuthOk() {
    const name = document.getElementById('auth-name').value;
    const pass = document.getElementById('auth-pass').value;
    const admin = await verifyAdmin(name, pass);
    if (!admin) {
      document.getElementById('auth-error').classList.add('show');
      document.getElementById('auth-pass').value = '';
      document.getElementById('auth-pass').focus();
      return;
    }
    closeAuth(true, admin);
  }

  // ---------- Persistence ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        records = JSON.parse(raw);
        if (!Array.isArray(records) || records.length === 0) records = JSON.parse(JSON.stringify(SEED));
      } else {
        records = JSON.parse(JSON.stringify(SEED));
      }
    } catch (e) {
      records = JSON.parse(JSON.stringify(SEED));
    }
    records.sort((a, b) => parseInt(a.wo, 10) - parseInt(b.wo, 10));
  }

  function save(silent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      if (!silent) toast('Saved');
    } catch (e) {
      toast('Save failed – storage full?');
    }
  }

  let saveTimer = null;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => save(true), 400);
  }

  // ---------- Helpers ----------
  function nextWoNumber() {
    let max = 0;
    records.forEach(r => {
      const n = parseInt(r.wo, 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return String(max + 1).padStart(4, '0');
  }

  function calcBal(inv, paid) {
    const i = parseFloat(String(inv || '0').replace(/,/g, '')) || 0;
    const p = parseFloat(String(paid || '0').replace(/,/g, '')) || 0;
    return (i - p).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function parseDateLoose(s) {
    if (!s) return null;
    const m = String(s).trim().match(/(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{2,4})/);
    if (!m) return null;
    let d = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, y = parseInt(m[3], 10);
    if (y < 100) y += 2000;
    return new Date(y, mo, d);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function findRecord(wo) {
    return records.find(r => r.wo === wo);
  }

  // ---------- Filtering ----------
  function applyFilters() {
    const clientQ = (document.getElementById('q-client').value || '').trim().toLowerCase();
    const woQ = (document.getElementById('q-wo').value || '').trim();
    const fromQ = parseDateLoose(document.getElementById('q-from').value);
    const toQ = parseDateLoose(document.getElementById('q-to').value);
    const statusQ = document.getElementById('q-status').value;

    let list = records.slice();

    if (clientQ) list = list.filter(r => (r.client || '').toLowerCase().includes(clientQ));
    if (woQ) {
      list = list.filter(r =>
        (r.wo || '').includes(woQ.replace(/^0+/, '')) ||
        (r.wo || '') === woQ.padStart(4, '0')
      );
    }
    if (statusQ) list = list.filter(r => r.status === statusQ);
    if (fromQ || toQ) {
      list = list.filter(r => {
        const d = parseDateLoose(r.entry) || parseDateLoose(r.start) || parseDateLoose(r.end);
        if (!d) return false;
        if (fromQ && d < fromQ) return false;
        if (toQ && d > toQ) return false;
        return true;
      });
    }

    const hasFilter = !!(clientQ || woQ || fromQ || toQ || statusQ);
    filtered = (!hasFilter && !showAll) ? list.slice(-5) : list;

    renderTable();
    const total = records.length;
    const shown = filtered.length;
    const info = document.getElementById('view-info');
    info.textContent = (!hasFilter && !showAll)
      ? `Showing last ${shown} of ${total}`
      : `Showing ${shown} of ${total}`;
  }

  // ---------- Render ----------
  function renderTable() {
    const tbody = document.getElementById('wo-tbody');
    const empty = document.getElementById('empty-state');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    const rows = filtered.slice().reverse();

    rows.forEach(rec => {
      const tr = document.createElement('tr');
      tr.dataset.wo = rec.wo;
      const statusClass = 'status-' + (rec.status || '').replace(/\s/g, '');
      tr.innerHTML = `
        <td><input class="cell-input wo-num" data-field="wo" value="${esc(rec.wo)}" readonly title="WO number is auto-managed" /></td>
        <td>
          <select class="cell-select" data-field="type">
            ${TYPE_OPTS.map(o => `<option value="${esc(o)}" ${rec.type === o ? 'selected' : ''}>${o || '—'}</option>`).join('')}
          </select>
        </td>
        <td><input class="cell-input" data-field="entry" value="${esc(rec.entry)}" placeholder="DD.MM.YYYY" /></td>
        <td><input class="cell-input" data-field="start" value="${esc(rec.start)}" placeholder="DD.MM.YYYY" /></td>
        <td><input class="cell-input" data-field="end" value="${esc(rec.end)}" placeholder="DD.MM.YYYY" /></td>
        <td>
          <select class="cell-select status ${statusClass}" data-field="status">
            <option value="">—</option>
            ${STATUS_OPTS.map(o => `<option value="${o}" ${rec.status === o ? 'selected' : ''}>${o}</option>`).join('')}
          </select>
        </td>
        <td><input class="cell-input" data-field="client" value="${esc(rec.client)}" /></td>
        <td><input class="cell-input" data-field="location" value="${esc(rec.location)}" /></td>
        <td><input class="cell-input" data-field="title" value="${esc(rec.title)}" /></td>
        <td><input class="cell-input" data-field="zoho" value="${esc(rec.zoho)}" /></td>
        <td><input class="cell-input" data-field="etims" value="${esc(rec.etims)}" /></td>
        <td><input class="cell-input amt" data-field="inv" value="${esc(rec.inv)}" /></td>
        <td><input class="cell-input amt" data-field="paid" value="${esc(rec.paid)}" /></td>
        <td><input class="cell-input amt" data-field="bal" value="${esc(rec.bal)}" readonly title="Auto-calculated" /></td>
        <td class="row-actions">
          <button class="icon-btn delete" data-action="delete" title="Delete (requires admin)">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.cell-input, .cell-select').forEach(el => {
      if (el.dataset.field === 'wo' || el.dataset.field === 'bal') return;
      // store original value on focus
      el.addEventListener('focus', function () {
        this.dataset.orig = this.value;
      });
      el.addEventListener('change', onCellChange);
    });
    // live bal while typing amounts (display only; commit still needs auth on change)
    tbody.querySelectorAll('[data-field="inv"], [data-field="paid"]').forEach(el => {
      el.addEventListener('input', function () {
        const tr = this.closest('tr');
        const inv = tr.querySelector('[data-field="inv"]').value;
        const paid = tr.querySelector('[data-field="paid"]').value;
        const balInput = tr.querySelector('[data-field="bal"]');
        if (balInput) balInput.value = calcBal(inv, paid);
      });
    });
    tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', onDeleteClick);
    });
  }

  // ---------- Cell change (requires auth) ----------
  async function onCellChange(e) {
    const el = e.target;
    const tr = el.closest('tr');
    const wo = tr.dataset.wo;
    const field = el.dataset.field;
    const rec = findRecord(wo);
    if (!rec || field === 'wo' || field === 'bal') return;

    const newVal = el.value;
    const oldVal = el.dataset.orig !== undefined ? el.dataset.orig : (rec[field] || '');

    // no real change
    if (String(newVal) === String(oldVal)) return;

    // revert UI immediately until authorised
    el.value = oldVal;
    if (field === 'status') {
      el.className = 'cell-select status status-' + (oldVal || '').replace(/\s/g, '');
    }

    try {
      const admin = await requestAuth(
        'edit WO ' + wo + ' (' + field + ')',
        { type: 'EDIT', wo, field, newVal, oldVal }
      );

      rec[field] = newVal;
      el.value = newVal;
      el.dataset.orig = newVal;

      if (field === 'status') {
        el.className = 'cell-select status status-' + (newVal || '').replace(/\s/g, '');
      }
      if (field === 'inv' || field === 'paid') {
        rec.bal = calcBal(rec.inv, rec.paid);
        const balInput = tr.querySelector('[data-field="bal"]');
        if (balInput) balInput.value = rec.bal;
      }

      logChange('EDIT', admin.name, wo, field + ': "' + oldVal + '" → "' + newVal + '"');
      scheduleSave();
      toast('Edit authorised by ' + admin.name);
    } catch (_) {
      // cancelled — already reverted
      toast('Edit cancelled');
    }
  }

  // ---------- Delete ----------
  function onDeleteClick(e) {
    const tr = e.target.closest('tr');
    deleteTarget = tr.dataset.wo;
    document.getElementById('modal-title').textContent = 'Delete Work Order?';
    document.getElementById('modal-msg').textContent =
      'Remove WO ' + deleteTarget + ' permanently? Admin authorisation will be required.';
    document.getElementById('confirm-modal').classList.add('open');
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const wo = deleteTarget;
    document.getElementById('confirm-modal').classList.remove('open');

    try {
      const admin = await requestAuth('delete WO ' + wo, { type: 'DELETE', wo });
      const rec = findRecord(wo);
      const snapshot = rec ? (rec.client || '') + ' / ' + (rec.title || '') : '';
      records = records.filter(r => r.wo !== wo);
      logChange('DELETE', admin.name, wo, snapshot);
      deleteTarget = null;
      applyFilters();
      save(true);
      toast('Deleted WO ' + wo + ' (authorised by ' + admin.name + ')');
    } catch (_) {
      deleteTarget = null;
      toast('Delete cancelled');
    }
  }

  // ---------- ADD ----------
  async function addRow() {
    try {
      const admin = await requestAuth('add a new work order', { type: 'ADD' });
      const newWo = nextWoNumber();
      const today = new Date();
      const entry = [
        String(today.getDate()).padStart(2, '0'),
        String(today.getMonth() + 1).padStart(2, '0'),
        today.getFullYear()
      ].join('.');

      const rec = {
        wo: newWo,
        type: '',
        entry: entry,
        start: '',
        end: '',
        status: 'Pending',
        client: '',
        location: '',
        title: '',
        zoho: '',
        etims: '',
        inv: '',
        paid: '',
        bal: '0.00'
      };
      records.push(rec);
      logChange('ADD', admin.name, newWo, 'New work order created');
      showAll = true;
      document.getElementById('q-client').value = '';
      document.getElementById('q-wo').value = newWo;
      document.getElementById('q-from').value = '';
      document.getElementById('q-to').value = '';
      document.getElementById('q-status').value = '';
      applyFilters();
      save(true);
      toast('WO ' + newWo + ' added (authorised by ' + admin.name + ')');
      setTimeout(() => {
        const tr = document.querySelector('tr[data-wo="' + newWo + '"]');
        if (tr) {
          const clientInput = tr.querySelector('[data-field="client"]');
          if (clientInput) clientInput.focus();
        }
      }, 50);
    } catch (_) {
      toast('Add cancelled');
    }
  }

  // ---------- Audit UI ----------
  function showAudit() {
    const box = document.getElementById('audit-list');
    if (auditLog.length === 0) {
      box.innerHTML = '<p style="color:#64748b;padding:12px">No changes recorded yet.</p>';
    } else {
      let html = '<table><thead><tr><th>When</th><th>Action</th><th>WO</th><th>Admin</th><th>Detail</th></tr></thead><tbody>';
      auditLog.forEach(e => {
        html += '<tr>' +
          '<td>' + esc(formatTs(e.at)) + '</td>' +
          '<td><strong>' + esc(e.action) + '</strong></td>' +
          '<td>' + esc(e.wo) + '</td>' +
          '<td>' + esc(e.admin) + '</td>' +
          '<td>' + esc(e.detail) + '</td>' +
          '</tr>';
      });
      html += '</tbody></table>';
      box.innerHTML = html;
    }
    document.getElementById('audit-modal').classList.add('open');
  }

  // ---------- PDF Export (no auth required — read only) ----------
  async function exportPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const OUTER = 5;
    const MARGIN = 8;
    const NAVY = [13, 38, 77];
    const GREY = [100, 116, 139];
    const GREEN = [22, 101, 52];
    const ORANGE = [194, 65, 12];
    const SOFT = [241, 245, 249];
    const RED = [127, 29, 29];

    doc.setDrawColor(...NAVY);
    doc.setLineWidth(0.55);
    doc.rect(OUTER, OUTER, pageW - 2 * OUTER, pageH - 2 * OUTER);
    doc.setLineWidth(0.22);
    doc.rect(OUTER + 1.1, OUTER + 1.1, pageW - 2 * (OUTER + 1.1), pageH - 2 * (OUTER + 1.1));

    let y = OUTER + 5;
    // Controlled document stamp
    doc.setFillColor(...RED);
    doc.rect(MARGIN, y - 2, 48, 4.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(254, 202, 202);
    doc.text('CONTROLLED DOCUMENT', MARGIN + 1.5, y + 1.2);

    y = OUTER + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text('FORECOURT WORKS LIMITED', MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...GREY);
    doc.text('Engineering Reliability Into Every Forecourt', MARGIN, y + 3.2);
    doc.text('Ramco Court, GT 3B, South C, Nairobi  |  +254 729-002-087  |  sales@forecourtworks.co.ke', MARGIN, y + 6);

    try {
      const logoImg = await loadImageAsDataUrl('forecourt-logo-mark.png');
      if (logoImg) doc.addImage(logoImg, 'PNG', pageW - MARGIN - 38, OUTER + 3, 36, 6.5);
    } catch (_) {}

    y = OUTER + 16;
    doc.setDrawColor(13, 71, 140);
    doc.setLineWidth(0.35);
    doc.line(MARGIN, y, pageW - MARGIN, y);

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text('WORK ORDER REGISTER', pageW / 2, y, { align: 'center' });
    y += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GREY);
    doc.text('Exported ' + new Date().toLocaleDateString('en-GB') + '  •  ' + filtered.length + ' record(s)  •  Controlled Document', pageW / 2, y, { align: 'center' });

    const cols = [
      { key: 'wo', label: 'WO', w: 12 },
      { key: 'type', label: 'TYPE', w: 22 },
      { key: 'entry', label: 'ENTRY', w: 18 },
      { key: 'start', label: 'START', w: 18 },
      { key: 'end', label: 'END', w: 18 },
      { key: 'status', label: 'STATUS', w: 20 },
      { key: 'client', label: 'CLIENT', w: 26 },
      { key: 'location', label: 'LOCATION', w: 22 },
      { key: 'title', label: 'JOB TITLE', w: 48 },
      { key: 'zoho', label: 'ZOHO', w: 14 },
      { key: 'etims', label: 'eTIMS', w: 16 },
      { key: 'inv', label: 'INV AMT', w: 18 },
      { key: 'paid', label: 'PAID', w: 16 },
      { key: 'bal', label: 'BAL', w: 16 }
    ];
    const totalW = cols.reduce((s, c) => s + c.w, 0);
    const scale = (pageW - 2 * MARGIN) / totalW;
    cols.forEach(c => { c.w = c.w * scale; });

    y += 5;
    const headerH = 6.5;
    const rowH = 5.8;
    const usableBottom = pageH - OUTER - 6;

    function drawFrame() {
      doc.setDrawColor(...NAVY);
      doc.setLineWidth(0.55);
      doc.rect(OUTER, OUTER, pageW - 2 * OUTER, pageH - 2 * OUTER);
      doc.setLineWidth(0.22);
      doc.rect(OUTER + 1.1, OUTER + 1.1, pageW - 2 * (OUTER + 1.1), pageH - 2 * (OUTER + 1.1));
    }

    function drawHeader() {
      doc.setFillColor(...NAVY);
      doc.rect(MARGIN, y, pageW - 2 * MARGIN, headerH, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(255, 255, 255);
      let x = MARGIN + 1;
      cols.forEach(c => {
        doc.text(c.label, x, y + 4.2);
        x += c.w;
      });
      y += headerH;
    }

    const exportRows = filtered.slice().sort((a, b) => parseInt(a.wo, 10) - parseInt(b.wo, 10));
    drawHeader();

    exportRows.forEach((rec, i) => {
      if (y + rowH > usableBottom) {
        doc.addPage();
        drawFrame();
        y = OUTER + 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...NAVY);
        doc.text('WORK ORDER REGISTER (cont.) — CONTROLLED DOCUMENT', pageW / 2, y, { align: 'center' });
        y += 5;
        drawHeader();
      }
      if (i % 2 === 0) {
        doc.setFillColor(...SOFT);
        doc.rect(MARGIN, y, pageW - 2 * MARGIN, rowH, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.2);
      let x = MARGIN + 1;
      cols.forEach(c => {
        let val = String(rec[c.key] || '');
        const maxC = Math.max(3, Math.floor(c.w / 1.7));
        if (val.length > maxC) val = val.slice(0, maxC - 1) + '…';
        if (c.key === 'status') {
          if (val === 'Completed') doc.setTextColor(...GREEN);
          else if (val === 'Ongoing') doc.setTextColor(...ORANGE);
          else doc.setTextColor(...GREY);
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setTextColor(30, 41, 59);
          doc.setFont('helvetica', 'normal');
        }
        doc.text(val, x, y + 3.9);
        x += c.w;
      });
      y += rowH;
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(...GREY);
    doc.text('Forecourt Works Ltd  •  Work Order Register  •  CONTROLLED DOCUMENT  •  Landscape A4', pageW / 2, pageH - OUTER - 2.5, { align: 'center' });

    const fname = 'WO-Register_' + new Date().toISOString().slice(0, 10) + '.pdf';
    doc.save(fname);
    toast('PDF exported: ' + fname);
  }

  function loadImageAsDataUrl(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d').drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch (_) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2400);
  }

  // ---------- Events ----------
  document.getElementById('btn-add').addEventListener('click', addRow);
  document.getElementById('btn-query').addEventListener('click', () => {
    showAll = true;
    applyFilters();
    toast('Query applied');
  });
  document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('q-client').value = '';
    document.getElementById('q-wo').value = '';
    document.getElementById('q-from').value = '';
    document.getElementById('q-to').value = '';
    document.getElementById('q-status').value = '';
    showAll = false;
    applyFilters();
    toast('Reset to last 5');
  });
  document.getElementById('btn-export').addEventListener('click', () => {
    if (filtered.length === 0) { toast('Nothing to export'); return; }
    exportPdf();
  });
  document.getElementById('btn-save').addEventListener('click', () => save(false));
  document.getElementById('btn-audit').addEventListener('click', showAudit);

  ['q-client', 'q-wo', 'q-from', 'q-to', 'q-status'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        showAll = true;
        applyFilters();
      }
    });
  });

  document.getElementById('modal-cancel').addEventListener('click', () => {
    document.getElementById('confirm-modal').classList.remove('open');
    deleteTarget = null;
  });
  document.getElementById('modal-ok').addEventListener('click', confirmDelete);

  document.getElementById('auth-cancel').addEventListener('click', () => closeAuth(false));
  document.getElementById('auth-ok').addEventListener('click', onAuthOk);
  document.getElementById('auth-pass').addEventListener('keydown', e => {
    if (e.key === 'Enter') onAuthOk();
  });
  document.getElementById('auth-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('auth-pass').focus();
  });
  document.getElementById('audit-close').addEventListener('click', () => {
    document.getElementById('audit-modal').classList.remove('open');
  });

  // ---------- Init ----------
  load();
  loadAudit();
  applyFilters();
})();
