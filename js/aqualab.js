// ===================================================================
// UTILITIES CORE
// ===================================================================
function switchView(viewId, el) {
  document.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  el.classList.add('active');
  if(viewId === 'v-inv') loadInventory(); if(viewId === 'v-needs') loadNeeds(); if(viewId === 'v-logbook') loadLogbook();
}
function openSub(btn, id, grp) {
  const pane = btn.closest('.tab-pane');
  pane.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  pane.querySelectorAll('.'+grp).forEach(p => p.classList.remove('active'));
  btn.classList.add('active'); document.getElementById(id).classList.add('active');
}
function toggleTheme() { 
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur); 
    localStorage.setItem('ares_theme', cur);
    updateChartInvivo(); updateChartHealth(); updateChartGonad(); updateChartHatchery(); updateChartWQ(); 
}
function toggleChart(containerId, btnId, updateFn) {
    const container = document.getElementById(containerId);
    const btn = document.getElementById(btnId);
    if(container.style.display === 'none') {
        container.style.display = 'grid'; btn.innerHTML = '<span class="dsw-icon-styled">📉</span> Sembunyikan Grafik'; updateFn();
    } else {
        container.style.display = 'none'; btn.innerHTML = '<span class="dsw-icon-styled">📈</span> Tampilkan Grafik';
    }
}
function openDialog(id) { document.getElementById(id).classList.add('active'); }
function closeDialog(id) { document.getElementById(id).classList.remove('active'); }
function showHelp() { openDialog('dlgHelp'); }
function formatSci(n) { if(n===0||isNaN(n)) return '0'; const e = Math.floor(Math.log10(n)), m = n/Math.pow(10,e); return `${m.toFixed(2)} × 10<sup>${e}</sup>`; }

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `<span style="color:var(--success); font-size:16px;">✓</span> ${msg}`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 300); }, 2000);
}
function makeDel(fn) {
  const b = document.createElement('button');
  b.className = 'btn-icon';
  b.setAttribute('type', 'button');
  b.setAttribute('title', 'Hapus baris');
  b.innerHTML = '×';
  b.onclick = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof fn === 'function') {
      fn.call(this, e);
    } else {
      const tr = this.closest('tr');
      if (tr) tr.remove();
    }
  };
  return b;
}

// ===================================================================
// CHARTS RENDERER HELPER
// ===================================================================
function renderChart(dict, id, type, label, labels, data, color) {
    if(dict[id]) dict[id].destroy();
    const el = document.getElementById(id);
    if (!el) return;
    const ctx = el.getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const txtColor = isDark ? '#E2E8F0' : '#1E293B';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
    dict[id] = new Chart(ctx, {
        type: type,
        data: { labels: labels, datasets: [{ label: label, data: data, backgroundColor: color, borderColor: color, tension: 0.3 }] },
        options: { 
            responsive: true, maintainAspectRatio: false, 
            plugins: { legend: { display: true, labels: { color: txtColor, font: { family: "'DM Sans', sans-serif", weight: '600' } } } }, 
            scales: { 
                x: { ticks: { color: txtColor, font: { size: 10, family: "'DM Sans', sans-serif" } }, grid: { display: false } }, 
                y: { ticks: { color: txtColor, font: { size: 10, family: "'DM Sans', sans-serif" } }, grid: { color: gridColor } } 
            } 
        }
    });
}

// ===================================================================
// IN VIVO PERFORMANCE
// ===================================================================
let inVivoCharts = {};
function updateChartInvivo() {
    if(document.getElementById('chartContainerInvivo').style.display === 'none') return;
    const labels = [], dataSr = [], dataAdg = [], dataSgr = [], dataFcr = [], dataEp = [];
    document.querySelectorAll('#invivoBody tr').forEach(r => {
        labels.push(r.querySelector('.v-trt').value || 'Wadah');
        dataSr.push(parseFloat(r.querySelector('.res-sr').textContent) || 0);
        dataAdg.push(parseFloat(r.querySelector('.res-adg').textContent) || 0);
        dataSgr.push(parseFloat(r.querySelector('.res-sgr').textContent) || 0);
        dataFcr.push(parseFloat(r.querySelector('.res-fcr').textContent) || 0);
        dataEp.push(parseFloat(r.querySelector('.res-ep').textContent) || 0);
    });

    renderChart(inVivoCharts, 'chartSR', 'bar', 'SR (%)', labels, dataSr, '#34d399');
    renderChart(inVivoCharts, 'chartADG', 'bar', 'ADG (g/hr)', labels, dataAdg, '#f472b6');
    renderChart(inVivoCharts, 'chartSGR', 'bar', 'SGR (%/hr)', labels, dataSgr, '#60a5fa');
    renderChart(inVivoCharts, 'chartFCR', 'bar', 'FCR', labels, dataFcr, '#fbbf24');
    renderChart(inVivoCharts, 'chartEP', 'bar', 'Efisiensi Pakan (%)', labels, dataEp, '#a855f7');
}

