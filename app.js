  (function () {
    'use strict';

    const STORAGE_KEY = 'fsw_wo_register_v1';
    const STATUS_OPTS = ['Completed', 'Ongoing', 'Pending', 'Started', 'Stopped', 'Cancelled'];
    const TYPE_OPTS = ['Labour Only', 'Parts + Labour', 'Parts Only', ''];

    // Seed data (historical 0001–0068)
    const SEED = [{"wo":"0001","type":"Labour Only","entry":"","start":"","end":"","status":"Completed","client":"MULTI DEAL","location":"KOMBANI","title":"TYRE INFLATOR INSTALLATION","zoho":"00128","etims":"","inv":"4,000.00","paid":"4,000.00","bal":"0.00"},{"wo":"0002","type":"Labour Only","entry":"24.12.25","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BUNYALA RD","title":"AST PIPING","zoho":"00129","etims":"","inv":"30,000.00","paid":"30,000.00","bal":"0.00"},{"wo":"0003","type":"Parts + Labour","entry":"07.01.26","start":"","end":"","status":"Completed","client":"AINUSHAMSI","location":"KALOLENI","title":"FDU#4 (WAYNE 3G) KEYPADS","zoho":"00137","etims":"","inv":"14,700.00","paid":"14,700.00","bal":"0.00"},{"wo":"0004","type":"Parts + Labour","entry":"","start":"","end":"","status":"Completed","client":"NOMAD","location":"KISERIAN","title":"PM Inspections & CA","zoho":"00132","etims":"","inv":"38,500.00","paid":"38,500.00","bal":"0.00"},{"wo":"0005","type":"Parts + Labour","entry":"07.01.26","start":"","end":"","status":"Completed","client":"AINU","location":"PUMWANI","title":"FDU#003 REPAIR","zoho":"00136","etims":"","inv":"8,800.00","paid":"8,800.00","bal":"0.00"},{"wo":"0006","type":"Parts + Labour","entry":"07.01.26","start":"","end":"","status":"Completed","client":"AINU","location":"KALOLENI","title":"FDU#01, GILBERCO VEEDER ROOT","zoho":"00138","etims":"","inv":"6,500.00","paid":"6,500.00","bal":"0.00"},{"wo":"0007","type":"Parts + Labour","entry":"29.11.2025","start":"","end":"","status":"Completed","client":"SALAMA ROADS","location":"MALINDI","title":"FDU#2 REPAIR (TOKHEIM)","zoho":"00121","etims":"","inv":"62,870.00","paid":"2,000.00","bal":"60,870.00"},{"wo":"0008","type":"Parts + Labour","entry":"31.07.2025","start":"","end":"","status":"Completed","client":"SALAMA ROADS","location":"SABAKI","title":"COMPRESSED AIR PIPING - Rework","zoho":"00106","etims":"","inv":"48,000.00","paid":"48,000.00","bal":"0.00"},{"wo":"0009","type":"Parts + Labour","entry":"20.12.2025","start":"","end":"","status":"Completed","client":"MOSHA","location":"MARIAKANI","title":"PM Inspections & CA","zoho":"00127","etims":"","inv":"64,930.00","paid":"64,930.00","bal":"0.00"},{"wo":"0010","type":"Labour Only","entry":"02.12.2025","start":"","end":"","status":"Completed","client":"HAKUUZ","location":"TONONOKA","title":"GARAGE EQUIPMENT SERVICING","zoho":"00124","etims":"","inv":"18,000.00","paid":"0.00","bal":"18,000.00"},{"wo":"0011","type":"Labour Only","entry":"10.10.2025","start":"","end":"","status":"Completed","client":"HAKUUZ","location":"TONONOKA","title":"WHEEL ALIGNMENT MACHINE INSTALLATION","zoho":"0018","etims":"","inv":"10,000.00","paid":"0.00","bal":"10,000.00"},{"wo":"0012","type":"Parts + Labour","entry":"07.01.2026","start":"","end":"","status":"Completed","client":"AINUSHAMSI","location":"KALOLENI","title":"GENSET ROOM & M.HOLE REPAIRS","zoho":"00139","etims":"","inv":"28,745.00","paid":"28,745.00","bal":"0.00"},{"wo":"0013","type":"Labour Only","entry":"","start":"","end":"","status":"Completed","client":"TARABI","location":"NAMANGA","title":"AIR COMPRESSOR REPAIR","zoho":"00140","etims":"","inv":"5,000.00","paid":"5,000.00","bal":"0.00"},{"wo":"0014","type":"Labour Only","entry":"","start":"","end":"","status":"Completed","client":"NOMAD","location":"NGONG","title":"FDU CALIBRATION","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0015","type":"Parts + Labour","entry":"17.01.2026","start":"","end":"","status":"Completed","client":"AINUSHAMSI","location":"PUMWANI","title":"FDU PM Inspections & Servicing","zoho":"00142","etims":"","inv":"64,240.00","paid":"64,240.00","bal":"0.00"},{"wo":"0016","type":"Labour Only","entry":"19.01.2026","start":"","end":"","status":"Completed","client":"MOSHA","location":"MARIAKANI","title":"AIR LINE RELOCATION","zoho":"","etims":"","inv":"5,000.00","paid":"5,000.00","bal":"0.00"},{"wo":"0017","type":"Labour Only","entry":"20.01.2026","start":"","end":"","status":"Completed","client":"MULTI DEAL","location":"KOMBANI","title":"AIR COMPRESSOR RELOCATION","zoho":"00144","etims":"","inv":"3,000.00","paid":"3,000.00","bal":"0.00"},{"wo":"0018","type":"","entry":"21.01.2026","start":"","end":"","status":"Completed","client":"AINUSHAMSI","location":"MARIAKANI","title":"FDU REPAIR","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0019","type":"Labour Only","entry":"31.07.2025","start":"","end":"","status":"Completed","client":"HAKUUZ","location":"MOMBASA","title":"REWORK - AIR COMPRESSOR REPAIR","zoho":"00146","etims":"","inv":"27,500.00","paid":"27,500.00","bal":"0.00"},{"wo":"0020","type":"Parts + Labour","entry":"28.01.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BUNYALA","title":"FDU PM","zoho":"00149","etims":"","inv":"50,399.00","paid":"50,000.00","bal":"399.00"},{"wo":"0021","type":"Parts + Labour","entry":"28.01.2026","start":"","end":"","status":"Ongoing","client":"TAHMEED","location":"BONJE","title":"REMEDIATION OF UST'S","zoho":"00153","etims":"","inv":"350,000.00","paid":"250,000.00","bal":"100,000.00"},{"wo":"0022","type":"Parts Only","entry":"03.02.2026","start":"","end":"","status":"Completed","client":"KENNYLAX","location":"LONGISA","title":"FDU's HOSE PURCHASE & DELIVERY","zoho":"00147","etims":"","inv":"7,500.00","paid":"7,500.00","bal":"0.00"},{"wo":"0023","type":"Parts + Labour","entry":"05.02.2026","start":"","end":"","status":"Completed","client":"MASS","location":"UTANGE","title":"FDU MAINTENANCE","zoho":"00148","etims":"","inv":"48,500.00","paid":"48,500.00","bal":"0.00"},{"wo":"0024","type":"Parts + Labour","entry":"05.02.2026","start":"","end":"","status":"Pending","client":"RADIUS CIRCLE","location":"KILIFI","title":"5T JACK SEALS REPLACEMENT","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0025","type":"Labour Only","entry":"05.02.2026","start":"","end":"","status":"Completed","client":"RANWAY","location":"KIKAMBALA","title":"COMPRESSED AIR RETICULATION","zoho":"00151","etims":"","inv":"24,100.00","paid":"22,000.00","bal":"2,100.00"},{"wo":"0026","type":"Labour Only","entry":"05.02.2026","start":"","end":"","status":"Pending","client":"MANCO","location":"MIKINDANI","title":"UST FABRICATION","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0027","type":"Labour Only","entry":"18.02.2026","start":"","end":"","status":"Pending","client":"TRIKAKA","location":"UKUNDA","title":"GENSET SERVICE","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0028","type":"Labour Only","entry":"","start":"","end":"","status":"Pending","client":"STARWAYS","location":"PORT REITZ","title":"FUEL SYSTEM PIPING","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0029","type":"Labour Only","entry":"07.03.2026","start":"","end":"","status":"Completed","client":"MOSHA","location":"MARIAKANI","title":"AIRGUAGE REPAIR","zoho":"00152","etims":"","inv":"2,000.00","paid":"2,000.00","bal":"0.00"},{"wo":"0030","type":"Parts Only","entry":"","start":"","end":"","status":"Pending","client":"MOSHA","location":"MARIAKANI","title":"MANHOLE COVER GASKET","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0031","type":"","entry":"13.03.2026","start":"","end":"","status":"Completed","client":"NEWLIFE","location":"MAVUENI","title":"SUPPLY AND INSTALLATION","zoho":"00154","etims":"","inv":"8,950.00","paid":"8,950.00","bal":"0.00"},{"wo":"0032","type":"Parts Only","entry":"16.03.2026","start":"","end":"","status":"Completed","client":"NEWLIFE","location":"MAVUENI","title":"SAFETY DECALS SUPPLY","zoho":"00155","etims":"","inv":"9,600.00","paid":"9,600.00","bal":"0.00"},{"wo":"0033","type":"Parts + Labour","entry":"02.12.2025","start":"","end":"","status":"Completed","client":"NYALI LINKS RD","location":"MAVUENI","title":"SUPPLY OF STICK ON WEIGHTS","zoho":"00123","etims":"","inv":"28,700.00","paid":"28,700.00","bal":""},{"wo":"0034","type":"Labour Only","entry":"20.03.2026","start":"","end":"","status":"Pending","client":"NEWLIFE","location":"MAVUENI","title":"GENSET PM SERVICE","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0035","type":"Parts + Labour","entry":"25.03.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BUNYALA","title":"FDU FLOW RATE RECTIFICATION","zoho":"00156","etims":"","inv":"11,000.00","paid":"11,000.00","bal":"0.00"},{"wo":"0036","type":"Labour Only","entry":"","start":"","end":"","status":"Completed","client":"MULTIDEAL","location":"KOMBANI","title":"AIR COMPRESSOR MAINTENANCE","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0037","type":"Labour Only","entry":"06.04.2026","start":"","end":"","status":"Pending","client":"EAGOL","location":"VIPINGO","title":"GARAGE EQ'PMENT INSTALLATION","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0038","type":"Labour Only","entry":"07.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BONJE","title":"AST#004 LADDER FABRICATION","zoho":"00161","etims":"","inv":"15,000.00","paid":"15,000.00","bal":"0.00"},{"wo":"0039","type":"Labour Only","entry":"08.04.2026","start":"","end":"","status":"Completed","client":"NOMAD","location":"KISERIAN","title":"FDU TROUBLESHOOTING & REPAIR","zoho":"00157","etims":"","inv":"6,000.00","paid":"6,000.00","bal":"0.00"},{"wo":"0040","type":"Parts + Labour","entry":"10.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BUNYALA","title":"REWORK - CHANGE OF CLOGGED FILTER","zoho":"00158","etims":"","inv":"0.00","paid":"0.00","bal":"0.00"},{"wo":"0041","type":"Parts + Labour","entry":"11.04.2026","start":"","end":"","status":"Pending","client":"TAHMEED","location":"BUNYALA","title":"TANK#002 CLEANING","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0042","type":"Parts + Labour","entry":"11.04.2026","start":"","end":"","status":"Pending","client":"TAHMEED","location":"BUNYALA","title":"AGO TRANSFER PUMP SERVICING","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0043","type":"Parts + Labour","entry":"11.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BONJE","title":"CALIBRATION OF TANK#004","zoho":"00159","etims":"","inv":"78,000.00","paid":"78,000.00","bal":"0.00"},{"wo":"0044","type":"Parts + Labour","entry":"11.04.2026","start":"","end":"","status":"Pending","client":"TAHMEED","location":"BONJE","title":"FDU, AST, BLACKMER & STP PM","zoho":"","etims":"","inv":"0.00","paid":"","bal":""},{"wo":"0045","type":"Parts Only","entry":"18.04.2026","start":"","end":"","status":"Completed","client":"KENNYLAX","location":"LONGISA","title":"SUPPLY OF 2PCS ¾\" FDU HOSE","zoho":"00160","etims":"","inv":"11,000.00","paid":"10,000.00","bal":"1,000.00"},{"wo":"0046","type":"Parts + Labour","entry":"28.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BONJE","title":"AST#004 PIPING","zoho":"00163","etims":"","inv":"60,000.00","paid":"60,000.00","bal":"0.00"},{"wo":"0047","type":"Labour Only","entry":"28.04.2026","start":"","end":"","status":"Completed","client":"TAHMEED","location":"BONJE","title":"STP MECH/ELECT INSTALLATION TK#004","zoho":"00164","etims":"","inv":"15,000.00","paid":"15,000.00","bal":"0.00"},{"wo":"0048","type":"Labour Only","entry":"04.05.2026","start":"09.07.2026","end":"09.07.2026","status":"Completed","client":"NOMAD","location":"KISERIAN","title":"WHEEL ALIGNMENT MACHINE REPAIR","zoho":"00166","etims":"KRASRN000258075/12","inv":"42,400.00","paid":"42,400.00","bal":""},{"wo":"0049","type":"Parts + Labour","entry":"04.05.2026","start":"09.07.2026","end":"","status":"Ongoing","client":"NOMAD","location":"KISERIAN","title":"4 POST LIFT MAINTENANCE","zoho":"00168","etims":"KRASRN000258075/11","inv":"14,500.00","paid":"14,500.00","bal":""},{"wo":"0050","type":"Parts Only","entry":"21.05.2026","start":"","end":"","status":"Completed","client":"KENNYLAX","location":"LONGISA","title":"SUPPLY 3No. FDU V-Belt","zoho":"00162","etims":"","inv":"4,500.00","paid":"4,000.00","bal":"500.00"},{"wo":"0051","type":"Parts + Labour","entry":"02.06.2026","start":"","end":"","status":"Completed","client":"NOMAD","location":"KISERIAN","title":"WHIP HOSE REPLACEMENT","zoho":"00165","etims":"","inv":"11,000.00","paid":"6,960.00","bal":"4,040.00"},{"wo":"0052","type":"Parts + Labour","entry":"07.06.2026","start":"07.06.2026","end":"07.06.2026","status":"Ongoing","client":"MOSHA","location":"MARIAKANI","title":"REPAIR AIRGAUGE'S UNRESPONSIVE (+) BUTTON","zoho":"00166","etims":"","inv":"900.00","paid":"900.00","bal":"0.00"},{"wo":"0053","type":"Parts + Labour","entry":"09.07.2026","start":"09.07.2026","end":"","status":"Ongoing","client":"NEWLIFE","location":"MAVUENI 1","title":"FDU LEAK REPAIR","zoho":"00167","etims":"","inv":"13,000.00","paid":"","bal":"13,000.00"},{"wo":"0054","type":"Parts Only","entry":"09.07.2026","start":"09.07.2026","end":"","status":"Completed","client":"SALAMA ROADS","location":"MALINDI","title":"SALE OF TWIN TYRE CONNECTOR","zoho":"00169","etims":"","inv":"3,500.00","paid":"3,500.00","bal":"0.00"},{"wo":"0055","type":"Labour Only","entry":"10.07.2026","start":"","end":"","status":"Pending","client":"NEWLIFE","location":"MAVUENI","title":"WHEEL ALIGNER DIAGNOSIS & REPAIR","zoho":"","etims":"","inv":"10,000.00","paid":"5,000.00","bal":"5,000.00"},{"wo":"0056","type":"","entry":"13.07.2026","start":"","end":"","status":"","client":"EAGOL-VIPINGO","location":"VIPINGO","title":"UST LID MODIFICATION & STP INSTALLATION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0057","type":"","entry":"13.07.2026","start":"","end":"","status":"","client":"PETROSOMA","location":"SALGAA","title":"AIR COMPRESSOR SERVICE","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0058","type":"Labour Only","entry":"27.07.2026","start":"27.07.2026","end":"28.07.2026","status":"Completed","client":"MULTI DEAL","location":"KOMBANI","title":"TYRE INFLATOR HOSE REPLACEMENT","zoho":"00177","etims":"","inv":"7,500.00","paid":"7,500.00","bal":"0.00"},{"wo":"0059","type":"Parts + Labour","entry":"01.08.2026","start":"","end":"","status":"","client":"MASS","location":"VOI","title":"FUEL SYSTEM PIPING","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0060","type":"Parts Only","entry":"13.08.2026","start":"13.08.2026","end":"13.08.2026","status":"Completed","client":"MASS","location":"MAKUPA","title":"SUPPLY OF ¾\" FDU HOSE - 1PC","zoho":"00178","etims":"","inv":"4,500.00","paid":"4,500.00","bal":"0.00"},{"wo":"0061","type":"","entry":"17.08.2026","start":"17.08.2026","end":"17.08.2026","status":"Completed","client":"PMC","location":"NAIROBI","title":"SALES COMMISSION","zoho":"N/A","etims":"","inv":"30,000.00","paid":"30,000.00","bal":"0.00"},{"wo":"0062","type":"Labour Only","entry":"17.08.2026","start":"21.08.2026","end":"","status":"","client":"MULTI DEAL","location":"KOMBANI","title":"FRP MANHOLE COVER INSTALLATION","zoho":"","etims":"","inv":"35,000.00","paid":"","bal":"35,000.00"},{"wo":"0063","type":"Labour Only","entry":"23.08.2026","start":"","end":"","status":"Completed","client":"MASS","location":"UTANGE","title":"REPAIR OF LLJ08 FLOWMETER","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0064","type":"Labour Only","entry":"05.09.2026","start":"05.09.2026","end":"","status":"Completed","client":"AINUSHAMSI","location":"PUMWANI","title":"CONDITION INSPECTION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0065","type":"Labour Only","entry":"","start":"","end":"","status":"Ongoing","client":"MOSHA","location":"MARIAKANI","title":"CARWASH REPAIR","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0066","type":"Parts + Labour","entry":"","start":"","end":"","status":"Completed","client":"NEW LIFE","location":"MAVUENI","title":"STP INSTALLATION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0067","type":"","entry":"","start":"","end":"","status":"","client":"AINUSHAMSI","location":"PUMWANI","title":"CONDITION INSPECTION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"},{"wo":"0068","type":"","entry":"","start":"","end":"","status":"","client":"PETROSOMA","location":"SALGAA","title":"MOTOR PROTECTION","zoho":"","etims":"","inv":"","paid":"","bal":"0.00"}];

    let records = [];
    let filtered = [];
    let showAll = false; // false = last 5 only
    let deleteTarget = null;

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
      // ensure sorted by WO ascending
      records.sort((a, b) => parseInt(a.wo, 10) - parseInt(b.wo, 10));
    }

    function save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        toast('Saved');
      } catch (e) {
        toast('Save failed – storage full?');
      }
    }

    // Auto-save after edits (debounced)
    let saveTimer = null;
    function scheduleSave() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(save, 500);
    }

    // ---------- Next WO number ----------
    function nextWoNumber() {
      let max = 0;
      records.forEach(r => {
        const n = parseInt(r.wo, 10);
        if (!isNaN(n) && n > max) max = n;
      });
      return String(max + 1).padStart(4, '0');
    }

    // ---------- Balance helper ----------
    function calcBal(inv, paid) {
      const i = parseFloat(String(inv || '0').replace(/,/g, '')) || 0;
      const p = parseFloat(String(paid || '0').replace(/,/g, '')) || 0;
      const b = i - p;
      return b.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // ---------- Filtering ----------
    function parseDateLoose(s) {
      if (!s) return null;
      // accept DD.MM.YYYY or DD.MM.YY or YYYY-MM-DD
      const m = String(s).trim().match(/(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{2,4})/);
      if (!m) return null;
      let d = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, y = parseInt(m[3], 10);
      if (y < 100) y += 2000;
      return new Date(y, mo, d);
    }

    function applyFilters() {
      const clientQ = (document.getElementById('q-client').value || '').trim().toLowerCase();
      const woQ = (document.getElementById('q-wo').value || '').trim();
      const fromQ = parseDateLoose(document.getElementById('q-from').value);
      const toQ = parseDateLoose(document.getElementById('q-to').value);
      const statusQ = document.getElementById('q-status').value;

      let list = records.slice();

      if (clientQ) {
        list = list.filter(r => (r.client || '').toLowerCase().includes(clientQ));
      }
      if (woQ) {
        list = list.filter(r => (r.wo || '').includes(woQ.replace(/^0+/, '')) || (r.wo || '') === woQ.padStart(4, '0'));
      }
      if (statusQ) {
        list = list.filter(r => r.status === statusQ);
      }
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
      if (!hasFilter && !showAll) {
        // default: last 5
        filtered = list.slice(-5);
      } else {
        filtered = list;
      }

      renderTable();
      const total = records.length;
      const shown = filtered.length;
      const info = document.getElementById('view-info');
      if (!hasFilter && !showAll) {
        info.textContent = `Showing last ${shown} of ${total}`;
      } else {
        info.textContent = `Showing ${shown} of ${total}`;
      }
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

      // show newest first for readability when filtered/all, but keep chronological for last-5
      const rows = filtered.slice().reverse();

      rows.forEach((rec, idx) => {
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
            <button class="icon-btn delete" data-action="delete" title="Delete this row">✕</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // bind change handlers
      tbody.querySelectorAll('.cell-input, .cell-select').forEach(el => {
        el.addEventListener('change', onCellChange);
        el.addEventListener('input', onCellInput);
      });
      tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', onDeleteClick);
      });
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

    function onCellChange(e) {
      const el = e.target;
      const tr = el.closest('tr');
      const wo = tr.dataset.wo;
      const field = el.dataset.field;
      const rec = findRecord(wo);
      if (!rec) return;

      if (field === 'wo') return; // readonly

      rec[field] = el.value;

      if (field === 'status') {
        el.className = 'cell-select status status-' + (el.value || '').replace(/\s/g, '');
      }

      // auto balance
      if (field === 'inv' || field === 'paid') {
        rec.bal = calcBal(rec.inv, rec.paid);
        const balInput = tr.querySelector('[data-field="bal"]');
        if (balInput) balInput.value = rec.bal;
      }

      scheduleSave();
    }

    function onCellInput(e) {
      // live bal update while typing amounts
      const el = e.target;
      if (el.dataset.field !== 'inv' && el.dataset.field !== 'paid') return;
      const tr = el.closest('tr');
      const inv = tr.querySelector('[data-field="inv"]').value;
      const paid = tr.querySelector('[data-field="paid"]').value;
      const balInput = tr.querySelector('[data-field="bal"]');
      if (balInput) balInput.value = calcBal(inv, paid);
    }

    function onDeleteClick(e) {
      const tr = e.target.closest('tr');
      deleteTarget = tr.dataset.wo;
      document.getElementById('modal-title').textContent = 'Delete Work Order?';
      document.getElementById('modal-msg').textContent = `Remove WO ${deleteTarget} permanently from the register? This cannot be undone.`;
      document.getElementById('confirm-modal').classList.add('open');
    }

    // ---------- ADD ----------
    function addRow() {
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
      showAll = true; // show the new row
      // clear filters so user sees the new one
      document.getElementById('q-client').value = '';
      document.getElementById('q-wo').value = newWo;
      document.getElementById('q-from').value = '';
      document.getElementById('q-to').value = '';
      document.getElementById('q-status').value = '';
      applyFilters();
      save();
      toast('Added WO ' + newWo);
      // focus client field of the new row
      setTimeout(() => {
        const tr = document.querySelector(`tr[data-wo="${newWo}"]`);
        if (tr) {
          const clientInput = tr.querySelector('[data-field="client"]');
          if (clientInput) clientInput.focus();
        }
      }, 50);
    }

    // ---------- PDF Export ----------
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

      // frame
      doc.setDrawColor(...NAVY);
      doc.setLineWidth(0.55);
      doc.rect(OUTER, OUTER, pageW - 2 * OUTER, pageH - 2 * OUTER);
      doc.setLineWidth(0.22);
      doc.rect(OUTER + 1.1, OUTER + 1.1, pageW - 2 * (OUTER + 1.1), pageH - 2 * (OUTER + 1.1));

      // header text
      let y = OUTER + 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text('FORECOURT WORKS LIMITED', MARGIN, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...GREY);
      doc.text('Engineering Reliability Into Every Forecourt', MARGIN, y + 3.2);
      doc.text('Ramco Court, GT 3B, South C, Nairobi  |  +254 729-002-087  |  sales@forecourtworks.co.ke', MARGIN, y + 6);

      // logo
      try {
        const logoImg = await loadImageAsDataUrl('forecourt-logo-mark.png');
        if (logoImg) {
          doc.addImage(logoImg, 'PNG', pageW - MARGIN - 38, OUTER + 3, 36, 6.5);
        }
      } catch (_) {}

      // separator
      y = OUTER + 14;
      doc.setDrawColor(13, 71, 140);
      doc.setLineWidth(0.35);
      doc.line(MARGIN, y, pageW - MARGIN, y);

      // title
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...NAVY);
      doc.text('WORK ORDER REGISTER', pageW / 2, y, { align: 'center' });
      y += 3.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...GREY);
      const subtitle = `Exported ${new Date().toLocaleDateString('en-GB')}  •  ${filtered.length} record(s)`;
      doc.text(subtitle, pageW / 2, y, { align: 'center' });

      // columns
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

      function drawFrame() {
        doc.setDrawColor(...NAVY);
        doc.setLineWidth(0.55);
        doc.rect(OUTER, OUTER, pageW - 2 * OUTER, pageH - 2 * OUTER);
        doc.setLineWidth(0.22);
        doc.rect(OUTER + 1.1, OUTER + 1.1, pageW - 2 * (OUTER + 1.1), pageH - 2 * (OUTER + 1.1));
      }

      // data in chronological order for PDF
      const exportRows = filtered.slice().sort((a, b) => parseInt(a.wo, 10) - parseInt(b.wo, 10));
      let rowIdx = 0;

      drawHeader();

      exportRows.forEach((rec, i) => {
        if (y + rowH > usableBottom) {
          // page break
          doc.addPage();
          drawFrame();
          y = OUTER + 6;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...NAVY);
          doc.text('WORK ORDER REGISTER (cont.)', pageW / 2, y, { align: 'center' });
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
          // truncate
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
        rowIdx++;
      });

      // table border
      // (simple outer already drawn)

      // footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(...GREY);
      doc.text('Forecourt Works Ltd  •  Work Order Register  •  Landscape A4', pageW / 2, pageH - OUTER - 2.5, { align: 'center' });

      const fname = `WO-Register_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fname);
      toast('PDF exported: ' + fname);
    }

    function loadImageAsDataUrl(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } catch (_) { resolve(null); }
        };
        img.onerror = () => resolve(null);
        img.src = src;
      });
    }

    // ---------- Toast ----------
    function toast(msg) {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 2200);
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
      if (filtered.length === 0) {
        toast('Nothing to export');
        return;
      }
      exportPdf();
    });
    document.getElementById('btn-save').addEventListener('click', save);

    // Enter on query fields triggers query
    ['q-client', 'q-wo', 'q-from', 'q-to', 'q-status'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          showAll = true;
          applyFilters();
        }
      });
    });

    // Modal
    document.getElementById('modal-cancel').addEventListener('click', () => {
      document.getElementById('confirm-modal').classList.remove('open');
      deleteTarget = null;
    });
    document.getElementById('modal-ok').addEventListener('click', () => {
      if (deleteTarget) {
        records = records.filter(r => r.wo !== deleteTarget);
        document.getElementById('confirm-modal').classList.remove('open');
        toast('Deleted WO ' + deleteTarget);
        deleteTarget = null;
        applyFilters();
        save();
      }
    });

    // ---------- Init ----------
    load();
    applyFilters();
  })();
