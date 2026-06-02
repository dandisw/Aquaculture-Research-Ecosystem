// ==========================================
// UI RESPONSIVE & STATE LOGIC
// ==========================================
function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.querySelector('.sidebar-overlay');
    sb.classList.toggle('open');
    ov.classList.toggle('open');
}

function toggleTheme() {
  const html = document.documentElement; const btn = document.getElementById('theme-btn');
  if (html.getAttribute('data-theme') === 'dark') { 
      html.setAttribute('data-theme', 'light'); 
      btn.innerHTML = '<span class="dsw-icon-styled">🌙</span> <span class="btn-text">Mode Gelap</span>'; 
  } 
  else { 
      html.setAttribute('data-theme', 'dark'); 
      btn.innerHTML = '<span class="dsw-icon-styled">☀️</span> <span class="btn-text">Mode Terang</span>'; 
  }
}

const S = { rows: 25, cols: 2, vars: [{ name: 'Perlakuan', type: 'nominal', role: 'factor', values: '' }, { name: 'Hasil', type: 'scale', role: 'dep', values: '' }], data: [] };

function init() { for(let r=0; r<S.rows; r++) S.data.push(Array(S.cols).fill('')); renderAll(); }
function renderAll() { renderDataHead(); renderDataBody(); renderVarBody(); }
function switchView(view) {
  document.getElementById('tab-data').classList.toggle('active', view === 'data'); document.getElementById('tab-var').classList.toggle('active', view === 'var');
  document.getElementById('view-data').classList.toggle('active', view === 'data'); document.getElementById('view-var').classList.toggle('active', view === 'var');
  if(view === 'data') renderDataHead();
}
function clearAll() {
  S.cols = 2; S.data = Array.from({length: S.rows}, () => Array(S.cols).fill(''));
  S.vars = [{ name: 'Perlakuan', type: 'nominal', role: 'factor', values: '' }, { name: 'Hasil', type: 'scale', role: 'dep', values: '' }];
  clearReport(); renderAll();
}
function clearReport() { document.getElementById('res-content-area').innerHTML = ''; }
function removeBlock(btn) { btn.closest('.report-block').remove(); }