function addInvivoRow() {
  const tb = document.getElementById('invivoBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
  tr.innerHTML = `<td><input class="cell-input text-left v-trt" value="${isFirst?'P1 (Kontrol)':''}" oninput="updateChartInvivo()"></td><td><input class="cell-input v-wad" value="${isFirst?'U-1':''}"></td><td><input type="number" class="cell-input v-w0" value="${isFirst?'15.5':''}" oninput="calcInvivo(this)"></td><td><input type="number" class="cell-input v-wt" value="${isFirst?'45.2':''}" oninput="calcInvivo(this)"></td><td><input type="number" class="cell-input v-n0" value="${isFirst?'100':''}" oninput="calcInvivo(this)"></td><td><input type="number" class="cell-input v-nt" value="${isFirst?'95':''}" oninput="calcInvivo(this)"></td><td><input type="number" class="cell-input v-f" value="${isFirst?'3500':''}" oninput="calcInvivo(this)"></td><td><input type="number" class="cell-input v-t" value="${isFirst?'30':''}" oninput="calcInvivo(this)"></td><td class="res-sr val-dim">—</td><td class="res-adg val-dim">—</td><td class="res-sgr val-dim">—</td><td class="res-fcr val-dim">—</td><td class="res-ep val-dim">—</td><td></td>`;
  tr.cells[tr.cells.length-1].appendChild(makeDel(function() { (this.closest('tr') || tr).remove(); updateChartInvivo(); })); if(isFirst) calcInvivo(tr.querySelector('.v-w0'));
}
function calcInvivo(i) {
  const r = i.closest('tr'), w0 = parseFloat(r.querySelector('.v-w0').value)||0, wt = parseFloat(r.querySelector('.v-wt').value)||0, n0 = parseFloat(r.querySelector('.v-n0').value)||0, nt = parseFloat(r.querySelector('.v-nt').value)||0, f  = parseFloat(r.querySelector('.v-f').value)||0, t  = parseFloat(r.querySelector('.v-t').value)||0;
  const srEl=r.querySelector('.res-sr'), adgEl=r.querySelector('.res-adg'), sgrEl=r.querySelector('.res-sgr'), fcrEl=r.querySelector('.res-fcr'), epEl=r.querySelector('.res-ep');
  if(n0>0 && r.querySelector('.v-nt').value!=='') { const sr=(nt/n0)*100; srEl.className='res-sr val-num'; srEl.textContent=sr.toFixed(1)+'%'; if(sr>=80) srEl.style.color='var(--success)'; else if(sr>=60) srEl.style.color='var(--warning)'; else srEl.style.color='var(--danger)'; } else srEl.textContent='—';
  if(t>0 && wt>0 && w0>0) { adgEl.className='res-adg val-num'; adgEl.textContent=((wt-w0)/t).toFixed(3); if(wt>w0) { sgrEl.className='res-sgr val-num'; sgrEl.textContent=(((Math.log(wt)-Math.log(w0))/t)*100).toFixed(3); } } else { adgEl.textContent='—'; sgrEl.textContent='—'; }
  const dB = (wt*nt)-(w0*n0); 
  if(dB>0 && f>0) { 
      fcrEl.className='res-fcr val-num'; fcrEl.textContent=(f/dB).toFixed(2); 
      epEl.className='res-ep val-num'; epEl.textContent=((dB/f)*100).toFixed(2);
  } else { fcrEl.textContent='—'; epEl.textContent='—'; }
  updateChartInvivo();
}
function exportSPSS(tId, fn) { exportCSV(tId, fn); setTimeout(() => openDialog('dlgSpss'), 300); }

// ===================================================================
// KESEHATAN IKAN & UDANG + DOSIMETRI + HAEMOCYTOMETER
// ===================================================================
let healthCharts = {};
function updateChartHealth() {
    const cRbc = document.getElementById('chkRbc').checked;
    const cWbc = document.getElementById('chkWbc').checked;
    const cGlu = document.getElementById('chkGlu').checked;
    const cTpc = document.getElementById('chkTpcLiver').checked;
    
    document.getElementById('boxChartRBC').style.display = cRbc ? 'block' : 'none';
    document.getElementById('boxChartWBC').style.display = cWbc ? 'block' : 'none';
    document.getElementById('boxChartGlu').style.display = cGlu ? 'block' : 'none';
    document.getElementById('boxChartTPC').style.display = cTpc ? 'block' : 'none';

    if(document.getElementById('chartContainerHealth').style.display === 'none') return;
    
    const labels = [], dataRBC = [], dataWBC = [], dataGlu = [], dataTPC = [];
    document.querySelectorAll('#healthBody tr').forEach(r => {
        labels.push(r.querySelector('.h-id').value || 'Ikan');
        if(cRbc) dataRBC.push(parseFloat(r.querySelector('.h-rbc').value) || 0);
        if(cWbc) dataWBC.push(parseFloat(r.querySelector('.h-wbc').value) || 0);
        if(cGlu) dataGlu.push(parseFloat(r.querySelector('.h-glu').value) || 0);
        if(cTpc) dataTPC.push(parseFloat(r.querySelector('.h-tpc').value) || 0);
    });

    if(cRbc) renderChart(healthCharts, 'chartRBC', 'bar', 'Eritrosit (10⁶)', labels, dataRBC, '#f87171');
    if(cWbc) renderChart(healthCharts, 'chartWBC', 'bar', 'Leukosit (10³)', labels, dataWBC, '#34d399');
    if(cGlu) renderChart(healthCharts, 'chartGlu', 'bar', 'Glukosa (mg/dL)', labels, dataGlu, '#fbbf24');
    if(cTpc) renderChart(healthCharts, 'chartTPC', 'bar', 'TPC Hati (log)', labels, dataTPC, '#c084fc');
}

function toggleHealthColumns() {
    const list = {'col-rbc':'chkRbc','col-wbc':'chkWbc','col-ht':'chkHt','col-hb':'chkHb','col-af':'chkAf','col-tpc-liver':'chkTpcLiver', 'col-glu':'chkGlu', 'col-thc':'chkThc', 'col-rb':'chkRb', 'col-po':'chkPo'};
    for(let c in list) { document.querySelectorAll('.'+c).forEach(el=>el.style.display=document.getElementById(list[c]).checked?'':'none'); }
    evalHealth();
}
function addHealthRow() {
  const tb = document.getElementById('healthBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
  const c = id => document.getElementById(id).checked ? '' : 'none';
  tr.innerHTML = `
    <td><input class="cell-input text-left h-id" value="${isFirst?'P1-U1':''}" oninput="evalHealth()"></td>
    <td class="col-rbc" style="display:${c('chkRbc')}"><input type="number" class="cell-input h-rbc" step="0.1" value="${isFirst?'2.1':''}" oninput="evalHealth()"></td>
    <td class="col-wbc" style="display:${c('chkWbc')}"><input type="number" class="cell-input h-wbc" step="1" value="${isFirst?'50':''}" oninput="evalHealth()"></td>
    <td class="col-ht" style="display:${c('chkHt')}"><input type="number" class="cell-input h-ht" step="1" value="${isFirst?'30':''}" oninput="evalHealth()"></td>
    <td class="col-hb" style="display:${c('chkHb')}"><input type="number" class="cell-input h-hb" step="0.1" value="${isFirst?'7.5':''}" oninput="evalHealth()"></td>
    <td class="col-af" style="display:${c('chkAf')}"><input type="number" class="cell-input h-af" step="1" value="${isFirst?'45':''}" oninput="evalHealth()"></td>
    <td class="col-glu" style="display:${c('chkGlu')}"><input type="number" class="cell-input h-glu" step="1" value="${isFirst?'60':''}" oninput="evalHealth()"></td>
    <td class="col-tpc-liver" style="display:${c('chkTpcLiver')}"><input type="number" class="cell-input h-tpc" step="0.1" value="${isFirst?'1.5':''}" oninput="evalHealth()"></td>
    <td class="col-thc" style="display:${c('chkThc')}"><input type="number" class="cell-input h-thc" step="0.1" value="${isFirst?'15.5':''}" oninput="evalHealth()"></td>
    <td class="col-rb" style="display:${c('chkRb')}"><input type="number" class="cell-input h-rb" step="0.01" value="${isFirst?'0.25':''}" oninput="evalHealth()"></td>
    <td class="col-po" style="display:${c('chkPo')}"><input type="number" class="cell-input h-po" step="0.01" value="${isFirst?'0.15':''}" oninput="evalHealth()"></td>
    <td class="h-status val-dim">—</td><td></td>`;
  tr.cells[tr.cells.length-1].appendChild(makeDel(() => { tr.remove(); evalHealth(); }));
  if(isFirst) evalHealth();
}
function evalHealth() {
  const cRbc=document.getElementById('chkRbc').checked, cWbc=document.getElementById('chkWbc').checked, cHt=document.getElementById('chkHt').checked, cHb=document.getElementById('chkHb').checked, cAf=document.getElementById('chkAf').checked, cTpc=document.getElementById('chkTpcLiver').checked, cGlu=document.getElementById('chkGlu').checked, cThc=document.getElementById('chkThc').checked, cRb=document.getElementById('chkRb').checked, cPo=document.getElementById('chkPo').checked;
  let latest = null, hasValid = false;

  document.querySelectorAll('#healthBody tr').forEach(r => {
    let rbc = cRbc?parseFloat(r.querySelector('.h-rbc').value):null;
    let wbc = cWbc?parseFloat(r.querySelector('.h-wbc').value):null;
    let ht = cHt?parseFloat(r.querySelector('.h-ht').value):null;
    let hb = cHb?parseFloat(r.querySelector('.h-hb').value):null;
    let af = cAf?parseFloat(r.querySelector('.h-af').value):null;
    let tpc = cTpc?parseFloat(r.querySelector('.h-tpc').value):null;
    let glu = cGlu?parseFloat(r.querySelector('.h-glu').value):null;
    let thc = cThc?parseFloat(r.querySelector('.h-thc').value):null;
    
    const scEl = r.querySelector('.h-status');
    let isCrit = false, isWarn = false;

    if(cRbc && (rbc<1.0)) isCrit=true; else if(cRbc && (rbc<1.5)) isWarn=true;
    if(cWbc && (wbc>150)) isCrit=true; else if(cWbc && (wbc>100)) isWarn=true;
    if(cHt && (ht<20)) isCrit=true; else if(cHt && (ht<25 || ht>45)) isWarn=true;
    if(cHb && (hb<4)) isCrit=true; else if(cHb && (hb<5)) isWarn=true;
    if(cAf && (af<30)) isWarn=true;
    if(cTpc && (tpc>4.0)) isCrit=true; else if(cTpc && (tpc>2.0)) isWarn=true;
    if(cGlu && (glu>200)) isCrit=true; else if(cGlu && (glu>150)) isWarn=true;
    if(cThc && (thc<5)) isCrit=true; else if(cThc && (thc<10)) isWarn=true;

    if(cRbc||cWbc||cHt||cHb||cAf||cTpc||cGlu||cThc) {
      hasValid = true; latest = {rbc, wbc, ht, hb, af, tpc, glu, thc};
      if(isCrit) scEl.innerHTML='<span class="badge badge-danger">⚠ Kritis</span>';
      else if(isWarn) scEl.innerHTML='<span class="badge badge-warning">Stres/Infeksi</span>';
      else scEl.innerHTML='<span class="badge badge-success">Optimal</span>';
    }
  });

  updateChartHealth();

  const pnl = document.getElementById('ewsHealthPanel');
  if(!hasValid || !latest) {
    pnl.style.borderLeftColor='var(--text3)'; pnl.innerHTML='<strong style="color:var(--primary); font-size:15px;"><span class="dsw-icon-styled">🔎</span> Dashboard Analitik Pakar (Klinis Imunologi)</strong><br><span style="color:var(--text3); font-size:13px;">Lengkapi data hematologi / hemolymph untuk mengaktifkan diagnosis patologis otomatis.</span>'; return;
  }

  let adv='Profil klinis/hematologi normal, hewan dalam kondisi prima.', bColor='var(--success)', icon='✅';
  if (cGlu && latest.glu>200) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Hiperglikemia Ekstrem.</strong> Gula darah sangat tinggi, indikasi stres fisiologis akut.'; }
  else if (cThc && cTpc && latest.thc<5 && latest.tpc>3) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Imunosupresi & Infeksi (Udang).</strong> Hemosit drop drastis disertai peningkatan bakteri (Risiko tinggi Vibriosis).'; }
  else if (cWbc && cTpc && latest.wbc>150 && latest.tpc>4.0) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Infeksi Bakteri Sistemik Sangat Parah.</strong> Sel darah putih melonjak merespons beban patogen ekstrim di organ hati.'; }
  else if (cTpc && latest.tpc>4.0) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Bakteremia / Infeksi Hati.</strong> Bakteri telah menembus <em>gut barrier</em> ke sirkulasi darah dan organ dalam.'; }
  else if (cRbc && cHt && cHb && (latest.rbc<1.0 || latest.ht<20 || latest.hb<4.0)) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Anemia Kritis.</strong> Indikasi kekurangan nutrisi akut atau serangan ektoparasit penghisap darah.'; }
  else if (cThc && latest.thc<10) { bColor='var(--warning)'; icon='⚠️'; adv='<strong>Total Haemocyte Count Rendah.</strong> Kemampuan imunologis udang sedang melemah.'; }
  else if (cHt && latest.ht>45) { bColor='var(--warning)'; icon='⚠️'; adv='<strong>Stres / Dehidrasi.</strong> Hematokrit tinggi menandakan hilangnya cairan plasma akibat stres osmotik.'; }
  else if (cWbc && latest.wbc>100) { bColor='var(--warning)'; icon='⚠️'; adv='<strong>Respons Inflamasi.</strong> Leukositosis awal. Cek kualitas air atau indikasi awal penyakit menular.'; }
  else if (cGlu && latest.glu>150) { bColor='var(--warning)'; icon='⚠️'; adv='<strong>Gula Darah Naik.</strong> Hewan budidaya sedang memasuki fase resistensi stres hormon kortisol.'; }
  else if (cAf && latest.af>50) { bColor='var(--primary)'; icon='🛡️'; adv='<strong>Imunostimulasi Kuat.</strong> Aktivitas fagositosis makrofag sangat baik (efek positif imunostimulan).'; }

  pnl.style.borderLeftColor = bColor; pnl.innerHTML = `<strong style="color:var(--primary); font-size:15px;">Diagnosis Fisiologis & Patologi</strong><br><span class="dsw-icon-styled">${icon}</span> ${adv}`;
}

// Dosimetri Kimia
function autoFillPurity() {
    const dType = document.getElementById('doseType').value;
    if(dType !== 'custom') { document.getElementById('dosePurity').value = dType; calcDose(); }
}
function calcDose() {
    const vol = parseFloat(document.getElementById('doseVol').value) || 0;
    const volUnit = parseFloat(document.getElementById('doseUnit').value) || 1;
    const target = parseFloat(document.getElementById('doseTarget').value) || 0;
    const purity = parseFloat(document.getElementById('dosePurity').value) || 100;
    
    const volInLiters = vol * volUnit;
    const resultEl = document.getElementById('doseResult');
    const unitEl = document.getElementById('doseResultUnit');
    
    if(volInLiters > 0 && target > 0 && purity > 0) {
        const requiredGrams = (volInLiters * target) / (purity / 100) / 1000;
        if (requiredGrams < 1) {
            resultEl.textContent = (requiredGrams * 1000).toFixed(2); unitEl.textContent = 'Miligram (mg)';
        } else if (requiredGrams > 1000) {
            resultEl.textContent = (requiredGrams / 1000).toFixed(2); unitEl.textContent = 'Kilogram (Kg) / Liter';
        } else {
            resultEl.textContent = requiredGrams.toFixed(2); unitEl.textContent = 'Gram (g) / mL';
        }
    } else {
        resultEl.textContent = '0.00'; unitEl.textContent = 'Gram / mL';
    }
}

// Haemocytometer Darah
function updateHaemoPreset() {
    const type = document.getElementById('haemoType').value;
    document.getElementById('haemoBox').value = type === 'rbc' ? 5 : 4;
    document.getElementById('haemoDil').value = type === 'rbc' ? 200 : 20;
    calcHaemo();
}
function calcHaemo() {
    const type = document.getElementById('haemoType').value;
    const count = parseFloat(document.getElementById('haemoCount').value) || 0;
    const boxes = parseFloat(document.getElementById('haemoBox').value) || 1;
    const dil = parseFloat(document.getElementById('haemoDil').value) || 1;
    
    if(count > 0 && boxes > 0 && dil > 0) {
        const cellsPerMm3 = (count / boxes) * 10 * dil;
        const resEl = document.getElementById('haemoResult');
        const unitEl = document.getElementById('haemoResultUnit');
        
        if(type === 'rbc') {
            resEl.textContent = (cellsPerMm3 / 1000000).toFixed(2);
            unitEl.textContent = '× 10⁶ sel/mm³ (Eritrosit)';
        } else {
            resEl.textContent = (cellsPerMm3 / 1000).toFixed(2);
            unitEl.textContent = '× 10³ sel/mm³ (Leukosit)';
        }
    } else {
        document.getElementById('haemoResult').textContent = '0.00';
    }
}

// ===================================================================
// GONAD & HATCHERY (NEW)
// ===================================================================
let gonadCharts = {};
let hatcheryCharts = {};

function updateChartGonad() {
    if(document.getElementById('chartContainerGonad').style.display === 'none') return;
    const labels = [], dataGSI = [], dataHSI = [], dataFek = [];
    document.querySelectorAll('#gonadBody tr').forEach(r => {
        labels.push(r.querySelector('.cell-input.text-left').value || 'Induk');
        dataGSI.push(parseFloat(r.querySelector('.res-gsi').textContent) || 0);
        dataHSI.push(parseFloat(r.querySelector('.res-hsi').textContent) || 0);
        let fekStr = r.querySelector('.res-fek').textContent.replace(/\./g, '');
        dataFek.push(parseFloat(fekStr) || 0);
    });

    renderChart(gonadCharts, 'chartGSI', 'bar', 'GSI (%)', labels, dataGSI, '#f472b6');
    renderChart(gonadCharts, 'chartHSI', 'bar', 'HSI (%)', labels, dataHSI, '#60a5fa');
    renderChart(gonadCharts, 'chartFek', 'bar', 'Fekunditas (Butir)', labels, dataFek, '#34d399');
}

function updateChartHatchery() {
    if(document.getElementById('chartContainerHatchery').style.display === 'none') return;
    const labels = [], dataFR = [], dataHR = [], dataSR = [];
    document.querySelectorAll('#hatcheryBody tr').forEach(r => {
        labels.push(r.querySelector('.hatch-id').value || 'Batch');
        dataFR.push(parseFloat(r.querySelector('.res-fr').textContent) || 0);
        dataHR.push(parseFloat(r.querySelector('.res-hr').textContent) || 0);
        dataSR.push(parseFloat(r.querySelector('.res-sr-larva').textContent) || 0);
    });

    renderChart(hatcheryCharts, 'chartFR', 'bar', 'Fertilization Rate (%)', labels, dataFR, '#38bdf8');
    renderChart(hatcheryCharts, 'chartHR', 'bar', 'Hatching Rate (%)', labels, dataHR, '#34d399');
    renderChart(hatcheryCharts, 'chartSRLarva', 'bar', 'Survival Rate Larva (%)', labels, dataSR, '#a855f7');
}

function addGonadRow() {
  const tb = document.getElementById('gonadBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
  tr.innerHTML = `<td><input class="cell-input text-left" value="${isFirst ? 'Induk-01' : ''}" oninput="calcGonad(this)"></td><td><input type="number" class="cell-input g-wt" value="${isFirst ? '1500' : ''}" oninput="calcGonad(this)"></td><td><input type="number" class="cell-input g-wg" value="${isFirst ? '300' : ''}" oninput="calcGonad(this)"></td><td><input type="number" class="cell-input g-wh" value="${isFirst ? '45' : ''}" oninput="calcGonad(this)"></td><td><input type="number" class="cell-input g-wsub" value="${isFirst ? '1' : ''}" oninput="calcGonad(this)"></td><td><input type="number" class="cell-input g-nsub" value="${isFirst ? '1200' : ''}" oninput="calcGonad(this)"></td><td class="res-gsi val-dim" style="color:var(--primary); font-weight:bold;">—</td><td class="res-hsi val-dim" style="color:var(--warning); font-weight:bold;">—</td><td class="res-fek val-dim" style="color:var(--success); font-weight:bold;">—</td><td></td>`;
  tr.cells[tr.cells.length-1].appendChild(makeDel(function(){ this.closest('tr').remove(); updateChartGonad(); })); if(isFirst) calcGonad(tr.querySelector('.g-wt'));
}
function calcGonad(i) {
  const r = i.closest('tr'), wt = parseFloat(r.querySelector('.g-wt').value)||0, wg = parseFloat(r.querySelector('.g-wg').value)||0, wh = parseFloat(r.querySelector('.g-wh').value)||0, wsub = parseFloat(r.querySelector('.g-wsub').value)||0, nsub = parseFloat(r.querySelector('.g-nsub').value)||0;
  const gsiEl = r.querySelector('.res-gsi'), hsiEl = r.querySelector('.res-hsi'), fekEl = r.querySelector('.res-fek');
  
  if(wt > 0 && wg > 0) { gsiEl.className='res-gsi val-num'; gsiEl.textContent = ((wg/wt)*100).toFixed(2); } else { gsiEl.className='res-gsi val-dim'; gsiEl.textContent = '—'; }
  if(wt > 0 && wh > 0) { hsiEl.className='res-hsi val-num'; hsiEl.textContent = ((wh/wt)*100).toFixed(2); } else { hsiEl.className='res-hsi val-dim'; hsiEl.textContent = '—'; }
  if(wg > 0 && wsub > 0 && nsub > 0) { fekEl.className='res-fek val-num'; fekEl.textContent = Math.round((wg/wsub)*nsub).toLocaleString('id-ID'); } else { fekEl.className='res-fek val-dim'; fekEl.textContent = '—'; }
  updateChartGonad();
}

function addHatcheryRow() {
    const tb = document.getElementById('hatcheryBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
    tr.innerHTML = `
        <td><input class="cell-input text-left hatch-id" value="${isFirst ? 'Batch-01' : ''}" oninput="updateChartHatchery()"></td>
        <td><input type="number" class="cell-input h-t-sampel" value="${isFirst ? '100' : ''}" oninput="calcHatchery(this)"></td>
        <td><input type="number" class="cell-input h-t-buah" value="${isFirst ? '85' : ''}" oninput="calcHatchery(this)"></td>
        <td><input type="number" class="cell-input h-t-netas" value="${isFirst ? '70' : ''}" oninput="calcHatchery(this)"></td>
        <td class="res-fr val-num" style="color:var(--blue); font-weight:bold;">—</td>
        <td class="res-hr val-num" style="color:var(--success); font-weight:bold;">—</td>
        <td><input type="number" class="cell-input h-l-awal" value="${isFirst ? '1000' : ''}" oninput="calcHatchery(this)"></td>
        <td><input type="number" class="cell-input h-l-akhir" value="${isFirst ? '850' : ''}" oninput="calcHatchery(this)"></td>
        <td class="res-sr-larva val-num" style="color:var(--purple); font-weight:bold;">—</td>
        <td></td>
    `;
    tr.cells[tr.cells.length-1].appendChild(makeDel(function(){ this.closest('tr').remove(); updateChartHatchery(); }));
    if(isFirst) calcHatchery(tr.querySelector('.h-t-sampel'));
}

function calcHatchery(i) {
    const r = i.closest('tr');
    const ts = parseFloat(r.querySelector('.h-t-sampel').value) || 0;
    const tb = parseFloat(r.querySelector('.h-t-buah').value) || 0;
    const tn = parseFloat(r.querySelector('.h-t-netas').value) || 0;
    const la = parseFloat(r.querySelector('.h-l-awal').value) || 0;
    const lk = parseFloat(r.querySelector('.h-l-akhir').value) || 0;

    const frEl = r.querySelector('.res-fr'), hrEl = r.querySelector('.res-hr'), srEl = r.querySelector('.res-sr-larva');

    if(ts > 0 && tb >= 0) { frEl.textContent = ((tb/ts)*100).toFixed(2); } else { frEl.textContent = '—'; }
    if(tb > 0 && tn >= 0) { hrEl.textContent = ((tn/tb)*100).toFixed(2); } else { hrEl.textContent = '—'; }
    if(la > 0 && lk >= 0) { srEl.textContent = ((lk/la)*100).toFixed(2); } else { srEl.textContent = '—'; }

    updateChartHatchery();
}


// ===================================================================
// PAKAN ENGINE (FR, Pearson, Proximate)
// ===================================================================
function addPakanRow() {
  const tb = document.getElementById('feedBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
  tr.innerHTML = `<td><input class="cell-input text-left" value="${isFirst ? 'Minggu 1' : ''}"></td><td><input type="number" class="cell-input p-abw" value="${isFirst ? '5.5' : ''}" oninput="calcPakan(this)"></td><td><input type="number" class="cell-input p-pop" value="${isFirst ? '1000' : ''}" oninput="calcPakan(this)"></td><td class="res-bio val-dim">—</td><td><input type="number" class="cell-input p-fr" value="${isFirst ? '3.0' : ''}" oninput="calcPakan(this)"></td><td class="res-feed val-dim">—</td><td></td>`;
  tr.cells[tr.cells.length-1].appendChild(makeDel(function(){ this.closest('tr').remove(); })); if(isFirst) calcPakan(tr.querySelector('.p-abw'));
}
function calcPakan(i) {
  const r=i.closest('tr'), abw=parseFloat(r.querySelector('.p-abw').value), pop=parseFloat(r.querySelector('.p-pop').value), fr=parseFloat(r.querySelector('.p-fr').value);
  const rb=r.querySelector('.res-bio'), rf=r.querySelector('.res-feed');
  if(!isNaN(abw)&&!isNaN(pop)){ const b=(abw*pop)/1000; rb.className='res-bio val-num'; rb.textContent=b.toFixed(2); if(!isNaN(fr)) { rf.className='res-feed val-num'; rf.style.color='var(--success)'; rf.textContent=(b*(fr/100)).toFixed(2); } }
}
function addProksimatRow() {
  const tb = document.getElementById('proxBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
  tr.innerHTML = `<td><input class="cell-input text-left" value="${isFirst ? 'Pakan A (Komersial)' : ''}"></td><td><input type="number" class="cell-input pr-p" value="${isFirst ? '30.5' : ''}" oninput="clP(this)"></td><td><input type="number" class="cell-input pr-l" value="${isFirst ? '6.0' : ''}" oninput="clP(this)"></td><td><input type="number" class="cell-input pr-s" value="${isFirst ? '4.5' : ''}" oninput="clP(this)"></td><td><input type="number" class="cell-input pr-ab" value="${isFirst ? '12.0' : ''}" oninput="clP(this)"></td><td><input type="number" class="cell-input pr-ai" value="${isFirst ? '10.0' : ''}" oninput="clP(this)"></td><td class="res-nfe val-dim">—</td><td></td>`;
  tr.cells[tr.cells.length-1].appendChild(makeDel(function(){ this.closest('tr').remove(); })); if(isFirst) clP(tr.querySelector('.pr-p'));
}
function clP(i) {
  const r=i.closest('tr'), p=parseFloat(r.querySelector('.pr-p').value)||0, l=parseFloat(r.querySelector('.pr-l').value)||0, s=parseFloat(r.querySelector('.pr-s').value)||0, a=parseFloat(r.querySelector('.pr-ab').value)||0, w=parseFloat(r.querySelector('.pr-ai').value)||0;
  const res = r.querySelector('.res-nfe'); res.className='res-nfe val-num'; res.style.color='var(--primary)'; res.textContent=(100-(p+l+s+a+w)).toFixed(2);
}

function calcPearson() {
    const target = parseFloat(document.getElementById('pearsonTarget').value) || 0;
    const total = parseFloat(document.getElementById('pearsonTotal').value) || 0;
    const b1Name = document.getElementById('pearsonB1Name').value || 'Bahan Basal';
    const b1Pct = parseFloat(document.getElementById('pearsonB1Pct').value) || 0;
    const b2Name = document.getElementById('pearsonB2Name').value || 'Bahan Suplemen';
    const b2Pct = parseFloat(document.getElementById('pearsonB2Pct').value) || 0;
    
    document.getElementById('resPName1').textContent = b1Name; document.getElementById('resPName2').textContent = b2Name;
    const alertEl = document.getElementById('pearsonAlert');
    if(target <= 0) return;
    
    if((target <= b1Pct && target <= b2Pct) || (target >= b1Pct && target >= b2Pct)) {
        alertEl.style.display = 'block'; alertEl.textContent = '⚠️ Target Protein harus berada DI ANTARA nilai protein bahan basal dan suplemen.';
        document.getElementById('resPPct1').textContent = '—'; document.getElementById('resPPct2').textContent = '—'; document.getElementById('resPGram1').textContent = '—'; document.getElementById('resPGram2').textContent = '—';
        return;
    }
    alertEl.style.display = 'none';

    const part1 = Math.abs(b2Pct - target), part2 = Math.abs(b1Pct - target), totalParts = part1 + part2;
    const prop1 = (part1 / totalParts) * 100, prop2 = (part2 / totalParts) * 100;
    document.getElementById('resPPct1').textContent = prop1.toFixed(2) + ' %'; document.getElementById('resPPct2').textContent = prop2.toFixed(2) + ' %';
    
    const totalGrams = total * 1000;
    document.getElementById('resPGram1').textContent = (totalGrams * (prop1/100)).toFixed(1) + ' g'; document.getElementById('resPGram2').textContent = (totalGrams * (prop2/100)).toFixed(1) + ' g'; document.getElementById('resPTotalGram').textContent = totalGrams.toFixed(1) + ' g';
}

// ===================================================================
// WATER QUALITY DYNAMIC EWS & BIOFLOC C/N
// ===================================================================
let wqCharts = {};
function updateChartWQ() {
    const pList = [
        { id: 'Temp', chk: 'chkTemp', label: 'Suhu (°C)', col: '.w-temp', color: '#f87171' },
        { id: 'Ph', chk: 'chkPh', label: 'pH', col: '.w-ph', color: '#34d399' },
        { id: 'Do', chk: 'chkDo', label: 'DO (mg/L)', col: '.w-do', color: '#60a5fa' },
        { id: 'Tan', chk: 'chkTan', label: 'TAN (ppm)', col: '.w-tan', color: '#fbbf24' },
        { id: 'Alk', chk: 'chkAlk', label: 'Alkalinitas', col: '.w-alk', color: '#c084fc' },
        { id: 'Tds', chk: 'chkTds', label: 'TDS (mg/L)', col: '.w-tds', color: '#a78bfa' },
        { id: 'Kecerahan', chk: 'chkKecerahan', label: 'Kecerahan', col: '.w-kecerahan', color: '#fcd34d' },
        { id: 'Nitrit', chk: 'chkNitrit', label: 'Nitrit', col: '.w-nitrit', color: '#f472b6' },
        { id: 'Nitrat', chk: 'chkNitrat', label: 'Nitrat', col: '.w-nitrat', color: '#38bdf8' },
        { id: 'Bod', chk: 'chkBod', label: 'BOD', col: '.w-bod', color: '#a3e635' },
        { id: 'Tom', chk: 'chkTom', label: 'TOM', col: '.w-tom', color: '#fca5a5' }
    ];

    const labels = [];
    const datasets = {};
    pList.forEach(p => datasets[p.id] = []);

    document.querySelectorAll('#waterBody tr').forEach(r => {
        let labelText = r.querySelector('.w-ket').value;
        labels.push(labelText ? labelText : ('H-' + (r.querySelector('.w-day').value || '?')));
        pList.forEach(p => datasets[p.id].push(parseFloat(r.querySelector(p.col).value) || null));
    });

    pList.forEach(p => {
        const isChecked = document.getElementById(p.chk).checked;
        document.getElementById('boxChart' + p.id).style.display = isChecked ? 'block' : 'none';
        if (isChecked && document.getElementById('chartContainerWQ').style.display !== 'none') {
            renderChart(wqCharts, 'chart' + p.id, 'line', p.label, labels, datasets[p.id], p.color);
        }
    });
}

function toggleWaterColumns() {
    const list = {'col-temp':'chkTemp','col-ph':'chkPh','col-do':'chkDo','col-tan':'chkTan', 'col-alk':'chkAlk', 'col-tds':'chkTds','col-kecerahan':'chkKecerahan','col-nitrit':'chkNitrit','col-nitrat':'chkNitrat','col-bod':'chkBod','col-tom':'chkTom'};
    for(let c in list) { 
        const chk = document.getElementById(list[c]);
        const isShow = chk ? chk.checked : true;
        document.querySelectorAll('.'+c).forEach(el => el.style.display = isShow ? '' : 'none'); 
    }
    evalWater();
}
function addWaterRow() {
  const tb = document.getElementById('waterBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
  const c = id => (document.getElementById(id) && document.getElementById(id).checked) ? '' : 'none';
  tr.innerHTML = `
    <td><input type="number" class="cell-input w-day" value="${tb.rows.length}" oninput="updateChartWQ()"></td>
    <td style="min-width:120px;"><input type="text" class="cell-input text-left w-ket" placeholder="${isFirst ? 'Cth: Pagi / Wadah 1' : ''}" oninput="updateChartWQ()"></td>
    <td class="col-temp" style="display:${c('chkTemp')}"><input type="number" class="cell-input w-temp" step="0.1" value="${isFirst ? '28.5' : ''}" oninput="evalWater()"></td>
    <td class="col-ph" style="display:${c('chkPh')}"><input type="number" class="cell-input w-ph" step="0.1" value="${isFirst ? '7.5' : ''}" oninput="evalWater()"></td>
    <td class="col-do" style="display:${c('chkDo')}"><input type="number" class="cell-input w-do" step="0.1" value="${isFirst ? '6.0' : ''}" oninput="evalWater()"></td>
    <td class="col-tan" style="display:${c('chkTan')}"><input type="number" class="cell-input w-tan" step="0.01" value="${isFirst ? '0.1' : ''}" oninput="evalWater()"></td>
    <td class="col-tan w-nh3 val-dim" style="display:${c('chkTan')}">—</td>
    <td class="col-alk" style="display:${c('chkAlk')}"><input type="number" class="cell-input w-alk" step="1" value="${isFirst ? '120' : ''}" oninput="evalWater()"></td>
    <td class="col-tds" style="display:${c('chkTds')}"><input type="number" class="cell-input w-tds" oninput="evalWater()"></td>
    <td class="col-kecerahan" style="display:${c('chkKecerahan')}"><input type="number" class="cell-input w-kecerahan" oninput="evalWater()"></td>
    <td class="col-nitrit" style="display:${c('chkNitrit')}"><input type="number" class="cell-input w-nitrit" step="0.01" oninput="evalWater()"></td>
    <td class="col-nitrat" style="display:${c('chkNitrat')}"><input type="number" class="cell-input w-nitrat" step="0.01" oninput="evalWater()"></td>
    <td class="col-bod" style="display:${c('chkBod')}"><input type="number" class="cell-input w-bod" step="0.1" oninput="evalWater()"></td>
    <td class="col-tom" style="display:${c('chkTom')}"><input type="number" class="cell-input w-tom" step="0.1" oninput="evalWater()"></td>
    <td class="w-status val-dim">—</td><td></td>`;
  tr.cells[tr.cells.length-1].appendChild(makeDel(() => { tr.remove(); evalWater(); }));
  if(isFirst) evalWater();
}
function calcNH3(tan, pH, tempC) { const pKa = 0.09018 + 2729.92 / (tempC + 273.15); return tan * (1 / (1 + Math.pow(10, pKa - pH))); }
function evalWater() {
  const useTemp=document.getElementById('chkTemp').checked, usePh=document.getElementById('chkPh').checked, useDo=document.getElementById('chkDo').checked, useTan=document.getElementById('chkTan').checked, useAlk=document.getElementById('chkAlk').checked, useNitrit=document.getElementById('chkNitrit').checked;
  let amoniaHist = [], latest = null, hasValid = false;

  document.querySelectorAll('#waterBody tr').forEach(r => {
    let tVal=useTemp?r.querySelector('.w-temp').value:null, pVal=usePh?r.querySelector('.w-ph').value:null, dVal=useDo?r.querySelector('.w-do').value:null;
    const scEl = r.querySelector('.w-status');
    if((useTemp&&!tVal) || (usePh&&!pVal) || (useDo&&!dVal) || (useTan&&!r.querySelector('.w-tan').value)) { scEl.innerHTML='<span class="badge badge-neutral">Belum Lengkap</span>'; return; }
    
    let t=tVal?parseFloat(tVal):28, p=pVal?parseFloat(pVal):7.5, d=dVal?parseFloat(dVal):6, n=0, nh3=0, alk=0, nitrit=0;
    let isCrit = false, isWarn = false;

    if(useTemp&&(t>=34||t<=22)) isCrit=true; else if(useTemp&&(t>=32||t<=25)) isWarn=true;
    if(usePh&&(p>=8.5||p<=6.0)) isCrit=true; else if(usePh&&((p>8.0&&p<8.5)||(p>6.0&&p<6.8))) isWarn=true;
    if(useDo&&d<=3.0) isCrit=true; else if(useDo&&d<=4.5) isWarn=true;

    if (useTan) {
        n = parseFloat(r.querySelector('.w-tan').value); 
        const nh3El = r.querySelector('.w-nh3');
        if(useTemp && usePh) {
            nh3 = calcNH3(n, p, t); 
            nh3El.className='col-tan w-nh3 val-num';
            nh3El.textContent=nh3.toFixed(4);
            if(nh3>0.02) nh3El.style.color='var(--danger)'; else if(nh3>0.01) nh3El.style.color='var(--warning)'; else nh3El.style.color='var(--success)';
            if(nh3>=0.02 || n>=0.5) isCrit=true; else if(nh3>=0.01 || n>=0.3) isWarn=true;
            amoniaHist.push({tan:n, nh3});
        } else {
            nh3El.className='col-tan w-nh3 val-dim';
            nh3El.innerHTML = '<span class="badge badge-neutral" style="font-size:9px;">T & pH Req</span>';
        }
    }
    
    if (useAlk && r.querySelector('.w-alk').value) { alk = parseFloat(r.querySelector('.w-alk').value); if(alk<40) isCrit=true; else if(alk<80) isWarn=true; }
    if (useNitrit && r.querySelector('.w-nitrit').value) { nitrit = parseFloat(r.querySelector('.w-nitrit').value); if(nitrit>=0.5) isCrit=true; else if(nitrit>=0.1) isWarn=true; }

    latest = {t,p,d,n,nh3,alk,nitrit}; hasValid = true;
    if(isCrit) scEl.innerHTML='<span class="badge badge-danger">⚠ Kritis</span>'; else if(isWarn) scEl.innerHTML='<span class="badge badge-warning">Waspada</span>'; else scEl.innerHTML='<span class="badge badge-success">Optimal</span>';
  });

  updateChartWQ();

  const pnl = document.getElementById('ewsPanel');
  if(!hasValid||!latest) { pnl.style.borderLeftColor='var(--text3)'; pnl.innerHTML='<strong style="color:var(--primary); font-size:15px;"><span class="dsw-icon-styled">🔎</span> Dashboard Analitik Pakar</strong><br><span style="color:var(--text3); font-size:13px;">Lengkapi data pada tabel untuk mengaktifkan AI rekomendasi.</span>'; return; }

  let adv='Parameter air terpantau aman.', bColor='var(--success)', icon='✅';
  
  if (useTan && useTemp && usePh && latest.nh3>=0.02 && latest.p>8.0) { bColor='var(--danger)'; icon='🚨'; adv='<strong>NH₃ bebas toksik tinggi akibat pH basa.</strong> Ganti air 20–30%, kurangi pH.'; }
  else if (useTan && useTemp && usePh && latest.nh3>=0.02) { bColor='var(--danger)'; icon='🚨'; adv='<strong>NH₃ bebas letal (> 0.02 mg/L).</strong> Ganti air segera, puasakan ikan.'; }
  else if (useNitrit && latest.nitrit>=0.5) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Toksisitas Nitrit (Brown Blood).</strong> Tambahkan NaCl/garam untuk proteksi insang.'; }
  else if (usePh && latest.p<=6.0) { bColor='var(--danger)'; icon='🚨'; adv='<strong>pH terlalu asam.</strong> Aplikasikan kapur dolomit/kalsium.'; }
  else if (usePh && latest.p>=8.5) { bColor='var(--danger)'; icon='🚨'; adv='<strong>pH terlampau basa.</strong> Hentikan pengapuran, sirkulasi air baru.'; }
  else if (useDo && latest.d<=3.0) { bColor='var(--danger)'; icon='🚨'; adv='<strong>DO kritis.</strong> Segera aktifkan kincir air/aerasi tambahan.'; }
  else if (useTemp && latest.t<=22.0) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Suhu terlalu dingin ekstrem.</strong> Fisiologis drop, awasi infeksi sekunder.'; }
  else if (useTemp && latest.t>=34.0) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Suhu terlalu panas ekstrem.</strong> Stres termal letal, naikkan volume air/naungan.'; }
  else if (useAlk && latest.alk<40) { bColor='var(--danger)'; icon='🚨'; adv='<strong>Alkalinitas sangat rendah (< 40).</strong> Risiko <em>pH crash</em> di malam hari tinggi. Tebar kapur karbonat/bikarbonat.'; }
  else if (useTan && useTemp && usePh && latest.nh3>=0.01) { bColor='var(--warning)'; icon='⚠️'; adv='<strong>NH₃ sub-letal.</strong> Kurangi Feeding Rate 20%.'; }
  else if (useDo && latest.d<=4.5) { bColor='var(--warning)'; icon='⚠️'; adv='<strong>DO rendah.</strong> Tingkatkan durasi kincir malam hari.'; }
  else if (useAlk && latest.alk<80) { bColor='var(--warning)'; icon='⚠️'; adv='<strong>Alkalinitas mendekati ambang bawah.</strong> <em>Buffering capacity</em> air melemah.'; }

  pnl.style.borderLeftColor = bColor; pnl.innerHTML = `<strong style="color:var(--primary); font-size:15px;">Dashboard Analitik &amp; Rekomendasi</strong><br><span class="dsw-icon-styled">${icon}</span> ${adv}`;
}

function autoFillCarbon() {
    const type = document.getElementById('bfType').value;
    if(type !== 'custom') { document.getElementById('bfPurity').value = type; calcBiofloc(); }
}
function calcBiofloc() {
    const tan = parseFloat(document.getElementById('bfTan').value) || 0;
    const vol = parseFloat(document.getElementById('bfVol').value) || 0;
    const unit = parseFloat(document.getElementById('bfUnit').value) || 1;
    const target = parseFloat(document.getElementById('bfTarget').value) || 0;
    const purity = parseFloat(document.getElementById('bfPurity').value) || 40;
    
    const volInLiters = vol * unit;
    const totalNGram = (tan * volInLiters) / 1000;
    const targetC = totalNGram * target;
    const resEl = document.getElementById('bfResult');
    
    if(totalNGram > 0 && target > 0 && purity > 0) {
        const addition = targetC / (purity / 100);
        resEl.textContent = addition.toFixed(2);
    } else {
        resEl.textContent = "0.00";
    }
}

// ===================================================================
// PLANKTON, KINETIKA, & EKOLOGI
// ===================================================================
function autoFillPlkVol(sel) {
    const tr = sel.closest('tr');
    const volInput = tr.querySelector('.pk-v');
    if(sel.value !== 'custom') { volInput.value = sel.value; calcPlkDens(volInput); }
}
function addPlkDensRow() {
  const tb = document.getElementById('plkDensBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
  tr.innerHTML = `
    <td><input class="cell-input text-left" value="${isFirst?'Chlorella sp.':''}"></td>
    <td><input type="number" class="cell-input pk-n" value="${isFirst?'150':''}" oninput="calcPlkDens(this)"></td>
    <td><select class="cell-select pk-type" onchange="autoFillPlkVol(this)"><option value="0.0001">Haemocytometer</option><option value="1">Sedgwick-Rafter (SRC)</option><option value="custom">Kustom</option></select></td>
    <td><input type="number" class="cell-input pk-v" value="${isFirst?'0.0001':''}" oninput="calcPlkDens(this)"></td>
    <td><input type="number" class="cell-input pk-dil" value="${isFirst?'10':''}" oninput="calcPlkDens(this)"></td>
    <td class="res-plk sci-not">—</td><td></td>`;
  tr.cells[6].appendChild(makeDel(function(){this.closest('tr').remove();})); if(isFirst) calcPlkDens(tr.querySelector('.pk-n'));
}
function calcPlkDens(i) {
  const r = i.closest('tr'), n = parseFloat(r.querySelector('.pk-n').value), v = parseFloat(r.querySelector('.pk-v').value), dil = parseFloat(r.querySelector('.pk-dil').value), res = r.querySelector('.res-plk');
  if(n>=0 && v>0 && dil>0) res.innerHTML = formatSci((n / v) * dil); else res.innerHTML = '—';
}
function calcPlkKin() {
  const t1 = parseFloat(document.getElementById('plkT1').value), n1 = parseFloat(document.getElementById('plkN1').value), t2 = parseFloat(document.getElementById('plkT2').value), n2 = parseFloat(document.getElementById('plkN2').value);
  const rK = document.getElementById('resPlkK'), rTd = document.getElementById('resPlkTd'), rRgr = document.getElementById('resPlkRgr'), al = document.getElementById('plkAlert');
  al.style.display = 'none';
  if(!isNaN(t1)&&!isNaN(n1)&&!isNaN(t2)&&!isNaN(n2)) {
     if(t2>t1 && n2>n1 && n1>0) {
         const k = (Math.log(n2)-Math.log(n1))/(t2-t1);
         const rgr = ((n2 - n1)/n1) / (t2-t1); // Relative Growth Rate
         rK.textContent = k.toFixed(4); rTd.textContent = (0.693/k).toFixed(2); rRgr.textContent = rgr.toFixed(4);
     } else { al.style.display='block'; al.className='info-box danger'; al.textContent='Data tidak valid untuk fase log/eksponensial.'; rK.textContent='—'; rTd.textContent='—'; rRgr.textContent='—'; }
  } else { rK.textContent='—'; rTd.textContent='—'; rRgr.textContent='—'; }
}

// Indeks Ekologi Plankton
function addEcoRow() {
    const tb = document.getElementById('ecoBody'); const isFirst = tb.rows.length === 0; const tr = tb.insertRow();
    tr.innerHTML = `<td><input class="cell-input text-left" value="${isFirst?'Spesies A':''}" oninput="calcEco()"></td><td><input type="number" class="cell-input eco-n" value="${isFirst?'50':''}" oninput="calcEco()"></td><td></td>`;
    tr.cells[2].appendChild(makeDel(function(){this.closest('tr').remove(); calcEco();}));
    if(isFirst) {
        const tr2 = tb.insertRow();
        tr2.innerHTML = `<td><input class="cell-input text-left" value="Spesies B" oninput="calcEco()"></td><td><input type="number" class="cell-input eco-n" value="10" oninput="calcEco()"></td><td></td>`;
        tr2.cells[2].appendChild(makeDel(function(){this.closest('tr').remove(); calcEco();}));
    }
    calcEco();
}
function calcEco() {
    let totalN = 0; let counts = [];
    document.querySelectorAll('#ecoBody .eco-n').forEach(input => {
        let val = parseFloat(input.value) || 0;
        if(val > 0) { counts.push(val); totalN += val; }
    });
    
    const hEl = document.getElementById('resEcoH'), eEl = document.getElementById('resEcoE'), cEl = document.getElementById('resEcoC'), hText = document.getElementById('resEcoHText');
    if(totalN > 0 && counts.length > 0) {
        let h = 0, c = 0;
        counts.forEach(ni => { let pi = ni / totalN; h -= (pi * Math.log(pi)); c += (pi * pi); });
        let s = counts.length; let e = s > 1 ? h / Math.log(s) : 0;
        hEl.textContent = h.toFixed(3); eEl.textContent = e.toFixed(3); cEl.textContent = c.toFixed(3);
        if(h > 3.0) hText.textContent = "Keanekaragaman Tinggi"; else if(h >= 1.0) hText.textContent = "Keanekaragaman Sedang"; else hText.textContent = "Keanekaragaman Rendah";
    } else {
        hEl.textContent = '—'; eEl.textContent = '—'; cEl.textContent = '—'; hText.textContent = 'Menunggu Data';
    }
}

// ===================================================================
// MICROBIOLOGY LAB
// ===================================================================
function addOdRow() {
  const tb = document.getElementById('odBody'); const isFirst = tb.rows.length === 0;
  tb.insertRow().innerHTML=`<td><input class="cell-input text-left" value="${isFirst?'Bakteri Asam Laktat':''}"></td><td><input type="number" class="cell-input o-od" value="${isFirst?'0.85':''}" oninput="cOd(this)"></td><td><input type="number" class="cell-input o-fc" value="800000000" oninput="cOd(this)"></td><td class="res-od sci-not">—</td><td></td>`;
  tb.rows[tb.rows.length-1].cells[4].appendChild(makeDel(function(){this.closest('tr').remove();})); if(isFirst) cOd(tb.rows[0].querySelector('.o-od'));
}
function cOd(i){
  const r=i.closest('tr'), od=parseFloat(r.querySelector('.o-od').value)||0, fc=parseFloat(r.querySelector('.o-fc').value)||0;
  r.querySelector('.res-od').innerHTML=od>0?formatSci(od*fc):'—';
}
function calcKinetikaBakteri() {
  const t1=parseFloat(document.getElementById('bioT1').value), od1=parseFloat(document.getElementById('bioOd1').value), t2=parseFloat(document.getElementById('bioT2').value), od2=parseFloat(document.getElementById('bioOd2').value);
  const rm=document.getElementById('resMu'), rg=document.getElementById('resGen'), al=document.getElementById('kinetikaAlert');
  al.style.display='none'; if(!t1||!od1||!t2||!od2){rm.textContent='—'; rg.textContent='—'; return;}
  if(t2>t1 && od2>od1){ const mu=(Math.log(od2)-Math.log(od1))/(t2-t1); rm.textContent=mu.toFixed(4); rg.textContent=(0.693/mu).toFixed(2); }else{ al.style.display='block'; al.textContent='Data Fase Log Tidak Valid.'; }
}
function addTpcRow() {
  const tb = document.getElementById('tpcBody'); const isFirst = tb.rows.length === 0;
  tb.insertRow().innerHTML=`<td><input class="cell-input text-left" value="${isFirst?'Bakteri Asam Laktat':''}"></td><td><input type="number" class="cell-input m-k" value="${isFirst?'125':''}" oninput="cTpc(this)"></td><td><input type="number" class="cell-input m-f" value="${isFirst?'6':''}" oninput="cTpc(this)"></td><td><input type="number" class="cell-input m-v" value="0.1" oninput="cTpc(this)"></td><td class="res-tpc sci-not">—</td><td></td>`;
  tb.rows[tb.rows.length-1].cells[5].appendChild(makeDel(function(){this.closest('tr').remove();})); if(isFirst) cTpc(tb.rows[0].querySelector('.m-k'));
}
function cTpc(i){
  const r=i.closest('tr'), k=parseFloat(r.querySelector('.m-k').value)||0, f=parseFloat(r.querySelector('.m-f').value)||0, v=parseFloat(r.querySelector('.m-v').value)||0;
  r.querySelector('.res-tpc').innerHTML=(k>0&&v>0)?formatSci((k/v)*Math.pow(10,f)):'—';
}
function addZonaRow() {
  const tb = document.getElementById('zonaBody'); const isFirst = tb.rows.length === 0;
  tb.insertRow().innerHTML=`<td><input class="cell-input text-left" value="${isFirst?'BAL vs Aeromonas':''}"></td><td><input type="number" class="cell-input z-total" value="${isFirst?'15.5':''}" oninput="cZ(this)"></td><td><input type="number" class="cell-input z-disk" value="6" oninput="cZ(this)"></td><td class="res-z val-dim">—</td><td class="res-zk">—</td><td></td>`;
  tb.rows[tb.rows.length-1].cells[5].appendChild(makeDel(function(){this.closest('tr').remove();})); if(isFirst) cZ(tb.rows[0].querySelector('.z-total'));
}
function cZ(i){
  const r=i.closest('tr'), tot=parseFloat(r.querySelector('.z-total').value)||0, disk=parseFloat(r.querySelector('.z-disk').value)||0;
  const rz=r.querySelector('.res-z'), rk=r.querySelector('.res-zk');
  if(tot>=disk && disk>0){ const l=(tot-disk)/2; rz.className='res-z val-num'; rz.textContent=l.toFixed(1); rk.innerHTML=l>10?'<span class="badge badge-success">Kuat</span>':'<span class="badge badge-warning">Sedang</span>'; }
}

// ===================================================================
// MOLECULAR LAB TOOLS & PCR MASTER MIX VALIDATION
// ===================================================================
function cleanSeq(s) { return s.toUpperCase().replace(/[^ATCG]/g,''); }
function calcTm(seq) {
  if(!seq||seq.length===0) return 0; const g=(seq.match(/G/g)||[]).length, c=(seq.match(/C/g)||[]).length, a=(seq.match(/A/g)||[]).length, t=(seq.match(/T/g)||[]).length;
  return seq.length < 14 ? (a+t)*2+(g+c)*4 : 64.9+41*(g+c-16.4)/seq.length;
}
function calcGC(seq) { if(!seq.length) return 0; const g=(seq.match(/G/g)||[]).length, c=(seq.match(/C/g)||[]).length; return ((g+c)/seq.length*100); }
function revComp(seq) { return seq.split('').reverse().map(b=>(b==='A'?'T':b==='T'?'A':b==='C'?'G':'C')).join(''); }

function analyzePrimer() {
  const f=cleanSeq(document.getElementById('seqFwd').value), r=cleanSeq(document.getElementById('seqRev').value);
  let pSizeVal = null; const tmpl = cleanSeq(document.getElementById('seqTemplate').value);
  if(f) { document.getElementById('resFwdLen').textContent=f.length; document.getElementById('resFwdGc').textContent=calcGC(f).toFixed(1)+'%'; document.getElementById('resFwdTm').textContent=calcTm(f).toFixed(1)+'°C'; }
  if(r) { document.getElementById('resRevLen').textContent=r.length; document.getElementById('resRevGc').textContent=calcGC(r).toFixed(1)+'%'; document.getElementById('resRevTm').textContent=calcTm(r).toFixed(1)+'°C'; }
  if(f && r) {
      document.getElementById('resAnnealing').textContent=(Math.min(calcTm(f),calcTm(r))-5).toFixed(1)+' °C · 30 dtk';
      document.getElementById('resDeltaTm').textContent = Math.abs(calcTm(f)-calcTm(r)).toFixed(1) + ' °C';
      if(tmpl) { const start = tmpl.indexOf(f), end = tmpl.indexOf(revComp(r)); if(start!==-1 && end!==-1 && end>start) { pSizeVal = end+r.length-start; document.getElementById('resProdSize').textContent = pSizeVal+' bp'; document.getElementById('resProdSize').style.color='var(--success)'; } }
      const extEl = document.getElementById('resExtension');
      if(pSizeVal) extEl.textContent = '72 °C · ' + Math.max(30, Math.ceil((pSizeVal/1000)*60)) + ' dtk'; else extEl.textContent = '72 °C · 30-60 dtk (estimasi)';
  }
}
function calcPCR() {
  const s=parseFloat(document.getElementById('pcrSamples').value)||0, t=parseFloat(document.getElementById('pcrTargetVol').value)||0;
  const templateVol = parseFloat(document.getElementById('pcrTemplateVol').value)||0;
  const ids=['vWater','vMix','vFwd','vRev']; 
  let totalSingle=0; let hasVal = false;
  
  ids.forEach((id,idx) => { 
      const valStr = document.getElementById(id).value;
      let v=parseFloat(valStr)||0; 
      if(valStr !== "") hasVal = true;
      totalSingle+=v; 
      document.querySelectorAll('.res-pcr')[idx].textContent=(v*s).toFixed(1); 
      document.querySelectorAll('.res-pcr-ov')[idx].textContent=(v*s*1.1).toFixed(1); 
  });
  
  document.getElementById('mixTotalSingle').textContent=totalSingle.toFixed(1)+' µL'; 
  document.getElementById('mixTotalN').textContent=(totalSingle*s).toFixed(1)+' µL'; 
  document.getElementById('mixTotalNov').textContent=(totalSingle*s*1.1).toFixed(1)+' µL';

  const al = document.getElementById('mixAlert');
  if (hasVal && t > 0) {
      const expectedMix = t - templateVol;
      const diff = totalSingle - expectedMix;
      if (Math.abs(diff) > 0.1) {
          al.style.display = 'block';
          let statusText = diff > 0 ? `Kelebihan ${diff.toFixed(1)} µL` : `Kurang ${Math.abs(diff).toFixed(1)} µL`;
          al.innerHTML = `⚠ Total komponen mix Anda = <strong>${totalSingle.toFixed(1)} µL</strong>. Target Master Mix seharusnya = <strong>${expectedMix.toFixed(1)} µL</strong> <span style="color:var(--danger); font-weight:bold;">[${statusText}]</span> agar Total Reaksi pas di ${t} µL.`;
      } else { al.style.display = 'none'; }
  } else { al.style.display = 'none'; }
}
function updateTemplateVol() { document.getElementById('tblTemplateVol').value=document.getElementById('pcrTemplateVol').value; calcPCR(); }
function addGelRow() {
  const b=document.getElementById('gelBody'); const w=b.rows.length; const isFirst = w===0;
  b.insertRow().innerHTML=`<td style="text-align:center;">${isFirst?'M (Marker)':'W'+w}</td><td><input class="cell-input text-left" value="${isFirst?'Ladder 100bp':''}"></td><td><input type="number" class="cell-input" value="${isFirst?'100':''}"></td><td><select class="cell-select"><option>Tajam</option><option>Smear</option></select></td><td></td>`;
  b.rows[b.rows.length-1].cells[4].appendChild(makeDel(function(){this.closest('tr').remove();}));
}

// ===================================================================
// CONFIRMATION DIALOG MODAL & SNAPSHOT EXPORT
// ===================================================================
let _aquaConfirmCallback = null;

function openAquaConfirm({ title, bodyHtml, confirmText = 'Ya, Lanjutkan', confirmClass = 'btn-danger', onConfirm }) {
  const overlay = document.getElementById('dlgAquaConfirm');
  const titleEl = document.getElementById('aquaConfirmTitle');
  const bodyEl = document.getElementById('aquaConfirmBody');
  const actionBtn = document.getElementById('aquaConfirmActionBtn');

  if (titleEl) titleEl.innerHTML = `${title} <button class="btn-icon" onclick="closeAquaConfirm()" style="font-size:18px;">×</button>`;
  if (bodyEl) bodyEl.innerHTML = bodyHtml;
  if (actionBtn) {
    actionBtn.textContent = confirmText;
    actionBtn.className = `btn ${confirmClass}`;
    actionBtn.onclick = function(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const cb = _aquaConfirmCallback;
      closeAquaConfirm();
      if (typeof cb === 'function') cb();
    };
  }

  _aquaConfirmCallback = onConfirm;
  if (overlay) {
    overlay.classList.add('active');
  } else {
    if (confirm(title.replace(/<[^>]*>/g, ''))) {
      if (typeof onConfirm === 'function') onConfirm();
    }
  }
}

function closeAquaConfirm() {
  const overlay = document.getElementById('dlgAquaConfirm');
  if (overlay) overlay.classList.remove('active');
  _aquaConfirmCallback = null;
}

function downloadJsonSnapshot(type) {
  let dataToExport = null;
  let filename = '';
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);

  if (type === 'logbook') {
    if (typeof saveLog === 'function') saveLog();
    const records = JSON.parse(localStorage.getItem('al_log')) || [];
    dataToExport = {
      app: 'AquaLab-Workspace',
      dataset: 'Logbook Penelitian',
      schemaVersion: '1.0',
      exportedAt: now.toISOString(),
      formattedDate: now.toLocaleString('id-ID'),
      totalRecords: records.length,
      columns: ['Tanggal (d)', 'Waktu (t)', 'Aktivitas (a)', 'Observasi/Hasil (o)', 'Catatan Khusus (n)'],
      records: records
    };
    filename = `AquaLab_Logbook_Snapshot_${timestamp}.json`;
  } else if (type === 'inv' || type === 'inventory') {
    if (typeof saveInv === 'function') saveInv();
    const items = JSON.parse(localStorage.getItem('al_inv')) || [];
    dataToExport = {
      app: 'AquaLab-Workspace',
      dataset: 'Inventaris Laboratorium',
      schemaVersion: '1.0',
      exportedAt: now.toISOString(),
      formattedDate: now.toLocaleString('id-ID'),
      totalItems: items.length,
      columns: ['Nama Item (name)', 'Kategori (cat)', 'Stok/Kuantitas (qty)', 'Satuan (unit)', 'Suhu Simpan (temp)'],
      items: items
    };
    filename = `AquaLab_Inventaris_Snapshot_${timestamp}.json`;
  } else {
    return;
  }

  try {
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    if (typeof toast === 'function') toast(`Snapshot ${filename} berhasil diunduh.`);
  } catch (err) {
    console.error('Download snapshot failed:', err);
  }
}

// ===================================================================
// DATA RETRIEVAL (LOCAL STORAGE SYSTEMS)
// ===================================================================
function confirmDeleteLogRow(idx) {
  saveLog();
  const data = JSON.parse(localStorage.getItem('al_log')) || [];
  if (!data[idx]) return;
  const item = data[idx];
  const act = item.a ? `"${item.a}"` : `Baris #${idx + 1}`;
  
  openAquaConfirm({
    title: `<span class="dsw-icon-styled">🗑️</span> Hapus Catatan Logbook`,
    bodyHtml: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <p style="margin:0; font-size:13.5px; color:var(--text); line-height:1.5;">
          Apakah Anda yakin ingin menghapus catatan aktivitas <strong>${act}</strong>?
        </p>
        <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:10px 12px; font-size:12.5px; line-height:1.6;">
          <div>• <strong>Tanggal:</strong> ${item.d || '—'} ${item.t ? `(${item.t})` : ''}</div>
          <div>• <strong>Aktivitas:</strong> ${item.a || '—'}</div>
          <div>• <strong>Observasi:</strong> ${item.o || '—'}</div>
          <div>• <strong>Catatan:</strong> ${item.n || '—'}</div>
        </div>
      </div>
    `,
    confirmText: 'Ya, Hapus Catatan',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      data.splice(idx, 1);
      localStorage.setItem('al_log', JSON.stringify(data));
      loadLogbook();
      if (typeof toast === 'function') toast(`Catatan #${idx + 1} telah dihapus.`);
    }
  });
}

function loadLogbook() {
  const b = document.getElementById('logbookBody'); 
  if (!b) return;
  b.innerHTML = '';
  const data = JSON.parse(localStorage.getItem('al_log')) || [{ d: new Date().toISOString().split('T')[0], t: '08:00', a: 'Persiapan Ekstraksi', o: 'Alat steril, sampel siap', n: 'Gunakan kit spesifik' }];
  data.forEach((item, idx) => {
    const tr = b.insertRow();
    tr.innerHTML = `<td style="text-align:center;">${idx + 1}</td><td><input type="date" class="cell-input l-d" value="${item.d || ''}" onchange="saveLog()"></td><td><input type="time" class="cell-input l-t" value="${item.t || ''}" onchange="saveLog()"></td><td><input type="text" class="cell-input text-left l-a" value="${item.a || ''}" onchange="saveLog()"></td><td><input type="text" class="cell-input text-left l-o" value="${item.o || ''}" onchange="saveLog()"></td><td><input type="text" class="cell-input text-left l-n" value="${item.n || ''}" onchange="saveLog()"></td><td></td>`;
    tr.cells[6].appendChild(makeDel(function(e) {
      confirmDeleteLogRow(idx);
    }));
  });
}

function addLogbookRow() { 
  const data = JSON.parse(localStorage.getItem('al_log')) || []; 
  data.push({ d: new Date().toISOString().split('T')[0], t: '', a: '', o: '', n: '' }); 
  localStorage.setItem('al_log', JSON.stringify(data)); 
  loadLogbook(); 
}

function saveLog() { 
  let d = []; 
  document.querySelectorAll('#logbookBody tr').forEach(r => { 
    d.push({
      d: r.querySelector('.l-d')?.value || '',
      t: r.querySelector('.l-t')?.value || '',
      a: r.querySelector('.l-a')?.value || '',
      o: r.querySelector('.l-o')?.value || '',
      n: r.querySelector('.l-n')?.value || ''
    }); 
  }); 
  localStorage.setItem('al_log', JSON.stringify(d)); 
}

function clearLogbook() {
  saveLog();
  const currentData = JSON.parse(localStorage.getItem('al_log')) || [];
  const count = currentData.length;

  openAquaConfirm({
    title: `<span class="dsw-icon-styled">🗑️</span> Konfirmasi Reset Logbook`,
    bodyHtml: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <p style="margin:0; font-size:13.5px; color:var(--text); line-height:1.5;">
          Apakah Anda yakin ingin <strong>mereset seluruh data Logbook Penelitian</strong>?
        </p>
        
        <div style="background:var(--bg); border:1px solid var(--border); border-left:4px solid var(--warning); border-radius:8px; padding:12px; font-size:12.5px; line-height:1.6;">
          <div style="font-weight:700; color:var(--warning); margin-bottom:4px;">Ringkasan Data Logbook:</div>
          <div>• <strong>Total Catatan:</strong> ${count} baris aktivitas eksperimen</div>
          <div>• <strong>Penyimpanan:</strong> Memori Lokal Browser (localStorage)</div>
        </div>

        <p style="color:var(--danger); font-size:12px; font-weight:600; margin:0; display:flex; align-items:center; gap:6px;">
          <span>⚠️</span> Tindakan reset akan mengosongkan seluruh riwayat catatan dan tidak dapat dibatalkan.
        </p>
      </div>
    `,
    confirmText: 'Ya, Reset Logbook',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      localStorage.removeItem('al_log');
      loadLogbook();
      if (typeof toast === 'function') toast('Logbook berhasil direset.');
    }
  });
}

function confirmDeleteInvRow(idx) {
  saveInv();
  const data = JSON.parse(localStorage.getItem('al_inv')) || [];
  if (!data[idx]) return;
  const item = data[idx];
  const name = item.name ? `"${item.name}"` : `Item #${idx + 1}`;
  
  openAquaConfirm({
    title: `<span class="dsw-icon-styled">🗑️</span> Hapus Item Inventaris`,
    bodyHtml: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <p style="margin:0; font-size:13.5px; color:var(--text); line-height:1.5;">
          Apakah Anda yakin ingin menghapus item <strong>${name}</strong> dari inventaris?
        </p>
        <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:10px 12px; font-size:12.5px; line-height:1.6;">
          <div>• <strong>Nama Item:</strong> ${item.name || '—'}</div>
          <div>• <strong>Kategori:</strong> ${item.cat || '—'}</div>
          <div>• <strong>Stok:</strong> ${item.qty !== undefined ? item.qty : '0'} ${item.unit || ''}</div>
          <div>• <strong>Suhu Simpan:</strong> ${item.temp || '—'}</div>
        </div>
      </div>
    `,
    confirmText: 'Ya, Hapus Item',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      data.splice(idx, 1);
      localStorage.setItem('al_inv', JSON.stringify(data));
      loadInventory();
      if (typeof toast === 'function') toast(`Item ${name} telah dihapus.`);
    }
  });
}

function loadInventory() {
  const b = document.getElementById('invBody'); 
  if (!b) return;
  b.innerHTML = '';
  const data = JSON.parse(localStorage.getItem('al_inv')) || [{ name: 'GoTaq Green Mix', cat: 'Reagen PCR', qty: 1000, unit: 'µL', temp: '-20°C' }];
  data.forEach((item, idx) => {
    const tr = b.insertRow();
    const qtyVal = item.qty !== undefined ? item.qty : '';
    tr.innerHTML = `<td style="text-align:center;">${idx + 1}</td><td><input type="text" class="cell-input text-left i-n" value="${item.name || ''}" onchange="saveInv()"></td><td><input type="text" class="cell-input i-c" value="${item.cat || ''}" onchange="saveInv()"></td><td><input type="number" class="cell-input i-q" value="${qtyVal}" onchange="saveInv()" style="font-weight:bold; color:${parseFloat(qtyVal) <= 10 ? 'var(--danger)' : 'var(--success)'}"></td><td><input type="text" class="cell-input i-u" value="${item.unit || ''}" onchange="saveInv()"></td><td><input type="text" class="cell-input i-t" value="${item.temp || ''}" onchange="saveInv()"></td><td></td>`;
    tr.cells[6].appendChild(makeDel(function(e) {
      confirmDeleteInvRow(idx);
    }));
  });
}

function addInvRow() { 
  const d = JSON.parse(localStorage.getItem('al_inv')) || []; 
  d.push({ name: '', cat: '', qty: '', unit: '', temp: '' }); 
  localStorage.setItem('al_inv', JSON.stringify(d)); 
  loadInventory(); 
}

function saveInv() { 
  let d = []; 
  document.querySelectorAll('#invBody tr').forEach(r => { 
    const qInp = r.querySelector('.i-q') || r.querySelector('.i-qty'); 
    d.push({
      name: r.querySelector('.i-n')?.value || '',
      cat: r.querySelector('.i-c')?.value || '',
      qty: qInp ? qInp.value : '',
      unit: r.querySelector('.i-u')?.value || '',
      temp: r.querySelector('.i-t')?.value || ''
    }); 
  }); 
  localStorage.setItem('al_inv', JSON.stringify(d)); 
}

function clearInventory() {
  saveInv();
  const currentData = JSON.parse(localStorage.getItem('al_inv')) || [];
  const count = currentData.length;

  openAquaConfirm({
    title: `<span class="dsw-icon-styled">🗑️</span> Konfirmasi Reset Inventaris Lab`,
    bodyHtml: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <p style="margin:0; font-size:13.5px; color:var(--text); line-height:1.5;">
          Apakah Anda yakin ingin <strong>mereset seluruh data Inventaris Laboratorium</strong>?
        </p>
        
        <div style="background:var(--bg); border:1px solid var(--border); border-left:4px solid var(--warning); border-radius:8px; padding:12px; font-size:12.5px; line-height:1.6;">
          <div style="font-weight:700; color:var(--warning); margin-bottom:4px;">Ringkasan Stok Inventaris:</div>
          <div>• <strong>Total Item:</strong> ${count} jenis reagen/bahan/peralatan</div>
          <div>• <strong>Penyimpanan:</strong> Memori Lokal Browser (localStorage)</div>
        </div>

        <p style="color:var(--danger); font-size:12px; font-weight:600; margin:0; display:flex; align-items:center; gap:6px;">
          <span>⚠️</span> Seluruh item inventaris akan direset kembali ke data awal sistem.
        </p>
      </div>
    `,
    confirmText: 'Ya, Reset Inventaris',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      localStorage.removeItem('al_inv');
      loadInventory();
      if (typeof toast === 'function') toast('Inventaris berhasil direset.');
    }
  });
}

function loadNeeds() {
  const rb=document.getElementById('reqBody'); rb.innerHTML='';
  const data=JSON.parse(localStorage.getItem('al_req'))||[{n:'DNA Extraction Kit',q:'1 Box',u:'Tinggi',s:'Pending'}];
  data.forEach((item,idx)=>{
    rb.insertRow().innerHTML=`<td style="text-align:center;">${idx+1}</td><td><input type="text" class="cell-input text-left r-n" value="${item.n}" onchange="saveN()"></td><td><input type="text" class="cell-input r-q" value="${item.q}" onchange="saveN()"></td><td><select class="cell-select r-u" onchange="saveN()"><option ${item.u==='Tinggi'?'selected':''}>Tinggi</option><option ${item.u==='Normal'?'selected':''}>Normal</option></select></td><td><select class="cell-select r-s" onchange="saveN()"><option ${item.s==='Pending'?'selected':''}>Pending</option><option ${item.s==='Selesai'?'selected':''}>Selesai</option></select></td><td></td>`;
    rb.rows[rb.rows.length-1].cells[5].appendChild(makeDel(()=>{ data.splice(idx,1); localStorage.setItem('al_req',JSON.stringify(data)); loadNeeds(); }));
  });
  
  const bb=document.getElementById('bookBody'); bb.innerHTML='';
  const bookData=JSON.parse(localStorage.getItem('al_book'))||[{n:'Mesin PCR',d:new Date().toISOString().split('T')[0],t:'08:00',u:'Admin',s:'Booking'}];
  bookData.forEach((item,idx)=>{
    bb.insertRow().innerHTML=`<td style="text-align:center;">${idx+1}</td><td><input type="text" class="cell-input text-left b-n" value="${item.n}" onchange="saveN()"></td><td><input type="date" class="cell-input b-d" value="${item.d}" onchange="saveN()"></td><td><input type="text" class="cell-input b-t" value="${item.t}" onchange="saveN()"></td><td><input type="text" class="cell-input b-u" value="${item.u}" onchange="saveN()"></td><td><select class="cell-select b-s" onchange="saveN()"><option ${item.s==='Booking'?'selected':''}>Booking</option></select></td><td></td>`;
    bb.rows[bb.rows.length-1].cells[6].appendChild(makeDel(()=>{ bookData.splice(idx,1); localStorage.setItem('al_book',JSON.stringify(bookData)); loadNeeds(); }));
  });
}
function addReqRow(){ const d=JSON.parse(localStorage.getItem('al_req'))||[]; d.push({n:'',q:'',u:'Normal',s:'Pending'}); localStorage.setItem('al_req',JSON.stringify(d)); loadNeeds(); }
function addBookRow(){ const d=JSON.parse(localStorage.getItem('al_book'))||[]; d.push({n:'',d:'',t:'',u:'',s:'Booking'}); localStorage.setItem('al_book',JSON.stringify(d)); loadNeeds(); }
function saveN(){
  let req=[]; document.querySelectorAll('#reqBody tr').forEach(r=>{ req.push({n:r.querySelector('.r-n').value,q:r.querySelector('.r-q').value,u:r.querySelector('.r-u').value,s:r.querySelector('.r-s').value}); }); localStorage.setItem('al_req',JSON.stringify(req));
  let book=[]; document.querySelectorAll('#bookBody tr').forEach(r=>{ book.push({n:r.querySelector('.b-n').value,d:r.querySelector('.b-d').value,t:r.querySelector('.b-t').value,u:r.querySelector('.b-u').value,s:r.querySelector('.b-s').value}); }); localStorage.setItem('al_book',JSON.stringify(book));
}

// ===================================================================
// EXPORTING & GLOBAL BACKUP
// ===================================================================
function getTableCSVString(tId, title) {
  let table = document.getElementById(tId);
  if (!table) {
    const aliasMap = {
      't-water': 'waterTable',
      't-invivo': 'invivoTable',
      't-health': 'healthTable',
      't-gonad': 'gonadTable',
      't-hatchery': 'hatcheryTable',
      't-pakan': 'feedTable',
      't-proksimat': 'proxTable',
      't-plk-dens': 'plkDensTable',
      't-eco': 'ecoTable',
      't-od': 'odTable',
      't-tpc': 'tpcTable',
      't-zona': 'zonaTable',
      't-gel': 'gelTable'
    };
    if (aliasMap[tId]) {
      table = document.getElementById(aliasMap[tId]);
    }
  }
  if (!table) return null;
  let csv = [];
  if (title) csv.push(`"# AREs Module: ${title}"`);
  csv.push(`"# Generated: ${new Date().toISOString()}"`);
  csv.push('');
  for (let r of table.rows) {
    if (r.style.display === 'none' || !r.cells.length) continue;
    let row = [];
    for (let c of r.cells) {
      if (c.querySelector('button.btn-icon') || c.style.display === 'none') continue;
      let inputEl = c.querySelector('input');
      let selectEl = c.querySelector('select');
      let val = inputEl ? inputEl.value : selectEl ? selectEl.value : c.innerText.trim();
      val = val.replace(/\r?\n|\r/g, ' ').replace(/"/g, '""');
      row.push(`"${val}"`);
    }
    if (row.length > 0) csv.push(row.join(','));
  }
  return csv.join('\r\n');
}

function exportCSV(tId, fn) {
  const csvContent = getTableCSVString(tId);
  if (!csvContent) {
    toast('Tabel tidak ditemukan.');
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
  a.download = fn || `export_${tId}.csv`;
  a.click();
  toast(`${fn || 'File'} berhasil diunduh.`);
}

function exportActiveTableCSV() {
  const activePane = document.querySelector('.tab-pane.active');
  if (!activePane) {
    exportCSV('invivoTable', '01_AquaLab_Performa_InVivo.csv');
    return;
  }
  const pid = activePane.id;
  if (pid === 'v-dashboard') {
    exportAllModulesZip();
  } else if (pid === 'v-invivo') {
    exportCSV('invivoTable', '01_AquaLab_Performa_InVivo.csv');
  } else if (pid === 'v-kesehatan') {
    exportCSV('healthTable', '02_AquaLab_Kesehatan_Ikan.csv');
  } else if (pid === 'v-gonad') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'gonad-hatchery') {
      exportCSV('hatcheryTable', '03b_AquaLab_Pembenihan_Hatchery.csv');
    } else {
      exportCSV('gonadTable', '03a_AquaLab_Kematangan_Gonad.csv');
    }
  } else if (pid === 'v-pakan') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'pakan-nutrisi') {
      exportCSV('proxTable', '04b_AquaLab_Analisis_Proksimat.csv');
    } else {
      exportCSV('feedTable', '04a_AquaLab_Formulasi_Pakan.csv');
    }
  } else if (pid === 'v-water') {
    exportCSV('waterTable', '05_AquaLab_Kualitas_Air.csv');
  } else if (pid === 'v-plankton') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'plk-eco') {
      exportCSV('ecoTable', '06b_AquaLab_Ekologi_Akuatik.csv');
    } else {
      exportCSV('plkDensTable', '06a_AquaLab_Plankton_Densitas.csv');
    }
  } else if (pid === 'v-microbio') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'mb-tpc') {
      exportCSV('tpcTable', '07b_AquaLab_Mikrobiologi_TPC.csv');
    } else if (subActive && subActive.id === 'mb-zona') {
      exportCSV('zonaTable', '07c_AquaLab_Zona_Hambat.csv');
    } else {
      exportCSV('odTable', '07a_AquaLab_Spektro_OD600.csv');
    }
  } else if (pid === 'v-invitro') {
    exportCSV('gelTable', '08_AquaLab_Elektroforesis_Gel_DNA.csv');
  } else if (pid === 'v-logbook') {
    exportCSV('logTable', '09_AquaLab_Logbook_Harian.csv');
  } else if (pid === 'v-inv') {
    exportCSV('invTable', '10_AquaLab_Inventaris_Bahan.csv');
  } else if (pid === 'v-needs') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'nd-book') {
      exportCSV('bookTable', '11b_AquaLab_Jadwal_Penggunaan_Alat.csv');
    } else {
      exportCSV('reqTable', '11a_AquaLab_Permintaan_Bahan.csv');
    }
  } else {
    exportCSV('invivoTable', 'AquaLab_Data_Aktif.csv');
  }
}

function addActiveRow() {
  const activePane = document.querySelector('.tab-pane.active');
  if (!activePane) {
    addInvivoRow();
    return;
  }
  const pid = activePane.id;
  if (pid === 'v-invivo') {
    addInvivoRow();
  } else if (pid === 'v-kesehatan') {
    addHealthRow();
  } else if (pid === 'v-gonad') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'gonad-hatchery') {
      addHatcheryRow();
    } else {
      addGonadRow();
    }
  } else if (pid === 'v-pakan') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'pakan-nutrisi') {
      addProksimatRow();
    } else {
      addPakanRow();
    }
  } else if (pid === 'v-water') {
    addWaterRow();
  } else if (pid === 'v-plankton') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'plk-eco') {
      addEcoRow();
    } else {
      addPlkDensRow();
    }
  } else if (pid === 'v-microbio') {
    const subActive = activePane.querySelector('.tab-pane.active');
    if (subActive && subActive.id === 'mb-tpc') {
      addTpcRow();
    } else if (subActive && subActive.id === 'mb-zona') {
      addZonaRow();
    } else {
      addOdRow();
    }
  } else if (pid === 'v-invitro') {
    addGelRow();
  } else if (pid === 'v-logbook') {
    const input = document.getElementById('logNotes');
    if (input) input.focus();
  } else {
    addInvivoRow();
  }
}