// ABOUT DIALOG LOGIC
function openAboutDialog() { document.getElementById('about-dialog').classList.add('active'); }
function closeAboutDialog() { document.getElementById('about-dialog').classList.remove('active'); }
function switchAboutTab(tabId) {
    document.querySelectorAll('.about-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.about-section').forEach(s => s.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('sec-' + tabId).classList.add('active');
}

// ==========================================
// CSV DOWNLOAD
// ==========================================
function downloadCSV() {
    let csv = S.vars.map(v => v.name).join(",") + "\n";
    S.data.forEach(row => { csv += row.map(cell => `"${cell}"`).join(",") + "\n"; });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "StatWise_Data.csv";
    link.style.display = 'none'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

// ==========================================
// RENDER DATA & VAR VIEW
// ==========================================
function renderDataHead() {
  const tr = document.createElement('tr'); tr.innerHTML = `<th class="row-index">#</th>`;
  S.vars.forEach(v => { const icon = v.type === 'scale' ? '∑' : v.type === 'nominal' ? 'A' : '◈'; tr.innerHTML += `<th>${icon} ${v.name}</th>`; });
  document.getElementById('data-head').innerHTML = ''; document.getElementById('data-head').appendChild(tr);
}
function renderDataBody() {
  const tbody = document.getElementById('data-body'); tbody.innerHTML = '';
  for(let r=0; r<S.rows; r++) {
    const tr = document.createElement('tr'); tr.innerHTML = `<td class="row-index">${r+1}</td>`;
    for(let c=0; c<S.cols; c++) {
      const td = document.createElement('td'), inp = document.createElement('input');
      inp.type = 'text'; inp.className = 'cell-input'; inp.value = S.data[r][c]; inp.dataset.r = r; inp.dataset.c = c;
      inp.oninput = function() { S.data[r][c] = this.value; validateCell(this, c); };
      inp.onkeydown = (e) => handleGridNav(e, r, c); inp.onpaste = (e) => handlePaste(e, r, c);
      validateCell(inp, c); td.appendChild(inp); tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}
function validateCell(inp, c) { if(S.vars[c].type === 'scale' && inp.value !== '') inp.classList.toggle('invalid', isNaN(parseFloat(inp.value.replace(',','.')))); else inp.classList.remove('invalid'); }
function handleGridNav(e, r, c) {
  let nr = r, nc = c, nav = false; 
  if(e.key === 'ArrowDown' || e.key === 'Enter') { e.preventDefault(); nr++; nav = true; } else if(e.key === 'ArrowUp') { e.preventDefault(); nr--; nav = true; }
  else if(e.key === 'Tab') { e.preventDefault(); nc++; if(nc >= S.cols) { nc = 0; nr++; } nav = true; }
  if(nav && nr >= 0 && nr < S.rows && nc >= 0 && nc < S.cols) { const next = document.querySelector(`input[data-r="${nr}"][data-c="${nc}"]`); if(next) { next.focus(); next.select(); } }
}
function handlePaste(e, startR, startC) {
  e.preventDefault(); const text = (e.clipboardData || window.clipboardData).getData('text');
  const rows = text.trim().split(/\r?\n/).map(row => row.split(/\t/));
  if(startR + rows.length > S.rows) addRows(startR + rows.length - S.rows);
  if(startC + Math.max(...rows.map(r=>r.length)) > S.cols) addColumns(startC + Math.max(...rows.map(r=>r.length)) - S.cols);
  rows.forEach((row, ri) => { row.forEach((val, ci) => { if(startR+ri < S.rows && startC+ci < S.cols) S.data[startR+ri][startC+ci] = val.replace(',','.'); }); });
  renderDataBody();
}
function addRows(n) { for(let i=0; i<n; i++) S.data.push(Array(S.cols).fill('')); S.rows += n; renderDataBody(); }
function addColumns(n) { for(let i=0; i<n; i++) { S.vars.push({name: `Var_${S.cols+1}`, type: 'scale', role: 'none', values: ''}); S.data.forEach(row => row.push('')); S.cols++; } renderAll(); }
function renderVarBody() {
  const tbody = document.getElementById('var-body'); tbody.innerHTML = '';
  S.vars.forEach((v, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="row-index">${i+1}</td>
      <td><input class="var-input" style="font-weight:600; color:var(--primary)" value="${v.name}" onchange="S.vars[${i}].name=this.value"></td>
      <td><select class="var-input" onchange="S.vars[${i}].type=this.value"><option value="scale" ${v.type==='scale'?'selected':''}>∑ Numerik</option><option value="nominal" ${v.type==='nominal'?'selected':''}>A Nominal</option><option value="ordinal" ${v.type==='ordinal'?'selected':''}>◈ Ordinal</option></select></td>
      <td><select class="var-input" onchange="S.vars[${i}].role=this.value"><option value="none" ${v.role==='none'?'selected':''}>— Tdk Tentu</option><option value="dep" ${v.role==='dep'?'selected':''}>Target (Y)</option><option value="factor" ${v.role==='factor'?'selected':''}>Faktor (X)</option></select></td>
      <td><input class="var-input" placeholder="1=Kontrol, 2=Pakan" value="${v.values}" onchange="S.vars[${i}].values=this.value"></td>`;
    tbody.appendChild(tr);
  });
}
function getMappedLabel(varIdx, rawValue) {
  const valStr = String(rawValue).trim(), mapStr = S.vars[varIdx].values; if(!mapStr) return valStr;
  for(let pair of mapStr.split(',').map(p => p.trim())) { const parts = pair.split('='); if(parts.length === 2 && parts[0].trim() === valStr) return parts[1].trim(); }
  return valStr;
}
function extractGroups(depIdx, facIdx) {
  const groupsObj = {};
  for(let r=0; r<S.rows; r++) {
    const yVal = parseFloat(String(S.data[r][depIdx]).replace(',','.')); const xRaw = S.data[r][facIdx];
    if(isNaN(yVal) || xRaw === '' || xRaw === undefined) continue;
    const xLabel = getMappedLabel(facIdx, xRaw); if(!groupsObj[xLabel]) groupsObj[xLabel] = []; groupsObj[xLabel].push(yVal);
  }
  const names = Object.keys(groupsObj).sort(); return { groups: names.map(n => groupsObj[n]), names };
}
function extractPair(idx1, idx2) {
  let a1=[], a2=[];
  for(let r=0; r<S.rows; r++){
      let v1 = parseFloat(String(S.data[r][idx1]).replace(',','.')), v2 = parseFloat(String(S.data[r][idx2]).replace(',','.'));
      if(!isNaN(v1) && !isNaN(v2)) { a1.push(v1); a2.push(v2); }
  }
  return {a1, a2};
}

// ==========================================
// COPY TO CLIPBOARD TSV
// ==========================================
function copyTableToClipboard(btn) {
  const table = btn.nextElementSibling; if(!table || table.tagName !== 'TABLE') return; let text = "";
  for (let row of table.rows) { let rD = []; for (let cell of row.cells) rD.push(cell.innerText.trim()); text += rD.join('\t') + '\n'; }
  navigator.clipboard.writeText(text).then(() => { const oldText = btn.innerHTML; btn.innerHTML = "✅ Tersalin!"; btn.style.color = "var(--success)"; setTimeout(() => { btn.innerHTML = oldText; btn.style.color = ""; }, 2000); });
}
function generateTable(htmlContent) { return `<div class="tbl-container"><button class="btn btn-outline btn-sm copy-btn" onclick="copyTableToClipboard(this)"><span class="dsw-icon-styled">📋</span> Salin Tabel</button>${htmlContent}</div>`; }

// ==========================================
// CORE MATH ENGINE 10.0 (MATRIX, LILLIEFORS, EXACT MW)
// ==========================================
const mean = a => a.reduce((s,v)=>s+v,0)/a.length;
const variance = (a,s=true) => { const m=mean(a); return a.reduce((t,v)=>t+(v-m)**2,0)/(a.length-(s?1:0)); };
const std = (a,s=true) => Math.sqrt(variance(a,s));
const median = a => { const s=[...a].sort((x,y)=>x-y), m=Math.floor(s.length/2); return s.length%2 ? s[m] : (s[m-1]+s[m])/2; };
const skewness = a => { const n=a.length,m=mean(a),s=std(a); if(s===0||n<3) return 0; return (n/((n-1)*(n-2))) * a.reduce((t,v) => t + ((v-m)/s)**3, 0); };
const kurtosis = a => { const n=a.length,m=mean(a),s=std(a); if(s===0||n<4) return 0; const g2=a.reduce((t,v) => t + ((v-m)/s)**4, 0); return ((n*(n+1))/((n-1)*(n-2)*(n-3)))*g2 - 3*(n-1)**2/((n-2)*(n-3)); };
const fmt  = (v, d=3) => (!isFinite(v) || isNaN(v)) ? '—' : v.toFixed(d);
const fmtp = p => (!isFinite(p) || isNaN(p) || p < 0) ? '—' : (p < 0.001 ? '< 0.001' : p.toFixed(3));

function logGamma(z) {
    let c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -0.000005395239384953];
    let sum = 1.000000000190015; for (let i = 0; i < 6; i++) sum += c[i] / (z + i + 1);
    return Math.log(2.5066282746310005 * sum / z) + (z + 0.5) * Math.log(z + 5.5) - (z + 5.5);
}
function betacf(x, a, b) {
    let fpMin = 1e-30, m = 1, qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < fpMin) d = fpMin; d = 1 / d; let h = d;
    for (; m <= 100; m++) {
        let m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < fpMin) d = fpMin; c = 1 + aa / c; if (Math.abs(c) < fpMin) c = fpMin;
        d = 1 / d; h *= d * c; aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < fpMin) d = fpMin; c = 1 + aa / c; if (Math.abs(c) < fpMin) c = fpMin;
        d = 1 / d; let del = d * c; h *= del; if (Math.abs(del - 1) < 3e-7) break;
    } return h;
}
function betainc(x, a, b) {
    if (x === 0 || x === 1) return x; let bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(x, a, b) / a : 1 - bt * betacf(1 - x, b, a) / b;
}
function gammaUpperReg(a, x) {
    if (x <= 0) return 1;
    if (x < a + 1) { let ap = a, sum = 1/a, del = 1/a; for (let n = 1; n <= 300; n++) { ap++; del *= x/ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-10) break; } return Math.max(0, 1 - Math.exp(-x + a*Math.log(x) - logGamma(a)) * sum); } 
    else { let b = x + 1 - a, c = 1e30, d = 1/b, h = d; for (let i = 1; i <= 300; i++) { const an = -i * (i - a); b += 2; d = an*d + b; if (Math.abs(d) < 1e-30) d = 1e-30; c = b + an/c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1/d; h *= d*c; if (Math.abs(d*c - 1) < 1e-10) break; } return Math.max(0, Math.exp(-x + a*Math.log(x) - logGamma(a)) * h); }
}
function chiSquareSF(x, df) { return x <= 0 ? 1 : gammaUpperReg(df/2, x/2); }
function fPVal(f, df1, df2) { return f <= 0 ? 1 : betainc(df2 / (df2 + df1 * f), df2 / 2, df1 / 2); }
function normalCDF(x) {
    const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
    const sign = x < 0 ? -1 : 1; const xAbs = Math.abs(x) / Math.SQRT2; const t = 1 / (1 + p * xAbs);
    const y = 1 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1) * t * Math.exp(-xAbs * xAbs); return 0.5 * (1 + sign * y);
}
function qnorm(p) {
    const a=[-39.69683,220.946,-275.9285,138.3577,-30.66479,2.506628],b=[-54.47609,161.5858,-155.6989,66.80131,-13.28068],c=[-0.00778489,-0.3223964,-2.400758,-2.549732,4.374664,2.938163],d=[0.00778469,0.3224671,2.445134,3.754408];
    if(p<.02425){const q=Math.sqrt(-2*Math.log(p));return(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
    if(p<=.97575){const q=p-.5,r=q*q;return(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);}
    const q=Math.sqrt(-2*Math.log(1-p));return-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
}
function tDistPVal(t, df) { return betainc(df / (df + t * t), df / 2, 0.5); }
function tukeyPVal(q, k, df) {
    if (q <= 0) return 1; if (!isFinite(q) || df <= 0) return 0;
    const GLX = [0.09501251,0.28160355,0.45801678,0.61787624,0.75540441,0.86563120,0.94457502,0.98940093], GLW = [0.18945061,0.18260342,0.16915652,0.14959599,0.12462897,0.09515851,0.06225352,0.02715246];
    const logC = logGamma((df+1)/2) - logGamma(df/2) - 0.5*Math.log(Math.PI*df);
    function integrand(z) { const d = normalCDF(z) - normalCDF(z - q); return d <= 0 ? 0 : Math.exp(logC - ((df+1)/2)*Math.log(1 + z*z/df)) * Math.pow(d, k - 1); }
    let cdf = 0;
    for (const [a,b] of [[-7,-4],[-4,-1],[-1,2],[2,5],[5,7]]) { const mid = (a+b)/2, half = (b-a)/2; let s = 0; for (let i = 0; i < GLX.length; i++) s += GLW[i] * (integrand(mid + half*GLX[i]) + integrand(mid - half*GLX[i])); cdf += half * s; }
    return Math.max(0.0001, Math.min(0.9999, 1 - k*cdf));
}

// MATRIX SOLVER FOR GLM TYPE III
function matrixMultiply(A, B) {
    let result = new Array(A.length).fill(0).map(() => new Array(B[0].length).fill(0));
    return result.map((row, i) => row.map((val, j) => A[i].reduce((sum, elm, k) => sum + elm * B[k][j], 0)));
}
function matrixTranspose(A) { return A[0].map((_, colIndex) => A.map(row => row[colIndex])); }
function matrixInvert(M) {
    let i=0, ii=0, j=0, dim=M.length, e=0, t=0; let I = [], C = [];
    for(i=0; i<dim; i+=1){ I[i]=[]; C[i]=[]; for(j=0; j<dim; j+=1){ if(i===j) I[i][j] = 1; else I[i][j] = 0; C[i][j] = M[i][j]; } }
    for(i=0; i<dim; i+=1){ e = C[i][i]; if(e===0){ for(ii=i+1; ii<dim; ii+=1){ if(C[ii][i] !== 0){ for(j=0; j<dim; j++){ e = C[i][j]; C[i][j] = C[ii][j]; C[ii][j] = e; e = I[i][j]; I[i][j] = I[ii][j]; I[ii][j] = e; } break; } } e = C[i][i]; if(e===0) return false; }
        for(j=0; j<dim; j++){ C[i][j] = C[i][j]/e; I[i][j] = I[i][j]/e; }
        for(ii=0; ii<dim; ii++){ if(ii===i) continue; e = C[ii][i]; for(j=0; j<dim; j++){ C[ii][j] -= e*C[i][j]; I[ii][j] -= e*I[i][j]; } } } return I;
}
function exactMW_pVal(U, n1, n2) {
    let dp = new Array(n1 + 1).fill(0).map(() => new Array(n2 + 1).fill(0).map(() => new Array(U + 1).fill(0)));
    for (let j = 0; j <= n2; j++) dp[0][j][0] = 1; for (let i = 0; i <= n1; i++) dp[i][0][0] = 1;
    for (let i = 1; i <= n1; i++) { for (let j = 1; j <= n2; j++) { for (let k = 0; k <= U; k++) { dp[i][j][k] = dp[i-1][j][k]; if (k >= j) dp[i][j][k] += dp[i][j-1][k - j]; } } }
    let sum = 0; for(let k=0; k<=U; k++) sum += dp[n1][n2][k];
    let totalCombinations = 1; for(let i=1; i<=n1; i++) totalCombinations = (totalCombinations * (n2+i)) / i;
    return sum / totalCombinations;
}

// Statistical Tests Core
function shapiroWilk(data) {
    const x = [...data].sort((a,b) => a-b), n = x.length; if (n < 3) return { W: null, p: null };
    const m = x.map((_, i) => qnorm((i + 1 - 0.375) / (n + 0.25))), mn = Math.sqrt(m.reduce((s, v) => s + v*v, 0)), a = m.map(v => v / mn);
    let b = 0; for (let i = 0; i < Math.floor(n/2); i++) b += a[n-1-i] * (x[n-1-i] - x[i]);
    const xm = mean(x), ss = x.reduce((s, v) => s + (v-xm)**2, 0); if (ss <= 1e-10) return { W: 1, p: 0 }; 
    const W = Math.min(Math.max((b*b)/ss, 1e-6), 1-1e-6); let mu, sig, y;
    if (n === 3) return { W, p: Math.max(0.0001, Math.min(0.9999, (6/Math.PI) * (Math.asin(Math.sqrt(W)) - Math.asin(Math.sqrt(0.75))))) };
    if (n <= 11) { mu = 0.544 - 0.39978*n + 0.025054*n*n - 0.0006714*n*n*n; sig = Math.exp(1.3822 - 0.77857*n + 0.062767*n*n - 0.0020322*n*n*n); y = Math.log(1 - W); } 
    else { const u = Math.log(n); mu = -1.2725 + u*(-1.052 + u*(-0.1882 + u* 0.01682)); sig = Math.exp(-1.669 + u*(-0.3655 + u* 0.04834)); y = Math.log(1 - W); }
    return { W, p: Math.max(0.0001, Math.min(0.9999, 1 - normalCDF((y - mu) / sig))) };
}
function ksTest(data){
    const n=data.length, s=[...data].sort((a,b)=>a-b), m=mean(data), sd=std(data); let D=0;
    for(let i=0;i<n;i++){ const Fi=normalCDF((s[i]-m)/sd); D=Math.max(D, Math.abs((i+1)/n-Fi), Math.abs(i/n-Fi)); }
    if(n < 4) return {D, p: 0.1}; 
    let pVal = 0; let c = D * (Math.sqrt(n) - 0.01 + 0.85 / Math.sqrt(n));
    if (c > 1.308) pVal = Math.exp(-7.326 * c + 5.568); else if (c > 1) pVal = Math.exp(-2.95 * c + 1.25); else if (c > 0.83) pVal = Math.exp(-1.42 * c * c - 0.52); else pVal = 0.2; 
    return { D, p: Math.max(0.0001, Math.min(pVal, 0.9999)) };
}
function leveneTest(groups, centerType = 'median'){
    const k=groups.length, allN=groups.map(g=>g.length), N=allN.reduce((a,b)=>a+b,0);
    const centers = groups.map(g => centerType === 'mean' ? mean(g) : median(g));
    const Z=groups.map((g,i)=>g.map(v=>Math.abs(v-centers[i]))); const Zm=Z.map(z=>mean(z)), Zg=mean(Z.flat());
    const SSB=allN.reduce((acc,ni,i)=>acc+ni*(Zm[i]-Zg)**2,0), SSW=Z.reduce((acc,z,i)=>acc+z.reduce((a,b)=>a+(b-Zm[i])**2,0),0);
    const df1=k-1, df2=N-k, F=(SSB/df1)/(SSW/df2); return {F,df1,df2,p:fPVal(F,df1,df2), method: centerType};
}
function bartlettTest(groups) {
    const k = groups.length; let N = 0, num = 0, sumInv = 0, sumLnVar = 0;
    for (let g of groups) { const n = g.length; if (n < 2) continue; const v = variance(g, true); if (v <= 0) return { chi2: 0, p: 1, df: k-1 }; N += n; num += (n - 1) * v; sumInv += 1 / (n - 1); sumLnVar += (n - 1) * Math.log(v); }
    if (N - k <= 0) return { chi2: 0, p: 1, df: k-1 };
    const pooledVar = num / (N - k), chi2_num = (N - k) * Math.log(pooledVar) - sumLnVar, C = 1 + (1 / (3 * (k - 1))) * (sumInv - 1 / (N - k));
    const chi2 = chi2_num / C, df = k - 1; return { chi2, df, p: chiSquareSF(chi2, df) };
}
function oneWayAnova(groups){
    const k=groups.length, allN=groups.map(g=>g.length), N=allN.reduce((a,b)=>a+b,0), gm=mean(groups.flat()), gms=groups.map(g=>mean(g));
    const SSB=allN.reduce((acc,ni,i)=>acc+ni*(gms[i]-gm)**2,0), SSW=groups.reduce((acc,g,i)=>acc+g.reduce((a,v)=>a+(v-gms[i])**2,0),0);
    const dfB=k-1, dfW=N-k, MSB=SSB/dfB, MSW=SSW/dfW, F=MSB/MSW; return {F,dfB,dfW,p:fPVal(F,dfB,dfW),SSB,SSW,SST:SSB+SSW,MSB,MSW,eta2:SSB/(SSB+SSW),groupMeans:gms};
}
function twoWayAnovaType3(depIdx, fac1Idx, fac2Idx) {
    let data=[], levels1 = new Set(), levels2 = new Set(), N=0;
    for(let r=0; r<S.rows; r++) {
        let y = parseFloat(String(S.data[r][depIdx]).replace(',','.')); let f1 = S.data[r][fac1Idx], f2 = S.data[r][fac2Idx];
        if(isNaN(y) || f1==='' || f1===undefined || f2==='' || f2===undefined) continue;
        f1 = getMappedLabel(fac1Idx, f1); f2 = getMappedLabel(fac2Idx, f2);
        levels1.add(f1); levels2.add(f2); data.push({y, f1, f2}); N++;
    }
    let L1 = Array.from(levels1).sort(), L2 = Array.from(levels2).sort(); let a = L1.length, b = L2.length; if(a < 2 || b < 2) return null;
    let X = [], Y = [];
    data.forEach(d => {
        let row = [1];
        for(let i=0; i<a-1; i++) row.push(d.f1 === L1[i] ? 1 : (d.f1 === L1[a-1] ? -1 : 0));
        for(let j=0; j<b-1; j++) row.push(d.f2 === L2[j] ? 1 : (d.f2 === L2[b-1] ? -1 : 0));
        for(let i=0; i<a-1; i++){ for(let j=0; j<b-1; j++){ let eA = (d.f1 === L1[i] ? 1 : (d.f1 === L1[a-1] ? -1 : 0)); let eB = (d.f2 === L2[j] ? 1 : (d.f2 === L2[b-1] ? -1 : 0)); row.push(eA * eB); } }
        X.push(row); Y.push([d.y]);
    });
    let XT = matrixTranspose(X); let XTX = matrixMultiply(XT, X); let XTY = matrixMultiply(XT, Y);
    let XTX_inv = matrixInvert(XTX); if(!XTX_inv) return null; let Beta = matrixMultiply(XTX_inv, XTY);
    let Y_pred = matrixMultiply(X, Beta); let SSE = 0; let SST = 0; let yMean = mean(data.map(d=>d.y));
    for(let i=0; i<N; i++) { SSE += Math.pow(Y[i][0] - Y_pred[i][0], 2); SST += Math.pow(Y[i][0] - yMean, 2); }
    let dfA = a-1, dfB = b-1, dfAB = (a-1)*(b-1), dfE = N - (a*b); let MSE = SSE / dfE;
    const getSS = (startIdx, dfVar) => {
        let L = new Array(dfVar).fill(0).map(()=>new Array(Beta.length).fill(0)); for(let i=0; i<dfVar; i++) L[i][startIdx+i] = 1;
        let LB = matrixMultiply(L, Beta); let LT = matrixTranspose(L); let L_XTXinv_LT = matrixMultiply(matrixMultiply(L, XTX_inv), LT);
        let L_inv = matrixInvert(L_XTXinv_LT); if(!L_inv) return 0;
        let SS_mat = matrixMultiply(matrixMultiply(matrixTranspose(LB), L_inv), LB); return SS_mat[0][0];
    };
    let SSA = getSS(1, dfA), SSB = getSS(1+dfA, dfB), SSAB = getSS(1+dfA+dfB, dfAB);
    let MSA = SSA/dfA, MSB = SSB/dfB, MSAB = SSAB/dfAB; let FA = MSA/MSE, FB = MSB/MSE, FAB = MSAB/MSE;
    return { SSA, SSB, SSAB, SSE, SST, dfA, dfB, dfAB, dfE, MSA, MSB, MSAB, MSE, FA, FB, FAB, pA: fPVal(FA, dfA, dfE), pB: fPVal(FB, dfB, dfE), pAB: fPVal(FAB, dfAB, dfE) };
}
function kruskalWallis(groups){
    const allVals=groups.flatMap((g,i)=>g.map(v=>({v,g:i}))); allVals.sort((a,b)=>a.v-b.v);
    let rank=1, tieSum = 0; 
    for(let i=0;i<allVals.length;){
        let j=i; while(j<allVals.length && allVals[j].v===allVals[i].v) j++; const t = j - i; if(t > 1) tieSum += (Math.pow(t, 3) - t); 
        const avgRank=(rank+rank+j-i-1)/2; for(let k=i;k<j;k++) allVals[k].rank=avgRank; rank += t; i=j;
    }
    const N=allVals.length; const rankSums=groups.map((_,i)=>allVals.filter(x=>x.g===i).reduce((s,x)=>s+x.rank,0));
    let H=12/(N*(N+1))*groups.reduce((s,g,i)=>s+rankSums[i]**2/g.length,0)-3*(N+1);
    const tieAdj = 1 - tieSum / (Math.pow(N, 3) - N); if(tieAdj > 1e-10) H = H / tieAdj; else H = 0;
    return{H, df:groups.length-1, p:Math.max(0,Math.min(1,chiSquareSF(H, groups.length-1))), rankSums, meanRanks:groups.map((g,i)=>rankSums[i]/g.length), tieSum, N};
}
function mannWhitney(g1, g2, tail) {
    const n1 = g1.length, n2 = g2.length, N = n1 + n2;
    const all = [...g1.map(v=>({v,g:1})), ...g2.map(v=>({v,g:2}))]; all.sort((a,b) => a.v - b.v);
    let r = 1, tieSum = 0;
    for (let i = 0; i < all.length;) {
        let j = i; while (j < all.length && all[j].v === all[i].v) j++; const t = j - i; if (t > 1) tieSum += t*t*t - t;
        const avg = (r + r + t - 1) / 2; for (let k = i; k < j; k++) all[k].rank = avg; r += t; i = j;
    }
    const R1 = all.filter(x=>x.g===1).reduce((s,x)=>s+x.rank, 0), R2 = all.filter(x=>x.g===2).reduce((s,x)=>s+x.rank, 0);
    const U1 = R1 - n1*(n1+1)/2, U2 = n2*n1 - U1, U = Math.min(U1,U2), meanU = n1*n2/2;
    let p, exact = false;
    if(n1 <= 15 && n2 <= 15 && tieSum === 0) {
        exact = true; p = exactMW_pVal(U, n1, n2); if(tail === 'two') p = Math.min(1, 2*p);
    } else {
        const sdU = Math.sqrt(Math.max((n1*n2/12) * ((N+1) - tieSum/(N*(N-1))), 0));
        let Z_num = U1 - meanU; if (Z_num > 0) Z_num -= 0.5; else if (Z_num < 0) Z_num += 0.5;
        const z = sdU > 1e-10 ? Z_num / sdU : 0;
        p = tail === 'two' ? 2 * normalCDF(-Math.abs(z)) : tail === 'left' ? normalCDF(z) : 1 - normalCDF(z);
    }
    return { U1, U2, U, p: Math.max(0, Math.min(p, 1)), R1, R2, n1, n2, exact };
}
function tTestIndep(g1, g2) {
    let n1 = g1.length, n2 = g2.length, m1 = mean(g1), m2 = mean(g2), v1 = variance(g1), v2 = variance(g2);
    let sp = Math.sqrt(((n1-1)*v1 + (n2-1)*v2) / (n1+n2-2)), tStd = (m1 - m2) / (sp * Math.sqrt(1/n1 + 1/n2)), dfStd = n1+n2-2;
    let seW = Math.sqrt(v1/n1 + v2/n2), tWelch = (m1 - m2) / seW, dfWelch = Math.pow(v1/n1 + v2/n2, 2) / (Math.pow(v1/n1, 2)/(n1-1) + Math.pow(v2/n2, 2)/(n2-1));
    return { m1, m2, tStd, dfStd, pStd: 2*(1-tDistPVal(Math.abs(tStd), dfStd)), tWelch, dfWelch, pWelch: 2*(1-tDistPVal(Math.abs(tWelch), dfWelch)) };
}
function tTestPaired(a1, a2) {
    let n = a1.length, diffs = a1.map((v,i) => v - a2[i]), md = mean(diffs), sd = std(diffs);
    let t = md / (sd / Math.sqrt(n)), df = n-1; return { md, sd, t, df, p: 2*(1-tDistPVal(Math.abs(t), df)) };
}
function wilcoxonSignedRank(a1, a2) {
    let diffs = a1.map((v,i) => v - a2[i]).filter(d => d !== 0); let n = diffs.length; if (n === 0) return { W: 0, z: 0, p: 1 };
    let absDiffs = diffs.map((d,i) => ({d, abs: Math.abs(d), idx: i})).sort((a,b) => a.abs - b.abs); let r = 1, tieSum = 0;
    for (let i = 0; i < n;) { let j = i; while (j < n && absDiffs[j].abs === absDiffs[i].abs) j++; const t = j - i; if (t > 1) tieSum += t*t*t - t; const avg = (r + r + t - 1) / 2; for (let k = i; k < j; k++) absDiffs[k].rank = avg; r += t; i = j; }
    let Wpos = 0, Wneg = 0; absDiffs.forEach(obj => { if(obj.d > 0) Wpos += obj.rank; else Wneg += obj.rank; });
    let W = Math.min(Wpos, Wneg), meanW = n*(n+1)/4, sdW = Math.sqrt(n*(n+1)*(2*n+1)/24 - tieSum/48), z = (W - meanW + 0.5) / sdW;
    return { W, z, p: 2 * normalCDF(-Math.abs(z)), Wpos, Wneg };
}
function pearsonReg(x, y) {
    let n = x.length, mx = mean(x), my = mean(y), num = 0, denX = 0, denY = 0;
    for(let i=0; i<n; i++) { let dx = x[i]-mx, dy = y[i]-my; num += dx*dy; denX += dx*dx; denY += dy*dy; }
    let r = num / Math.sqrt(denX * denY), t = r * Math.sqrt((n-2)/(1-r*r)), slope = num / denX, intercept = my - slope*mx;
    return { r, p: 2 * (1 - tDistPVal(Math.abs(t), n-2)), r2: r*r, slope, intercept, t, df: n-2 };
}
function spearman(x, y) {
    const rank = arr => { let s = arr.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v), r = 1; for(let i=0; i<s.length;) { let j=i; while(j<s.length && s[j].v===s[i].v) j++; let avg=(r+r+j-i-1)/2; for(let k=i;k<j;k++) s[k].rank=avg; r+=j-i; i=j; } let res = new Array(arr.length); s.forEach(obj => res[obj.i] = obj.rank); return res; };
    return pearsonReg(rank(x), rank(y));
}
function calcPostHoc(groups, names, alpha) {
    let r = oneWayAnova(groups), MSW = r.MSW, dfW = r.dfW, k = groups.length; let sortedIdx = names.map((_, i) => i).sort((a,b) => mean(groups[a]) - mean(groups[b])); let pairs = [];
    for(let i=0; i<k; i++) {
        for(let j=i+1; j<k; j++) {
            let u = sortedIdx[i], v = sortedIdx[j]; let n1 = groups[u].length, n2 = groups[v].length, diffAbs = Math.abs(mean(groups[u]) - mean(groups[v]));
            let p_lsd = tDistPVal(diffAbs / Math.sqrt(MSW * (1/n1 + 1/n2)), dfW); let q = diffAbs / Math.sqrt(MSW * 0.5 * (1/n1 + 1/n2));
            pairs.push({ a: names[u], b: names[v], diff: mean(groups[u]) - mean(groups[v]), p_lsd: p_lsd, sig_lsd: p_lsd <= alpha, p_bonf: Math.min(1, p_lsd * (k * (k - 1) / 2)), sig_bonf: Math.min(1, p_lsd * (k * (k - 1) / 2)) <= alpha, p_tukey: tukeyPVal(q, k, dfW), sig_tukey: tukeyPVal(q, k, dfW) <= alpha, p_duncan: tukeyPVal(q, j - i + 1, dfW), sig_duncan: tukeyPVal(q, j - i + 1, dfW) <= alpha });
        }
    }
    return { pairs, sortedIdx };
}
function getLetters(names, means, pairs, sigKey) {
    const n = names.length; const sig = Array.from({length:n}, () => Array(n).fill(false));
    pairs.forEach(p => { const i = names.indexOf(p.a), j = names.indexOf(p.b); if (i>=0 && j>=0 && p[sigKey]) { sig[i][j] = true; sig[j][i] = true; } });
    let letters = Array.from({length:n}, () => new Set(['a'])), nextChar = 'b', changed = true;
    while (changed) { changed = false; for (let i = 0; i < n; i++) { for (let j = i+1; j < n; j++) { if (!sig[i][j]) continue; const shared = [...letters[i]].filter(c => letters[j].has(c)); if (shared.length === 0) continue; for (const c of shared) { const hi = means[i] >= means[j] ? i : j; letters[hi].delete(c); letters[hi].add(nextChar); for (let k = 0; k < n; k++) { if (k !== hi && !sig[hi][k] && letters[k].has(c)) letters[k].add(nextChar); } nextChar = String.fromCharCode(nextChar.charCodeAt(0) + 1); changed = true; } } } }
    return letters.map(s => [...s].sort().join(''));
}
function getBoxStats(arr) {
    const s = [...arr].sort((a,b)=>a-b); if(s.length === 0) return { q1:0, med:0, q3:0, min:0, max:0, out:[] };
    const q1 = s[Math.floor(s.length * 0.25)], med = median(s), q3 = s[Math.floor(s.length * 0.75)], iqr = q3 - q1;
    const lf = q1 - 1.5*iqr, uf = q3 + 1.5*iqr; const out = s.filter(v => v < lf || v > uf), nonOut = s.filter(v => v >= lf && v <= uf);
    return { q1, med, q3, min: Math.min(...nonOut), max: Math.max(...nonOut), out };
}

// ------------------------------------------
// DRAWING HELPERS
// ------------------------------------------
function drawChart(type, labels, groupsData, title, themeColor, yLabel, letters=null) {
    let allVals = groupsData.flat(); let gMin = Math.min(...allVals), gMax = Math.max(...allVals);
    let pad = (gMax - gMin) * 0.1 || 1; if(type === 'bar') { gMin = 0; pad = gMax*0.2; } else { gMin -= pad; gMax += pad; } let range = gMax - gMin;
    let html = `<div class="native-chart-card"><div class="chart-title">${title}</div><div style="font-size:10px; font-weight:bold; color:var(--text3); margin-bottom:5px;">${yLabel}</div>
                <div class="chart-container-native"><div class="y-axis"><span>${fmt(gMax,1)}</span><span>${fmt(gMin + range/2,1)}</span><span>${fmt(gMin,1)}</span></div><div class="bars-wrapper">`;
    labels.forEach((lbl, i) => {
        let gD = groupsData[i]; html += `<div class="bar-group">`;
        if (type === 'bar') {
            let meanVal = mean(gD); let hPct = Math.max(1, ((meanVal-gMin) / range) * 100);
            let valText = fmt(meanVal); if (letters) valText += `<br><span class="notation-b">(${letters[i]})</span>`;
            html += `<div class="bar-value" style="text-align:center;">${valText}</div><div class="bar-track"><div class="bar-fill" style="height:${hPct}%; background:${themeColor};"></div></div>`;
        } else if (type === 'boxplot') {
            let st = getBoxStats(gD); let yToPct = y => Math.max(0, Math.min(100, ((y - gMin) / range) * 100));
            let q1P = yToPct(st.q1), medP = yToPct(st.med), q3P = yToPct(st.q3), minP = yToPct(st.min), maxP = yToPct(st.max);
            html += `<div style="position:relative; width:100%; height:100%;"><div class="bp-whisker-center" style="bottom:${q3P}%; top:${100-maxP}%;"></div><div class="bp-whisker-center" style="bottom:${minP}%; top:${100-q1P}%;"></div><div class="bp-whisker-cap" style="bottom:${maxP}%;"></div><div class="bp-whisker-cap" style="bottom:${minP}%;"></div><div class="bp-box" style="bottom:${q1P}%; top:${100-q3P}%; background:${themeColor}40;"></div><div class="bp-median" style="bottom:${medP}%;"></div>`;
            st.out.forEach(o => { html += `<div class="bp-outlier" style="bottom:${yToPct(o)}%;"></div>`; });
            if (letters) html += `<div style="position:absolute; top:-20px; left:0; right:0; text-align:center;"><span class="notation-b">(${letters[i]})</span></div>`; html += `</div>`;
        }
        html += `<div class="bar-label" title="${lbl}">${lbl}</div></div>`;
    }); html += `</div></div></div>`; return html;
}
function drawScatter(xArr, yArr, title, themeColor, xLab, yLab, slope, intercept) {
    let xMin = Math.min(...xArr), xMax = Math.max(...xArr), yMin = Math.min(...yArr), yMax = Math.max(...yArr);
    let xp = (xMax-xMin)*0.1 || 1, yp = (yMax-yMin)*0.1 || 1; xMin -= xp; xMax += xp; yMin -= yp; yMax += yp; let xR = xMax-xMin, yR = yMax-yMin;
    let html = `<div class="native-chart-card"><div class="chart-title">${title}</div><div style="font-size:10px; font-weight:bold; color:var(--text3); margin-bottom:5px;">Y: ${yLab}</div>
                <div class="chart-container-native"><div class="y-axis"><span>${fmt(yMax,1)}</span><span>${fmt(yMin + yR/2,1)}</span><span>${fmt(yMin,1)}</span></div>
                <div style="flex:1; position:relative; border-left:1px solid var(--border-focus); border-bottom:1px solid var(--border-focus); overflow:hidden;">`;
    for(let i=0; i<xArr.length; i++){ let lx = ((xArr[i]-xMin)/xR)*100, by = ((yArr[i]-yMin)/yR)*100; html += `<div class="scatter-dot" style="left:${lx}%; bottom:${by}%; background:${themeColor};"></div>`; }
    let b1 = (((slope*xMin+intercept)-yMin)/yR)*100, b2 = (((slope*xMax+intercept)-yMin)/yR)*100;
    html += `<svg style="position:absolute; width:100%; height:100%; left:0; top:0;"><line x1="0" y1="${100-b1}%" x2="100%" y2="${100-b2}%" stroke="var(--danger)" stroke-width="2" stroke-dasharray="4"/></svg></div></div><div style="text-align:center; font-size:10px; font-weight:bold; color:var(--text3); margin-top:5px;">X: ${xLab}</div></div>`; return html;
}

// ==========================================
// UI DIALOGS & RUNNERS MAIN 10.0
// ==========================================
function getFilteredOptions(typeFilter) { let opts = ''; S.vars.forEach((v, i) => { opts += `<option value="${i}">${v.name}</option>`; }); return opts; }
function getMultiSelectCheckboxes(typeFilter, containerId) { let html = `<div class="multi-select-container" id="${containerId}">`; S.vars.forEach((v, i) => { if (v.type === typeFilter) html += `<label class="checkbox-label"><input type="checkbox" value="${i}" ${i===0?'checked':''}> ${v.name}</label>`; }); return html + `</div>`; }
function getSelectedDeps(containerId) { return Array.from(document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)).map(cb => parseInt(cb.value)); }
function closeDialog() { document.getElementById('dialog-overlay').classList.remove('active'); }
function closeResult() { document.getElementById('result-panel').classList.remove('open'); }
function appendToReport(title, htmlContent) {
  const reportArea = document.getElementById('res-content-area'); const block = document.createElement('div'); block.className = 'report-block';
  block.innerHTML = `<div class="report-header"><h3 class="report-title">${title}</h3><button class="remove-block-btn" onclick="removeBlock(this)">✖</button></div>${htmlContent}`;
  reportArea.appendChild(block); document.getElementById('result-panel').classList.add('open');
  if(window.innerWidth <= 768) toggleSidebar(); 
  setTimeout(() => { const body = document.querySelector('.result-body'); body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }); block.querySelectorAll('.bar-fill').forEach(bar => { const h = bar.style.height; bar.style.height = '0%'; setTimeout(() => bar.style.height = h, 50); }); }, 100);
}

function openDialog(type) {
  const dlgTitle = document.getElementById('dlg-title'), dlgBody = document.getElementById('dlg-body'), dlgBtn = document.getElementById('dlg-btn');
  let html = '';
  let depSelector = `<div class="form-group"><label>Variabel Target (Y)</label>${getMultiSelectCheckboxes('scale', 'dlg-dep-container')}</div>`;
  let chartOptions = `
    <div class="form-group" style="margin-top:10px; border-top:1px dashed var(--border); padding-top:10px;">
      <label>Jenis Grafik</label><select class="form-control" id="dlg-chart-type"><option value="bar">Bar Chart (Rata-rata)</option><option value="boxplot">Boxplot (Kuartil & Outlier)</option></select>
    </div>
    <div class="form-group"><label>Label Sumbu Y (Grafik)</label><input type="text" class="form-control" id="dlg-ylabel" placeholder="Opsional (Misal: Panjang (cm))"></div>
    <div class="form-group"><label>Tema Grafik</label><select class="form-control" id="dlg-theme"><option value="var(--primary)">Klasik Biru (Default)</option><option value="#A78BFA">Pastel Ungu</option><option value="#10B981">Viridis Hijau</option><option value="#475569">Monokrom (B&W)</option></select></div>`;

  if(type === 'missing_data') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">🧹</span> Manajemen Missing Data'; html += depSelector;
    html += `<div class="form-group"><label>Metode Penanganan</label><select class="form-control" id="dlg-missing"><option value="listwise">Hapus Baris Kosong (Listwise Deletion)</option><option value="mean">Imputasi: Isi Rata-rata (Mean)</option><option value="median">Imputasi: Isi Median</option></select></div>`;
    html += `<div class="r-note">Perhatian: Fungsi ini mengubah langsung Data View Anda. Unduh CSV jika perlu backup.</div>`;
    dlgBtn.onclick = () => runMissingData();
  } else if(type === 'transform') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">🔄</span> Transformasi Data'; html += depSelector;
    html += `<div class="form-group"><label>Metode</label><select class="form-control" id="dlg-trans"><option value="log10">Logaritma 10 (Log10(x))</option><option value="sqrt">Akar Kuadrat (√x)</option><option value="arcsin">Arkus Sinus (Asin(√(x/100)))</option></select></div>`;
    dlgBtn.onclick = () => {
      const deps = getSelectedDeps('dlg-dep-container'), trans = document.getElementById('dlg-trans').value; if(!deps.length) return alert('Pilih variabel!'); closeDialog();
      deps.forEach(c => { for(let r=0; r<S.rows; r++){ let v = parseFloat(String(S.data[r][c]).replace(',','.')); if(!isNaN(v)){ if(trans==='log10') v=v>0?Math.log10(v):''; else if(trans==='sqrt') v=v>=0?Math.sqrt(v):''; else if(trans==='arcsin') v=v>=0&&v<=100?Math.asin(Math.sqrt(v/100)):''; S.data[r][c] = v!==''?v.toFixed(4):''; } } }); renderDataBody(); alert("Sukses!");
    };
  } else if(type === 'deskriptif') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">📋</span> Statistik Deskriptif'; html += depSelector; dlgBtn.onclick = () => runDeskriptif();
  } else if (type === 'normalitas') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">🔔</span> Uji Normalitas'; html += depSelector;
    html += `<div class="form-group"><label>Faktor (Opsional)</label><select class="form-control" id="dlg-fac"><option value="-1">— Keseluruhan —</option>${getFilteredOptions('nominal')}</select></div>`;
    dlgBtn.onclick = () => runNormalitas();
  } else if (type === 'homogenitas') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">⚖️</span> Uji Homogenitas'; html += depSelector;
    html += `<div class="form-group"><label>Faktor</label><select class="form-control" id="dlg-fac">${getFilteredOptions('nominal')}</select></div>`;
    html += `<div class="form-group"><label>Metode Uji</label><select class="form-control" id="dlg-method"><option value="median">Levene (Basis Median - Standar Robust)</option><option value="mean">Levene (Basis Mean - Standar SPSS)</option><option value="bartlett">Bartlett (Parametrik Normal)</option></select></div>`;
    dlgBtn.onclick = () => runHomogenitas();
  } else if (type === 'ttest_indep') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">⚖️</span> Uji-T (Independen)'; html += depSelector;
    html += `<div class="form-group"><label>Faktor (2 Kelompok)</label><select class="form-control" id="dlg-fac">${getFilteredOptions('nominal')}</select></div>` + chartOptions; dlgBtn.onclick = () => runTTestIndep();
  } else if (type === 'ttest_paired' || type === 'wilcoxon') {
    dlgTitle.innerHTML = type === 'ttest_paired' ? '<span class="dsw-icon-styled">🔗</span> Paired Sample T-Test' : '<span class="dsw-icon-styled">📉</span> Wilcoxon Signed-Rank';
    html += `<div class="form-group"><label>Var 1 (Pre)</label><select class="form-control" id="dlg-var1">${getFilteredOptions('scale')}</select></div><div class="form-group"><label>Var 2 (Post)</label><select class="form-control" id="dlg-var2">${getFilteredOptions('scale')}</select></div>` + chartOptions; dlgBtn.onclick = () => runPaired(type);
  } else if(type === 'anova1') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">📊</span> One-Way ANOVA'; html += depSelector + `<div class="form-group"><label>Faktor Kelompok</label><select class="form-control" id="dlg-fac">${getFilteredOptions('nominal')}</select></div>` + chartOptions; dlgBtn.onclick = () => runAnova1();
  } else if(type === 'anova2') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">📈</span> Two-Way ANOVA (GLM Type III)'; html += depSelector + `<div class="form-group"><label>Faktor A</label><select class="form-control" id="dlg-fac1">${getFilteredOptions('nominal')}</select></div><div class="form-group"><label>Faktor B</label><select class="form-control" id="dlg-fac2">${getFilteredOptions('nominal')}</select></div>`; dlgBtn.onclick = () => runAnova2();
  } else if(type === 'posthoc') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">🔍</span> Post Hoc Test'; html += depSelector + `<div class="form-group"><label>Faktor</label><select class="form-control" id="dlg-fac">${getFilteredOptions('nominal')}</select></div><div class="form-group"><label>Metode</label><select class="form-control" id="dlg-method"><option value="tukey">Tukey HSD</option><option value="duncan">Duncan's MRT</option><option value="lsd">Fisher's LSD</option></select></div>` + chartOptions; dlgBtn.onclick = () => runPostHoc();
  } else if(type === 'kruskal') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">📉</span> Kruskal-Wallis'; html += depSelector + `<div class="form-group"><label>Faktor</label><select class="form-control" id="dlg-fac">${getFilteredOptions('nominal')}</select></div><div class="form-group"><label>Uji Lanjut</label><select class="form-control" id="dlg-method"><option value="dunn">Dunn's Test (R Standard)</option><option value="mw">Pairwise Mann-Whitney</option></select></div>` + chartOptions; dlgBtn.onclick = () => runKruskal();
  } else if(type === 'mannwhitney') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">🔀</span> Mann-Whitney U'; html += depSelector + `<div class="form-group"><label>Faktor (2 Grup)</label><select class="form-control" id="dlg-fac">${getFilteredOptions('nominal')}</select></div><div class="form-group"><label>Arah Uji</label><select class="form-control" id="dlg-tail"><option value="two">Two-tailed</option><option value="right">One-tailed Kanan</option><option value="left">One-tailed Kiri</option></select></div>` + chartOptions; dlgBtn.onclick = () => runMannWhitney();
  } else if (type === 'correg') {
    dlgTitle.innerHTML = '<span class="dsw-icon-styled">📈</span> Korelasi & Regresi Linear';
    html += `<div class="form-group"><label>Var Bebas (X)</label><select class="form-control" id="dlg-varX">${getFilteredOptions('scale')}</select></div><div class="form-group"><label>Var Terikat (Y)</label><select class="form-control" id="dlg-varY">${getFilteredOptions('scale')}</select></div><div class="form-group"><label>Korelasi</label><select class="form-control" id="dlg-method"><option value="pearson">Pearson (Parametrik)</option><option value="spearman">Spearman (Non-Parametrik)</option></select></div><div class="form-group"><label>Tema Grafik</label><select class="form-control" id="dlg-theme"><option value="var(--primary)">Klasik Biru</option><option value="#A78BFA">Pastel Ungu</option><option value="#10B981">Viridis Hijau</option></select></div>`; dlgBtn.onclick = () => runCorReg();
  }
  dlgBody.innerHTML = html; document.getElementById('dialog-overlay').classList.add('active');
}

function runMissingData() {
    const deps = getSelectedDeps('dlg-dep-container'), meth = document.getElementById('dlg-missing').value; if(!deps.length) return alert('Pilih variabel!'); closeDialog();
    if (meth === 'listwise') {
        let validRows = [];
        for(let r=0; r<S.rows; r++) { let isValid = true; for(let c of deps) { if(S.data[r][c] === undefined || String(S.data[r][c]).trim() === '') { isValid = false; break; } } if(isValid) validRows.push([...S.data[r]]); }
        S.data = validRows; S.rows = validRows.length; renderDataBody(); alert("Baris kosong dihapus!");
    } else {
        deps.forEach(c => {
            let vals = []; for(let r=0; r<S.rows; r++) { let v = parseFloat(String(S.data[r][c]).replace(',','.')); if(!isNaN(v)) vals.push(v); }
            if(vals.length === 0) return; let repVal = meth === 'mean' ? mean(vals) : median(vals);
            for(let r=0; r<S.rows; r++) { if(S.data[r][c] === undefined || String(S.data[r][c]).trim() === '') S.data[r][c] = repVal.toFixed(3); }
        }); renderDataBody(); alert(`Imputasi ${meth} berhasil!`);
    }
}

function runDeskriptif() {
  const deps = getSelectedDeps('dlg-dep-container'); if(!deps.length) return alert('Pilih variabel!'); closeDialog(); let fullHtml = '';
  deps.forEach(vIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Variabel: ${S.vars[vIdx].name}</div>`;
    const d = S.data.map(r => parseFloat(String(r[vIdx]).replace(',','.'))).filter(v => !isNaN(v)); if (d.length === 0) return fullHtml += `<div class="r-alert">Data kosong.</div>`;
    const n = d.length, m = mean(d), s = std(d), se = s / Math.sqrt(n), med = median(d), mn = Math.min(...d), mx = Math.max(...d), sk = skewness(d), ku = kurtosis(d), tc = n > 1 ? tInv(0.05, n - 1) : 0, ci_lo = m - tc * se, ci_hi = m + tc * se;
    fullHtml += `<div class="stat-grid"><div class="stat-box"><div class="label">N Valid</div><div class="value">${n}</div></div><div class="stat-box"><div class="label">Mean</div><div class="value">${fmt(m)}</div></div><div class="stat-box"><div class="label">Median</div><div class="value">${fmt(med)}</div></div><div class="stat-box"><div class="label">Std. Dev</div><div class="value">${fmt(s)}</div></div><div class="stat-box"><div class="label">Min</div><div class="value">${fmt(mn)}</div></div><div class="stat-box"><div class="label">Max</div><div class="value">${fmt(mx)}</div></div></div>`;
    let tbl = `<table class="res-table"><thead><tr><th>Statistik Tambahan</th><th>Nilai</th><th>Keterangan</th></tr></thead><tbody><tr><td>Std. Error Mean</td><td>${fmt(se)}</td><td>—</td></tr><tr><td>Skewness</td><td>${fmt(sk)}</td><td>${Math.abs(sk)<0.5?'Simetris':sk>1||sk<-1?'Menceng ekstrem':'Menceng'}</td></tr><tr><td>Kurtosis</td><td>${fmt(ku)}</td><td>${Math.abs(ku)<0.5?'Mesokurtik':ku>0?'Leptokurtik':'Platikurtik'}</td></tr><tr><td>95% CI (Mean)</td><td>[${fmt(ci_lo)}, ${fmt(ci_hi)}]</td><td>Rentang Kepercayaan</td></tr></tbody></table>`;
    fullHtml += generateTable(tbl) + `<hr>`;
  }); appendToReport('Statistik Deskriptif', fullHtml);
}

function runNormalitas() {
  const deps = getSelectedDeps('dlg-dep-container'), facIdx = parseInt(document.getElementById('dlg-fac').value); if(!deps.length) return alert('Pilih variabel!'); closeDialog(); let fullHtml = '';
  deps.forEach(vIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Variabel: ${S.vars[vIdx].name}</div>`;
    if(facIdx !== -1) {
        const { groups, names } = extractGroups(vIdx, facIdx); let tbl = `<table class="res-table"><thead><tr><th>Kelompok</th><th>Metode</th><th>Statistik</th><th>p-value</th></tr></thead><tbody>`;
        let allNormal = true, validGroups = 0;
        groups.forEach((g, i) => { if (g.length < 3) return; validGroups++; const sw = shapiroWilk(g), ks = ksTest(g), passSW = sw.p > 0.05; if(!passSW) allNormal = false; tbl += `<tr><td rowspan="2">${names[i]} (n=${g.length})</td><td>Shapiro-Wilk</td><td>${fmt(sw.W)}</td><td class="${passSW?'':'sig'}">${fmtp(sw.p)}</td></tr><tr><td>K-S (Lilliefors)</td><td>${fmt(ks.D)}</td><td class="${ks.p>0.05?'':'sig'}">${fmtp(ks.p)}</td></tr>`; }); tbl += `</tbody></table>`;
        if (validGroups === 0) fullHtml += `<div class="r-alert">Grup butuh min 3 data.</div>`;
        else fullHtml += generateTable(tbl) + `<div class="r-note"><b>Interpretasi:</b><br>${allNormal ? `Seluruh data per kelompok berdistribusi normal (p > 0.05).` : `Terdapat data kelompok tidak normal (p ≤ 0.05).`}</div><hr>`;
    } else {
        const d = S.data.map(r => parseFloat(String(r[vIdx]).replace(',','.'))).filter(v => !isNaN(v)); if(d.length < 3) return fullHtml += `<div class="r-alert">Butuh min 3 data.</div>`;
        const sw = shapiroWilk(d), ks = ksTest(d), pass = sw.p > 0.05;
        fullHtml += `<div class="verdict ${pass?'v-pass':'v-fail'}">${pass ? '✅ Data Normal' : '❌ Data Tidak Normal'}</div>`;
        let tbl = `<table class="res-table"><thead><tr><th>Metode Uji</th><th>Statistik</th><th>p-value</th></tr></thead><tbody><tr><td>Shapiro-Wilk</td><td>${fmt(sw.W)}</td><td class="${pass?'':'sig'}">${fmtp(sw.p)}</td></tr><tr><td>K-S (Lilliefors)</td><td>${fmt(ks.D)}</td><td>${fmtp(ks.p)}</td></tr></tbody></table>`;
        fullHtml += generateTable(tbl) + `<div class="r-note"><b>Interpretasi:</b><br>Data ${pass?"berdistribusi normal":"tidak normal"} berdasarkan uji Shapiro-Wilk (p = ${fmtp(sw.p)}).</div><hr>`;
    }
  }); appendToReport('Uji Normalitas', fullHtml);
}

function runHomogenitas() {
  const deps = getSelectedDeps('dlg-dep-container'), facIdx = parseInt(document.getElementById('dlg-fac').value), meth = document.getElementById('dlg-method').value; if(!deps.length) return alert('Pilih variabel!'); closeDialog(); let fullHtml = '';
  deps.forEach(depIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Variabel: ${S.vars[depIdx].name}</div>`;
    const { groups } = extractGroups(depIdx, facIdx); const vG = groups.filter(g => g.length >= 2); if(vG.length < 2) return fullHtml += `<div class="r-alert">Butuh min 2 kelompok.</div>`;
    let r, methName; if (meth === 'bartlett') { r = bartlettTest(vG); methName = "Bartlett"; } else { r = leveneTest(vG, meth); methName = `Levene (${meth})`; r.chi2 = r.F; r.df = r.df1; }
    const pass = r.p > 0.05;
    fullHtml += `<div class="verdict ${pass?'v-pass':'v-fail'}">${pass ? `✅ Varians Homogen` : `❌ Varians Tidak Homogen`}</div>
                <div class="stat-grid"><div class="stat-box"><div class="label">Statistik</div><div class="value">${fmt(r.chi2)}</div></div><div class="stat-box"><div class="label">p-value</div><div class="value ${pass?'':'sig'}">${fmtp(r.p)}</div></div></div>`;
    let tbl = `<table class="res-table"><thead><tr><th>Metode</th><th>Statistik</th><th>df</th><th>p-value</th></tr></thead><tbody><tr><td>${methName}</td><td>${fmt(r.chi2)}</td><td>${r.df}</td><td>${fmtp(r.p)}</td></tr></tbody></table>`;
    fullHtml += generateTable(tbl) + `<div class="r-note"><b>Interpretasi:</b><br>Varians data ${pass ? "homogen" : "tidak homogen"} (p = ${fmtp(r.p)}).</div><hr>`;
  }); appendToReport('Uji Homogenitas Varians', fullHtml);
}

function runTTestIndep() {
  const deps = getSelectedDeps('dlg-dep-container'), facIdx = parseInt(document.getElementById('dlg-fac').value), cType = document.getElementById('dlg-chart-type').value, theme = document.getElementById('dlg-theme').value, yL = document.getElementById('dlg-ylabel').value; if(!deps.length) return alert('Pilih variabel!'); closeDialog(); let fullHtml = '';
  deps.forEach(depIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Uji-T: ${S.vars[depIdx].name}</div>`;
    const { groups, names } = extractGroups(depIdx, facIdx); if(groups.length !== 2) return fullHtml += `<div class="r-alert">Harus ada tepat 2 kelompok.</div>`;
    const r = tTestIndep(groups[0], groups[1]), pass = r.pStd <= 0.05;
    fullHtml += `<div class="verdict ${pass?'v-fail':'v-pass'}">${pass ? '✅ Perbedaan signifikan (p ≤ 0.05)' : '❌ Tidak ada perbedaan'}</div>`;
    let tbl = `<table class="res-table"><thead><tr><th>Asumsi Varians</th><th>t</th><th>df</th><th>p-value</th></tr></thead><tbody><tr><td>Equal (Student's t)</td><td>${fmt(r.tStd)}</td><td>${fmt(r.dfStd, 1)}</td><td class="${pass?'sig':''}">${fmtp(r.pStd)}</td></tr><tr><td>Unequal (Welch's t)</td><td>${fmt(r.tWelch)}</td><td>${fmt(r.dfWelch, 1)}</td><td class="${r.pWelch<=0.05?'sig':''}">${fmtp(r.pWelch)}</td></tr></tbody></table>`;
    fullHtml += generateTable(tbl) + drawChart(cType, names, groups, `Perbandingan ${S.vars[depIdx].name}`, theme, yL || S.vars[depIdx].name) + `<hr>`;
  }); appendToReport('Independent Sample T-Test', fullHtml);
}

function runPaired(type) {
  const v1 = parseInt(document.getElementById('dlg-var1').value), v2 = parseInt(document.getElementById('dlg-var2').value), cType = document.getElementById('dlg-chart-type').value, theme = document.getElementById('dlg-theme').value, yL = document.getElementById('dlg-ylabel').value; if(v1===v2) return alert('Pilih 2 variabel berbeda!'); closeDialog(); const {a1, a2} = extractPair(v1, v2); if(a1.length < 3) return alert('Data berpasangan kurang!');
  let fullHtml = `<div style="font-weight:bold; margin-bottom:8px;">${S.vars[v1].name} vs ${S.vars[v2].name} (N=${a1.length})</div>`;
  if (type === 'ttest_paired') { const r = tTestPaired(a1, a2), pass = r.p <= 0.05; fullHtml += `<div class="verdict ${pass?'v-fail':'v-pass'}">${pass ? '✅ Perbedaan signifikan' : '❌ Tidak signifikan'}</div><div class="stat-grid"><div class="stat-box"><div class="label">t-Stat</div><div class="value">${fmt(r.t)}</div></div><div class="stat-box"><div class="label">df</div><div class="value">${r.df}</div></div><div class="stat-box"><div class="label">p-value</div><div class="value ${pass?'sig':''}">${fmtp(r.p)}</div></div></div>`; } 
  else { const r = wilcoxonSignedRank(a1, a2), pass = r.p <= 0.05; fullHtml += `<div class="verdict ${pass?'v-fail':'v-pass'}">${pass ? '✅ Perbedaan signifikan' : '❌ Tidak signifikan'}</div><div class="stat-grid"><div class="stat-box"><div class="label">W (Pos/Neg)</div><div class="value">${fmt(r.Wpos,1)} / ${fmt(r.Wneg,1)}</div></div><div class="stat-box"><div class="label">Z-Score</div><div class="value">${fmt(r.z)}</div></div><div class="stat-box"><div class="label">p-value</div><div class="value ${pass?'sig':''}">${fmtp(r.p)}</div></div></div>`; }
  fullHtml += drawChart(cType, [S.vars[v1].name, S.vars[v2].name], [a1, a2], `Perbandingan Berpasangan`, theme, yL || "Nilai"); appendToReport(type === 'ttest_paired' ? 'Paired Sample T-Test' : 'Wilcoxon Signed-Rank', fullHtml + '<hr>');
}

function runAnova1() {
  const deps = getSelectedDeps('dlg-dep-container'), facIdx = parseInt(document.getElementById('dlg-fac').value), cType = document.getElementById('dlg-chart-type').value, theme = document.getElementById('dlg-theme').value, yL = document.getElementById('dlg-ylabel').value; if(!deps.length) return alert('Pilih variabel!'); closeDialog(); let fullHtml = '';
  deps.forEach(depIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Analisis: ${S.vars[depIdx].name}</div>`;
    const { groups, names } = extractGroups(depIdx, facIdx); const vG = groups.filter(g => g.length >= 2), vN = names.filter((_,i) => groups[i].length >= 2); if(vG.length < 3) return fullHtml += `<div class="r-alert">Butuh min 3 kelompok.</div>`;
    const r = oneWayAnova(vG), pass = r.p <= 0.05;
    fullHtml += `<div class="verdict ${pass?'v-fail':'v-pass'}">${pass ? `✅ Ada perbedaan signifikan` : `❌ Tidak ada perbedaan`}</div>`;
    let tbl = `<table class="res-table"><thead><tr><th>Sumber</th><th>SS</th><th>df</th><th>MS</th><th>F</th><th>p-value</th></tr></thead><tbody><tr><td>Antar Kelompok</td><td>${fmt(r.SSB)}</td><td>${r.dfB}</td><td>${fmt(r.MSB)}</td><td class="${pass?'sig':''}">${fmt(r.F)}</td><td class="${pass?'sig':''}">${fmtp(r.p)}</td></tr><tr><td>Dalam Kelompok</td><td>${fmt(r.SSW)}</td><td>${r.dfW}</td><td>${fmt(r.MSW)}</td><td>—</td><td>—</td></tr></tbody></table>`;
    fullHtml += generateTable(tbl) + drawChart(cType, vN, vG, `Visualisasi`, theme, yL || S.vars[depIdx].name) + `<div class="r-note">ANOVA menunjukan ${pass?'terdapat':'tidak terdapat'} perbedaan (p = ${fmtp(r.p)}).</div><hr>`;
  }); appendToReport('One-Way ANOVA', fullHtml);
}

function runAnova2() {
  const deps = getSelectedDeps('dlg-dep-container'), fac1Idx = parseInt(document.getElementById('dlg-fac1').value), fac2Idx = parseInt(document.getElementById('dlg-fac2').value); if(!deps.length || fac1Idx === fac2Idx) return alert('Variabel tdk valid!'); closeDialog(); let fullHtml = '';
  deps.forEach(depIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Two-Way ANOVA: ${S.vars[depIdx].name}</div>`;
    const r = twoWayAnovaType3(depIdx, fac1Idx, fac2Idx); if(!r) return fullHtml += `<div class="r-alert">Matriks gagal. Terdapat sel perlakuan kosong.</div>`;
    const passAB = r.pAB <= 0.05; fullHtml += `<div class="verdict ${passAB?'v-fail':'v-pass'}">${passAB ? `⚠️ Ada efek interaksi` : `✅ Tidak ada efek interaksi`}</div>`;
    let tbl = `<table class="res-table"><thead><tr><th>Sumber (Type III)</th><th>SS</th><th>df</th><th>MS</th><th>F</th><th>p-value</th></tr></thead><tbody><tr><td>${S.vars[fac1Idx].name}</td><td>${fmt(r.SSA)}</td><td>${r.dfA}</td><td>${fmt(r.MSA)}</td><td class="${r.pA<=0.05?'sig':''}">${fmt(r.FA)}</td><td class="${r.pA<=0.05?'sig':''}">${fmtp(r.pA)}</td></tr><tr><td>${S.vars[fac2Idx].name}</td><td>${fmt(r.SSB)}</td><td>${r.dfB}</td><td>${fmt(r.MSB)}</td><td class="${r.pB<=0.05?'sig':''}">${fmt(r.FB)}</td><td class="${r.pB<=0.05?'sig':''}">${fmtp(r.pB)}</td></tr><tr><td>Interaksi</td><td>${fmt(r.SSAB)}</td><td>${r.dfAB}</td><td>${fmt(r.MSAB)}</td><td class="${passAB?'sig':''}">${fmt(r.FAB)}</td><td class="${passAB?'sig':''}">${fmtp(r.pAB)}</td></tr><tr><td>Error</td><td>${fmt(r.SSE)}</td><td>${r.dfE}</td><td>${fmt(r.MSE)}</td><td>—</td><td>—</td></tr></tbody></table>`;
    fullHtml += generateTable(tbl) + `<hr>`;
  }); appendToReport('Two-Way ANOVA', fullHtml);
}

function runPostHoc() {
  const deps = getSelectedDeps('dlg-dep-container'), facIdx = parseInt(document.getElementById('dlg-fac').value), meth = document.getElementById('dlg-method').value, cType = document.getElementById('dlg-chart-type').value, theme = document.getElementById('dlg-theme').value, yL = document.getElementById('dlg-ylabel').value; if(!deps.length) return alert('Pilih variabel!'); closeDialog(); let fullHtml = '';
  deps.forEach(depIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Post Hoc (${meth.toUpperCase()}): ${S.vars[depIdx].name}</div>`;
    const { groups, names } = extractGroups(depIdx, facIdx); const vG = groups.filter(g => g.length >= 2), vN = names.filter((_,i) => groups[i].length >= 2); if(vG.length < 3) return fullHtml += `<div class="r-alert">Butuh min 3 kelompok.</div>`;
    const { pairs, sortedIdx } = calcPostHoc(vG, vN, 0.05); const means = vG.map(g => mean(g)); let letters = getLetters(vN, means, pairs, `sig_${meth}`);
    let tbl = `<table class="res-table"><thead><tr><th>Kelompok</th><th>Rata-rata</th><th>Notasi</th></tr></thead><tbody>`; sortedIdx.forEach(u => { tbl += `<tr><td>${vN[u]}</td><td>${fmt(means[u])}</td><td class="notation-b">${letters[u]}</td></tr>`; }); tbl += `</tbody></table>`;
    fullHtml += generateTable(tbl) + drawChart(cType, vN, vG, `Visualisasi Notasi`, theme, yL || S.vars[depIdx].name, letters) + `<hr>`;
  }); appendToReport('Post Hoc Test', fullHtml);
}

function runKruskal() {
  const deps = getSelectedDeps('dlg-dep-container'), facIdx = parseInt(document.getElementById('dlg-fac').value), meth = document.getElementById('dlg-method').value, cType = document.getElementById('dlg-chart-type').value, theme = document.getElementById('dlg-theme').value, yL = document.getElementById('dlg-ylabel').value; if(!deps.length) return alert('Pilih variabel!'); closeDialog(); let fullHtml = '';
  deps.forEach(depIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Kruskal-Wallis: ${S.vars[depIdx].name}</div>`;
    const { groups, names } = extractGroups(depIdx, facIdx); const vG = groups.filter(g => g.length >= 1), vN = names.filter((_,i) => groups[i].length >= 1); if(vG.length < 2) return fullHtml += `<div class="r-alert">Butuh 2 kelompok.</div>`;
    const r = kruskalWallis(vG), pass = r.p <= 0.05;
    fullHtml += `<div class="verdict ${pass?'v-fail':'v-pass'}">${pass ? '✅ Perbedaan Signifikan' : '❌ Tidak Signifikan'}</div><div class="stat-grid"><div class="stat-box"><div class="label">H-Stat</div><div class="value">${fmt(r.H)}</div></div><div class="stat-box"><div class="label">p-value</div><div class="value ${pass?'sig':''}">${fmtp(r.p)}</div></div></div>`;
    let letters = null;
    if (pass) {
      let pairs = []; const SE = (r.N*(r.N+1)/12) - (r.tieSum / (12*(r.N-1)));
      for(let i=0; i<vG.length; i++) { for(let j=i+1; j<vG.length; j++) {
          if (meth === 'dunn') { let z = (r.meanRanks[i] - r.meanRanks[j]) / Math.sqrt(SE * (1/vG[i].length + 1/vG[j].length)); pairs.push({ a: vN[i], b: vN[j], p_sig: Math.min(1, 2*normalCDF(-Math.abs(z)) * (vG.length*(vG.length-1)/2)) <= 0.05 }); } 
          else { pairs.push({ a: vN[i], b: vN[j], p_sig: Math.min(1, mannWhitney(vG[i], vG[j], 'two').p * (vG.length*(vG.length-1)/2)) <= 0.05 }); }
      }} letters = getLetters(vN, r.meanRanks, pairs, 'p_sig');
    }
    let tbl = `<table class="res-table"><thead><tr><th>Kelompok</th><th>Mean Rank</th>${letters?'<th>Notasi</th>':''}</tr></thead><tbody>`; vN.forEach((nm,i) => { tbl += `<tr><td>${nm}</td><td>${fmt(r.meanRanks[i])}</td>${letters?`<td class="notation-b">${letters[i]}</td>`:''}</tr>`; }); tbl += `</tbody></table>`;
    fullHtml += generateTable(tbl) + drawChart(cType, vN, vG, `Data Distribusi`, theme, yL || 'Nilai Data', letters) + `<hr>`;
  }); appendToReport('Kruskal-Wallis Test', fullHtml);
}