function saveAquaLabWorkspaceSnapshot() {
  try {
    const tableConfigs = [
      { id: 'invivoTable', bodyId: 'invivoBody' },
      { id: 'healthTable', bodyId: 'healthBody' },
      { id: 'gonadTable', bodyId: 'gonadBody' },
      { id: 'hatcheryTable', bodyId: 'hatcheryBody' },
      { id: 'feedTable', bodyId: 'feedBody' },
      { id: 'proxTable', bodyId: 'proxBody' },
      { id: 'waterTable', bodyId: 'waterBody' },
      { id: 'plkDensTable', bodyId: 'plkDensBody' },
      { id: 'ecoTable', bodyId: 'ecoBody' },
      { id: 'odTable', bodyId: 'odBody' },
      { id: 'tpcTable', bodyId: 'tpcBody' },
      { id: 'zonaTable', bodyId: 'zonaBody' },
      { id: 'gelTable', bodyId: 'gelBody' }
    ];

    const snapshot = {
      timestamp: new Date().toISOString(),
      tables: {},
      formFields: {}
    };

    tableConfigs.forEach(cfg => {
      const tbody = document.getElementById(cfg.bodyId);
      if (!tbody) return;
      const rowsData = [];
      for (let r of tbody.rows) {
        const rowInputs = [];
        for (let cell of r.cells) {
          const inp = cell.querySelector('input');
          const sel = cell.querySelector('select');
          if (inp) {
            rowInputs.push(inp.value);
          } else if (sel) {
            rowInputs.push(sel.value);
          }
        }
        if (rowInputs.length > 0) {
          rowsData.push(rowInputs);
        }
      }
      snapshot.tables[cfg.id] = rowsData;
    });

    const formIds = ['seqFwd', 'seqRev', 'seqTemplate', 'pcrSamples', 'vWater', 'vMix', 'vFwd', 'vRev'];
    formIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) snapshot.formFields[id] = el.value;
    });

    localStorage.setItem('aqualab_tables_snapshot', JSON.stringify(snapshot));

    if (typeof saveLog === 'function') saveLog();
    if (typeof saveInv === 'function') saveInv();
    if (typeof saveN === 'function') saveN();

    if (window.ARESStorageSync && typeof window.ARESStorageSync.notifyChange === 'function') {
      window.ARESStorageSync.notifyChange('aqualab_tables_snapshot');
    }

    return true;
  } catch (err) {
    console.error('Error saving AquaLab snapshot:', err);
    return false;
  }
}

function loadAquaLabWorkspaceSnapshot() {
  try {
    const raw = localStorage.getItem('aqualab_tables_snapshot');
    if (!raw) return false;
    const snapshot = JSON.parse(raw);
    if (!snapshot || !snapshot.tables) return false;

    const tableAddFns = {
      'invivoTable': { addFn: addInvivoRow, bodyId: 'invivoBody' },
      'healthTable': { addFn: addHealthRow, bodyId: 'healthBody' },
      'gonadTable': { addFn: addGonadRow, bodyId: 'gonadBody' },
      'hatcheryTable': { addFn: addHatcheryRow, bodyId: 'hatcheryBody' },
      'feedTable': { addFn: addPakanRow, bodyId: 'feedBody' },
      'proxTable': { addFn: addProksimatRow, bodyId: 'proxBody' },
      'waterTable': { addFn: addWaterRow, bodyId: 'waterBody' },
      'plkDensTable': { addFn: addPlkDensRow, bodyId: 'plkDensBody' },
      'ecoTable': { addFn: addEcoRow, bodyId: 'ecoBody' },
      'odTable': { addFn: addOdRow, bodyId: 'odBody' },
      'tpcTable': { addFn: addTpcRow, bodyId: 'tpcBody' },
      'zonaTable': { addFn: addZonaRow, bodyId: 'zonaBody' },
      'gelTable': { addFn: addGelRow, bodyId: 'gelBody' }
    };

    let hasRestored = false;
    Object.keys(snapshot.tables).forEach(tId => {
      const rowsData = snapshot.tables[tId];
      const cfg = tableAddFns[tId];
      if (!cfg || !Array.isArray(rowsData) || rowsData.length === 0) return;

      const tbody = document.getElementById(cfg.bodyId);
      if (!tbody) return;

      tbody.innerHTML = '';
      rowsData.forEach(vals => {
        cfg.addFn();
        const lastRow = tbody.rows[tbody.rows.length - 1];
        if (lastRow) {
          let valIdx = 0;
          for (let cell of lastRow.cells) {
            const inp = cell.querySelector('input');
            const sel = cell.querySelector('select');
            if (inp && valIdx < vals.length) {
              inp.value = vals[valIdx++];
              inp.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (sel && valIdx < vals.length) {
              sel.value = vals[valIdx++];
              sel.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }
      });
      hasRestored = true;
    });

    if (snapshot.formFields) {
      Object.keys(snapshot.formFields).forEach(fId => {
        const el = document.getElementById(fId);
        if (el) {
          el.value = snapshot.formFields[fId];
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }

    return hasRestored;
  } catch (err) {
    console.warn('Could not restore AquaLab snapshot:', err);
    return false;
  }
}

/**
 * Global 'Export All Modules' Button - triggers a zipped CSV download of all current research tables
 */
async function exportAllModulesZip() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const zipFileName = `AREs_Research_Database_Backup_${dateStr}.zip`;

  const tablesToExport = [
    { id: 't-water', filename: '01_AquaLab_Kualitas_Air.csv', title: 'Kualitas Air & Monitoring Fisika-Kimia' },
    { id: 't-invivo', filename: '02_AquaLab_Performa_InVivo.csv', title: 'Performa In Vivo & Biomassa (SR, SGR, FCR, EP)' },
    { id: 't-health', filename: '03_AquaLab_Kesehatan_Ikan.csv', title: 'Parameter Darah & Kesehatan Ikan' },
    { id: 't-gonad', filename: '04_AquaLab_Reproduksi_Gonad.csv', title: 'Kematangan Gonad & Fekunditas' },
    { id: 't-hatchery', filename: '05_AquaLab_Pembenihan_Hatchery.csv', title: 'Pembenihan & Fekunditas Telur' },
    { id: 't-pakan', filename: '06_AquaLab_Formulasi_Pakan.csv', title: 'Formulasi Pakan & Kebutuhan Nutrisi' },
    { id: 't-proksimat', filename: '07_AquaLab_Analisis_Proksimat.csv', title: 'Analisis Proksimat Pakan & Daging' },
    { id: 't-plk-dens', filename: '08_AquaLab_Plankton_Densitas.csv', title: 'Kepadatan & Diversitas Plankton' },
    { id: 't-eco', filename: '09_AquaLab_Ekologi_Akuatik.csv', title: 'Ekologi Akuatik & Kualitas Habitat' },
    { id: 't-od', filename: '10_AquaLab_Spektro_OD.csv', title: 'Kepadatan Optik & Spektrofotometri (OD600)' },
    { id: 't-tpc', filename: '11_AquaLab_Mikrobiologi_TPC.csv', title: 'Total Plate Count (TPC) Mikrobiologi' },
    { id: 't-zona', filename: '12_AquaLab_Uji_Antibakteri_Zona.csv', title: 'Uji Zona Hambat Antibakterial' },
    { id: 't-gel', filename: '13_AquaLab_Elektroforesis_Gel_DNA.csv', title: 'Elektroforesis Gel & Analisis Pita DNA' },
    { id: 'logTable', filename: '14_AquaLab_Logbook_Harian.csv', title: 'Logbook Harian Riset Laboratorium' },
    { id: 'invTable', filename: '15_AquaLab_Inventaris_Stok.csv', title: 'Inventaris Stok Bahan & Reagen Lab' },
    { id: 'reqTable', filename: '16_AquaLab_Permintaan_Bahan.csv', title: 'Daftar Kebutuhan & Permintaan Bahan' },
    { id: 'bookTable', filename: '17_AquaLab_Jadwal_Penggunaan_Alat.csv', title: 'Jadwal Pemesanan & Penggunaan Fasilitas' }
  ];

  let exportedCount = 0;
  const files = {};

  tablesToExport.forEach(item => {
    const content = getTableCSVString(item.id, item.title);
    if (content && content.length > 30) {
      files[item.filename] = content;
      exportedCount++;
    }
  });

  // Also include StatWise and EcoMetrics stored data if present in localStorage
  try {
    const swData = localStorage.getItem('sw_data');
    if (swData) {
      files['18_StatWise_Biometrika_Dataset.json'] = swData;
      exportedCount++;
    }
    const ecoData = localStorage.getItem('ecometrics_data') || localStorage.getItem('eco_matrix');
    if (ecoData) {
      files['19_EcoMetrics_Multivariat_Dataset.json'] = ecoData;
      exportedCount++;
    }
  } catch (e) {
    console.warn('Could not read external module localStorage', e);
  }

  // Add README manifest
  files['README_AREs_Backup.txt'] = `=================================================================
AQUACULTURE RESEARCH ECOSYSTEM (AREs)
Global Research Database & Multi-Module Offline Backup
=================================================================
Tanggal Ekspor : ${now.toLocaleString('id-ID')}
Total Tabel    : ${exportedCount} Modul Riset Terkompilasi
Peneliti Utama : Dandi Setio Wibowo
Afiliasi       : FPIK Universitas Jenderal Soedirman (UNSOED)
Sitasi DOI     : 10.5281/zenodo.20729217

DAFTAR FILE DALAM PAKET CADANGAN INI:
${Object.keys(files).map((f, i) => `  ${i + 1}. ${f}`).join('\r\n')}

PANDUAN PENGGUNAAN:
1. File .csv dapat dibuka langsung di Microsoft Excel, Google Sheets, R, Python (Pandas), SPSS, atau diimpor kembali ke ekosistem AREs.
2. Karakter encoding yang digunakan adalah UTF-8 standar internasional.
3. Seluruh komputasi data dieksekusi 100% offline di peramban (client-side).
=================================================================
`;

  try {
    if (typeof JSZip !== 'undefined') {
      const zip = new JSZip();
      for (const [filename, content] of Object.entries(files)) {
        zip.file(filename, content);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = zipFileName;
      a.click();
      toast(`📦 Berhasil mengekspor ${exportedCount} tabel ke dalam ${zipFileName}`);
      return;
    }
  } catch (err) {
    console.error('JSZip generation failed, falling back to pure-JS zip builder', err);
  }

  // Standalone Pure JavaScript Stored ZIP Generator Fallback
  try {
    const zipBlob = createStoredZipBlob(files);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(zipBlob);
    a.download = zipFileName;
    a.click();
    toast(`📦 Berhasil mengekspor ${exportedCount} tabel ke dalam ${zipFileName}`);
  } catch (e) {
    console.error('ZIP generation failed', e);
    // If ZIP fails completely, download individual core CSVs as fallback
    let delay = 0;
    for (const [fn, content] of Object.entries(files)) {
      if (fn.endsWith('.csv')) {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }));
          a.download = fn;
          a.click();
        }, delay);
        delay += 250;
      }
    }
    toast(`Mengekspor ${exportedCount} file CSV secara berurutan...`);
  }
}

// Pure JavaScript ZIP creator (Store compression, no external dependencies needed)
function createStoredZipBlob(filesObj) {
  const enc = new TextEncoder();
  const fileEntries = [];
  let offset = 0;

  for (const [name, content] of Object.entries(filesObj)) {
    const nameBytes = enc.encode(name);
    const contentBytes = enc.encode(content);
    const crc = crc32(contentBytes);
    const size = contentBytes.length;

    // Local file header (30 bytes + name + content)
    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); // Local header signature
    view.setUint16(4, 20, true);         // Version needed
    view.setUint16(6, 0, true);          // General purpose flags
    view.setUint16(8, 0, true);          // Compression (0 = store)
    view.setUint16(10, 0, true);         // Time
    view.setUint16(12, 0, true);         // Date
    view.setUint32(14, crc, true);        // CRC32
    view.setUint32(18, size, true);       // Compressed size
    view.setUint32(22, size, true);       // Uncompressed size
    view.setUint16(26, nameBytes.length, true); // Filename length
    view.setUint16(28, 0, true);         // Extra field length
    header.set(nameBytes, 30);

    fileEntries.push({
      header,
      contentBytes,
      nameBytes,
      crc,
      size,
      offset
    });

    offset += header.length + contentBytes.length;
  }

  // Central directory entries
  const cdEntries = [];
  let cdSize = 0;

  for (const f of fileEntries) {
    const cdHeader = new Uint8Array(46 + f.nameBytes.length);
    const view = new DataView(cdHeader.buffer);
    view.setUint32(0, 0x02014b50, true); // Central header signature
    view.setUint16(4, 20, true);         // Version made by
    view.setUint16(6, 20, true);         // Version needed
    view.setUint16(8, 0, true);          // Flags
    view.setUint16(10, 0, true);         // Compression
    view.setUint16(12, 0, true);         // Time
    view.setUint16(14, 0, true);         // Date
    view.setUint32(16, f.crc, true);     // CRC32
    view.setUint32(20, f.size, true);    // Compressed size
    view.setUint32(24, f.size, true);    // Uncompressed size
    view.setUint16(28, f.nameBytes.length, true); // Name len
    view.setUint16(30, 0, true);         // Extra len
    view.setUint16(32, 0, true);         // Comment len
    view.setUint16(34, 0, true);         // Disk start
    view.setUint16(36, 0, true);         // Internal attr
    view.setUint32(38, 0, true);         // External attr
    view.setUint32(42, f.offset, true);  // Local header relative offset
    cdHeader.set(f.nameBytes, 46);

    cdEntries.push(cdHeader);
    cdSize += cdHeader.length;
  }

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
  eocdView.setUint16(4, 0, true);          // Disk number
  eocdView.setUint16(6, 0, true);          // Disk with CD
  eocdView.setUint16(8, fileEntries.length, true);  // Entries on disk
  eocdView.setUint16(10, fileEntries.length, true); // Total entries
  eocdView.setUint32(12, cdSize, true);             // CD size
  eocdView.setUint32(16, offset, true);             // CD offset
  eocdView.setUint16(20, 0, true);                  // Comment len

  const parts = [];
  for (const f of fileEntries) {
    parts.push(f.header);
    parts.push(f.contentBytes);
  }
  for (const cd of cdEntries) {
    parts.push(cd);
  }
  parts.push(eocd);

  return new Blob(parts, { type: 'application/zip' });
}