function runMannWhitney() {
  const deps = getSelectedDeps('dlg-dep-container'), facIdx = parseInt(document.getElementById('dlg-fac').value), tail = document.getElementById('dlg-tail').value, cType = document.getElementById('dlg-chart-type').value, theme = document.getElementById('dlg-theme').value, yL = document.getElementById('dlg-ylabel').value; if(!deps.length) return alert('Pilih variabel!'); closeDialog(); let fullHtml = '';
  deps.forEach(depIdx => {
    fullHtml += `<div style="font-weight:bold; margin-bottom:8px;">Mann-Whitney: ${S.vars[depIdx].name}</div>`;
    const { groups, names } = extractGroups(depIdx, facIdx); const vG = groups.filter(g => g.length >= 1), vN = names.filter((_,i) => groups[i].length >= 1); if(vG.length !== 2) return fullHtml += `<div class="r-alert">Butuh 2 kelompok.</div>`;
    const r = mannWhitney(vG[0], vG[1], tail), pass = r.p <= 0.05;
    fullHtml += `<div class="verdict ${pass?'v-fail':'v-pass'}">${pass ? '✅ Ada perbedaan signifikan' : '❌ Tidak ada perbedaan signifikan'}</div>`;
    fullHtml += `<div class="stat-grid"><div class="stat-box"><div class="label">U-Stat</div><div class="value">${fmt(r.U)}</div></div><div class="stat-box"><div class="label">p-value${r.exact?' (Exact)':' (Asymp)'}</div><div class="value ${pass?'sig':''}">${fmtp(r.p)}</div></div></div>`;
    let tbl = `<table class="res-table"><thead><tr><th>Kelompok</th><th>N</th><th>Mean Rank</th><th>Sum Rank</th></tr></thead><tbody><tr><td>${vN[0]}</td><td>${r.n1}</td><td>${fmt(r.R1/r.n1)}</td><td>${fmt(r.R1)}</td></tr><tr><td>${vN[1]}</td><td>${r.n2}</td><td>${fmt(r.R2/r.n2)}</td><td>${fmt(r.R2)}</td></tr></tbody></table>`;
    fullHtml += generateTable(tbl) + drawChart(cType, vN, vG, `Distribusi Data`, theme, yL || S.vars[depIdx].name) + `<hr>`;
  }); appendToReport('Mann-Whitney U Test', fullHtml);
}