// Simple fast CRC32 table calculator
const crcTable = (() => {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

window.saveAquaLabWorkspaceSnapshot = saveAquaLabWorkspaceSnapshot;
window.loadAquaLabWorkspaceSnapshot = loadAquaLabWorkspaceSnapshot;
window.exportActiveTableCSV = exportActiveTableCSV;
window.addActiveRow = addActiveRow;
window.exportAllModulesZip = exportAllModulesZip;

window.onload = function() {
  toggleWaterColumns(); 
  toggleHealthColumns(); 
  
  const restored = loadAquaLabWorkspaceSnapshot();
  if (!restored) {
    addInvivoRow(); addHealthRow(); addGonadRow(); addHatcheryRow(); addPakanRow(); addProksimatRow(); addPlkDensRow(); addEcoRow(); addWaterRow(); addOdRow(); addTpcRow(); addZonaRow(); addGelRow();
    const fwd = document.getElementById('seqFwd'); if (fwd) fwd.value = 'ATGCGTACGTAGCTAGCTA';
    const rev = document.getElementById('seqRev'); if (rev) rev.value = 'CGATGCTAGCTAGCTAGCT';
    const tpl = document.getElementById('seqTemplate'); if (tpl) tpl.value = 'ATGCGTACGTAGCTAGCTATTCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGAGCTAGCTAGCTAGCATCG';
    analyzePrimer();
    const ps = document.getElementById('pcrSamples'); if (ps) ps.value = '10';
    const vw = document.getElementById('vWater'); if (vw) vw.value = '8.5';
    const vm = document.getElementById('vMix'); if (vm) vm.value = '12.5';
    const vf = document.getElementById('vFwd'); if (vf) vf.value = '1';
    const vr = document.getElementById('vRev'); if (vr) vr.value = '1';
    calcPCR();
    updateTemplateVol();
  } else {
    analyzePrimer();
    calcPCR();
    updateTemplateVol();
  }

  loadLogbook(); loadInventory(); loadNeeds();

  // Register with ARES Keyboard Shortcuts
  if (window.ARESShortcuts) {
    window.ARESShortcuts.on('save', saveAquaLabWorkspaceSnapshot);
    window.ARESShortcuts.on('export', exportActiveTableCSV);
    window.ARESShortcuts.on('exportAll', exportAllModulesZip);
    window.ARESShortcuts.on('newRow', addActiveRow);
  }
};