function runCorReg() {
  const vX = parseInt(document.getElementById('dlg-varX').value), vY = parseInt(document.getElementById('dlg-varY').value), meth = document.getElementById('dlg-method').value, theme = document.getElementById('dlg-theme').value; if(vX===vY) return alert('X & Y harus beda!'); closeDialog(); const {a1: x, a2: y} = extractPair(vX, vY); if(x.length < 3) return alert('Data min 3!');
  let r = meth === 'pearson' ? pearsonReg(x, y) : spearman(x, y); const pass = r.p <= 0.05;
  let fullHtml = `<div style="font-weight:bold; margin-bottom:8px;">X: ${S.vars[vX].name} | Y: ${S.vars[vY].name}</div>`;
  fullHtml += `<div class="verdict ${pass?'v-fail':'v-pass'}">${pass ? '✅ Terdapat korelasi signifikan' : '❌ Tidak terdapat korelasi nyata'}</div>
              <div class="stat-grid"><div class="stat-box"><div class="label">Korelasi (r)</div><div class="value">${fmt(r.r)}</div></div><div class="stat-box"><div class="label">R² (Determinasi)</div><div class="value">${fmt(r.r2)}</div></div><div class="stat-box"><div class="label">p-value</div><div class="value ${pass?'sig':''}">${fmtp(r.p)}</div></div></div>`;
  if (meth === 'pearson') { fullHtml += `<div class="r-note" style="margin-bottom:10px;"><b>Regresi:</b> Y = ${fmt(r.slope)}X ${r.intercept >= 0 ? '+' : '-'} ${fmt(Math.abs(r.intercept))}</div>` + drawScatter(x, y, `Scatter Plot & Trendline`, theme, S.vars[vX].name, S.vars[vY].name, r.slope, r.intercept); } 
  else { fullHtml += `<div class="r-note">Metode Spearman hanya mengukur korelasi peringkat.</div>`; }
  appendToReport(meth === 'pearson' ? 'Korelasi Pearson' : 'Korelasi Spearman', fullHtml + '<hr>');
}

function loadSampleData() {
  clearAll(); const rawData = [[1, 10.2], [1, 10.5], [1, 10.1], [1, 10.8], [1, 10.6], [2, 12.5], [2, 12.8], [2, 12.4], [2, 14.2], [2, 14.5], [3, 16.0], [3, 16.2], [3, 16.5], [3, 17.8], [3, 17.6]];
  if(S.rows < rawData.length) addRows(rawData.length - S.rows);
  rawData.forEach((row, r) => { S.data[r][0] = row[0]; S.data[r][1] = row[1]; }); S.vars[0].values = '1=Kontrol, 2=Pakan_A, 3=Pakan_B';
  renderAll(); alert("Data Sampel Berhasil Dimuat!");
}
init();
