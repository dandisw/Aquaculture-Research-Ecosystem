// --- SAMPLE DATA STRINGS ---
const samplePCA = `Sampel\tSuhu\tSalinitas\tDO\tpH\tAmonia
Stasiun_1\t29.5\t15\t5.5\t7.5\t0.1
Stasiun_2\t32.0\t25\t3.2\t8.2\t0.5
Stasiun_3\t28.0\t12\t6.0\t7.2\t0.05
Stasiun_4\t33.5\t30\t2.5\t8.5\t0.8
Stasiun_5\t30.0\t20\t4.5\t7.8\t0.3
Stasiun_6\t27.5\t10\t6.5\t7.0\t0.02`;

const sampleCluster = `Lokasi\tFosfat\tNitrat\tKecerahan
L1\t0.5\t1.2\t45
L2\t0.6\t1.5\t40
L3\t2.5\t5.0\t15
L4\t2.8\t4.8\t12
L5\t0.4\t1.0\t50
L6\t2.2\t5.5\t10`;

const sampleGroup = `ID\tZona\tSuhu\tSalinitas\tDO
S1\tHulu\t26.5\t0\t7.5
S2\tHulu\t26.8\t0\t7.2
S3\tHulu\t27.0\t1\t7.0
S4\tMuara\t30.5\t15\t5.0
S5\tMuara\t31.0\t18\t4.5
S6\tMuara\t30.8\t16\t4.8
S7\tLaut\t29.0\t32\t6.5
S8\tLaut\t28.5\t33\t6.8
S9\tLaut\t29.2\t32\t6.6`;

function loadSample(id, data) {
    document.getElementById(id).value = data;
    toast("Data sampel berhasil dimuat. Silakan klik Jalankan.");
}

function loadSampleRapfish() {
    document.getElementById('dim-name-1').value = 'Dimensi Ekologi';
    document.getElementById('dim-data-1').value = `Indikator\tBuruk\tBaik\tIntensif\tTradisional\nKualitas Air\t0\t10\t4\t8\nPenyakit\t10\t0\t7\t2\nPlankton\t0\t10\t5\t9`;
    
    if(!document.getElementById('dim-data-2')) {
        addDim();
    }
    document.getElementById(`dim-name-2`).value = 'Dimensi Ekonomi';
    document.getElementById(`dim-data-2`).value = `Indikator\tBuruk\tBaik\tIntensif\tTradisional\nFCR\t3.0\t1.0\t1.4\t2.2\nProfit\t0\t100\t80\t40\nBiaya Pakan\t20\t5\t15\t8`;
    
    toast("Data sampel Rapfish berhasil dimuat. Silakan klik Jalankan.");
}

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `<span style="color:var(--success); font-size:16px;">✓</span> ${msg}`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 300); }, 2500);
}

// Copy to Word Feature
function copyForWord(containerId) {
    const el = document.getElementById(containerId);
    if(!el) return;
    
    // Create a temporary clone to remove buttons before copying
    const clone = el.cloneNode(true);
    const buttons = clone.querySelectorAll('button');
    buttons.forEach(b => b.remove());
    
    // Create hidden div, append clone, copy, remove
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.position = 'absolute';
    hiddenDiv.style.left = '-9999px';
    hiddenDiv.appendChild(clone);
    document.body.appendChild(hiddenDiv);
    
    const range = document.createRange();
    range.selectNode(hiddenDiv);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        document.execCommand('copy');
        toast("Hasil berhasil disalin. Silakan Paste (Ctrl+V) di dokumen Word Anda.");
    } catch(err) {
        alert("Gagal menyalin. Silakan blok tabel secara manual dan copy.");
    }
    
    window.getSelection().removeAllRanges();
    document.body.removeChild(hiddenDiv);
}

// --- CORE UTILS ---
function switchView(id, el) {
  document.querySelectorAll('.tab-pane').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('active'));
  document.getElementById(id).classList.add('active'); el.classList.add('active');
}
function toggleTheme() {
    const html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    Chart.helpers.each(Chart.instances, function(instance){ instance.update(); });
}
function parseMatrix(text, hasGroup=false) {
    let rows = text.trim().split('\n').map(r=>r.trim().split(/\t+|,|;/));
    if(rows.length < 2) return null;
    let headers = rows[0], labels = [], groups = [], data = [];
    for(let i=1; i<rows.length; i++) {
        if(rows[i].length < 2) continue;
        labels.push(rows[i][0]);
        if(hasGroup) { groups.push(rows[i][1]); data.push(rows[i].slice(2).map(Number)); }
        else { data.push(rows[i].slice(1).map(Number)); }
    }
    return {headers, labels, groups, data};
}
function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return { txt: isDark ? '#94A3B8' : '#475569', grid: isDark ? '#334155' : '#E2E8F0', pal: ['#A855F7', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'] };
}
function openDialog(id) { document.getElementById(id).classList.add('active'); }
function closeDialog(id) { document.getElementById(id).classList.remove('active'); }
function showHelp() { openDialog('dlgHelp'); }

// --- 1. RAPFISH (ANCHORED PROJECTION) ---
let dimCount = 1; let rapChart = null;
function addDim() {
    dimCount++; const c = document.getElementById('rapfishInputs');
    const div = document.createElement('div'); div.className = 'card'; div.id = `dim-card-${dimCount}`;
    div.innerHTML = `<div class="card-title" style="margin-bottom: 10px;"><input type="text" value="Dimensi ${dimCount}" class="form-control" style="background:transparent; border:none; color:var(--primary); font-weight:bold; font-size:14px; width: 250px;" id="dim-name-${dimCount}"><button class="btn-icon" onclick="this.parentElement.parentElement.remove()" title="Hapus Dimensi">🗑️</button></div><textarea class="matrix-input rapfish-matrix" id="dim-data-${dimCount}" placeholder="Indikator&#9;Buruk&#9;Baik&#9;Stasiun_A&#9;Stasiun_B"></textarea>`;
    c.appendChild(div);
}
function runRapfish() {
    const tas = document.querySelectorAll('.rapfish-matrix');
    let results = [], fNames = [];
    tas.forEach((ta, idx) => {
        let p = parseMatrix(ta.value); if(!p) return;
        if(idx===0) fNames = p.headers.slice(3);
        let bad = [], good = [], F = fNames.map(()=>[]);
        for(let i=0; i<p.data.length; i++) {
            bad.push(p.data[i][0]); good.push(p.data[i][1]);
            fNames.forEach((_, fi) => F[fi].push(p.data[i][2+fi]));
        }
        // Anchored Projection Math
        let scores = fNames.map((_, fi) => {
            let num = 0, den = 0;
            for(let j=0; j<bad.length; j++) {
                let r = good[j] - bad[j]; if(r===0) r=1e-9;
                let projG = (good[j]-bad[j])/r; // Always 1
                let projF = (F[fi][j]-bad[j])/r; // Normalized position
                num += projF * projG; den += projG * projG;
            }
            let s = (num / den) * 100;
            return Math.max(0, Math.min(100, s)); 
        });
        
        let dimNameInput = ta.previousElementSibling.querySelector('input');
        let dimName = dimNameInput ? dimNameInput.value : `D${idx+1}`;
        results.push({name: dimName, scores});
    });
    if(!results.length) return alert("Data kosong atau format salah.");
    
    // Render Chart
    document.getElementById('rapfishOutput').style.display = 'block';
    let {txt, grid, pal} = getChartColors();
    let datasets = fNames.map((n, i) => ({ label: n, data: results.map(r=>r.scores[i]), borderColor: pal[i%pal.length], backgroundColor: pal[i%pal.length]+'33', borderWidth: 2 }));
    if(rapChart) rapChart.destroy();
    rapChart = new Chart(document.getElementById('rapfishRadar'), { type: 'radar', data: {labels: results.map(r=>r.name), datasets}, options: { maintainAspectRatio:false, scales:{r:{min:0,max:100, grid:{color:grid}, angleLines:{color:grid}, pointLabels:{color:txt}, ticks:{color:txt, backdropColor:'transparent'}}}, plugins:{legend:{labels:{color:txt}}} } });
    
    // Render Table
    let th = `<table><thead><tr><th>Stasiun (Lokasi)</th>` + results.map(r=>`<th>${r.name}</th>`).join('') + `<th>Rata-rata Indeks</th></tr></thead><tbody>`;
    let isBad = false;
    fNames.forEach((n, i) => {
        let avg = results.reduce((sum, r)=>sum+r.scores[i], 0) / results.length;
        if(avg < 50) isBad = true;
        th += `<tr><td style="font-weight:bold; color:var(--text);">${n}</td>` + results.map(r=>`<td style="color:${r.scores[i]>50?'var(--success)':'var(--danger)'}; font-weight:500;">${r.scores[i].toFixed(2)}%</td>`).join('') + `<td style="font-weight:bold; background:var(--surface-hover);">${avg.toFixed(2)}%</td></tr>`;
    });
    document.getElementById('rapfishTable').innerHTML = th + `</tbody></table>`;
    
    // Interpretasi
    let interpretation = `<div class="r-note"><b>Interpretasi Status Keberlanjutan:</b><br>
    Model proyeksi skala 0-100%. Nilai indeks <b>&gt; 50%</b> mengindikasikan status <b>Berkelanjutan</b> (Sustainable) pada dimensi tersebut. Nilai <b>&lt; 50%</b> mengindikasikan status <b>Kurang Berkelanjutan</b> (Unsustainable). <br><br>
    <i>Berdasarkan nilai rata-rata, sistem Anda saat ini dinilai <b>${isBad ? 'memiliki beberapa faktor pembatas kritis (<50%)' : 'berada pada batas aman yang berkelanjutan (>50%)'}</b>.</i></div>`;
    document.getElementById('rapfishInterpret').innerHTML = interpretation;
}

// --- 2. PCA + BIPLOT ---
let pcaSc, pcaBp;
function runPCA() {
    let p = parseMatrix(document.getElementById('pcaInput').value); if(!p) return alert("Data kosong");
    let Z = [], n = p.data.length, m = p.data[0].length;
    let means = Array(m).fill(0), sds = Array(m).fill(0);
    for(let j=0; j<m; j++) { for(let i=0; i<n; i++) means[j]+=p.data[i][j]; means[j]/=n; }
    for(let j=0; j<m; j++) { for(let i=0; i<n; i++) sds[j]+=Math.pow(p.data[i][j]-means[j],2); sds[j]=Math.sqrt(sds[j]/(n-1))||1; }
    for(let i=0; i<n; i++) { Z.push([]); for(let j=0; j<m; j++) Z[i][j] = (p.data[i][j]-means[j])/sds[j]; }
    
    let cov = numeric.mul(numeric.dot(numeric.transpose(Z), Z), 1/(n-1));
    let eig = numeric.eig(cov);
    
    let pairs = [];
    for(let i=0; i<m; i++) { if(!eig.lambda.y || Math.abs(eig.lambda.y[i]) < 1e-10) pairs.push({ val: eig.lambda.x[i], vec: eig.E.x.map(r=>r[i]) }); }
    pairs.sort((a,b)=>b.val-a.val);
    
    let vals = pairs.map(x=>x.val), vecs = numeric.transpose(pairs.map(x=>x.vec));
    let totVar = vals.reduce((a,b)=>a+b,0), varExp = vals.map(v=>(v/totVar)*100);
    let scores = numeric.dot(Z, vecs);
    
    // Loadings for Biplot
    let loadings = [];
    for(let i=0; i<m; i++) loadings.push([ vecs[i][0]*Math.sqrt(vals[0]), vecs[i][1]*Math.sqrt(vals[1]) ]);
    
    document.getElementById('pcaOutput').style.display = 'block';
    let {txt, grid, pal} = getChartColors();
    
    if(pcaSc) pcaSc.destroy();
    pcaSc = new Chart(document.getElementById('pcaScree'), { type: 'bar', data: {labels: varExp.map((_,i)=>`PC${i+1}`), datasets:[{label:'% Varians', data:varExp, backgroundColor:pal[0]}]}, options:{maintainAspectRatio:false, scales:{y:{grid:{color:grid},ticks:{color:txt}}, x:{grid:{display:false},ticks:{color:txt}}}, plugins:{legend:{display:false}}} });
    
    // Biplot
    let scatterData = scores.map((s,i) => ({x: s[0], y: s[1], label: p.labels[i]}));
    let loadingData = loadings.map((l,i) => ({x: l[0]*Math.max(...scores.map(s=>Math.abs(s[0]))), y: l[1]*Math.max(...scores.map(s=>Math.abs(s[1]))), label: p.headers[i+1]}));
    
    if(pcaBp) pcaBp.destroy();
    pcaBp = new Chart(document.getElementById('pcaBiplot'), {
        type: 'scatter',
        data: { datasets: [
            { label:'Sampel Observasi', data:scatterData, backgroundColor:pal[1], pointRadius:5 },
            { label:'Vektor Parameter (Loadings)', data:loadingData, backgroundColor:pal[3], pointStyle:'triangle', pointRadius:7 }
        ]},
        options: { maintainAspectRatio:false, plugins:{tooltip:{callbacks:{label:c=>c.raw.label}}, legend:{labels:{color:txt}}}, scales:{x:{grid:{color:grid},ticks:{color:txt},title:{display:true,text:`PC1 (${varExp[0].toFixed(1)}%)`,color:txt}}, y:{grid:{color:grid},ticks:{color:txt},title:{display:true,text:`PC2 (${varExp[1].toFixed(1)}%)`,color:txt}}} }
    });

    let tbl = `<table><thead><tr><th>Komponen Utama</th><th>Eigenvalue</th><th>% Varians</th><th>Kumulatif %</th></tr></thead><tbody>`;
    let cum = 0;
    vals.forEach((v,i) => { cum+=varExp[i]; tbl += `<tr><td>PC${i+1}</td><td style="font-family:var(--font-mono);">${v.toFixed(4)}</td><td style="color:var(--primary); font-weight:600;">${varExp[i].toFixed(2)}%</td><td style="font-weight:bold;">${cum.toFixed(2)}%</td></tr>`; });
    document.getElementById('pcaTable').innerHTML = tbl + `</tbody></table>`;
    
    let interpretation = `<div class="r-note"><b>Interpretasi PCA:</b><br>
    Dua Komponen Utama pertama (PC1 dan PC2) mampu merangkum dan menjelaskan <b>${(varExp[0]+varExp[1]).toFixed(1)}%</b> dari seluruh varians/informasi data asli. <br>
    <b>Membaca Biplot:</b> Vektor (garis segitiga) yang searah atau membentuk sudut sempit menunjukkan korelasi positif antar parameter. Titik sampel (lingkaran) yang berada di arah vektor tertentu menandakan sampel tersebut memiliki nilai dominan pada parameter tersebut.</div>`;
    document.getElementById('pcaInterpret').innerHTML = interpretation;
}

// --- 3. K-MEANS++ ---
let kmSc, kmElb;
function distSq(a, b) { let d=0; for(let i=0; i<a.length; i++) d+=Math.pow(a[i]-b[i],2); return d; }
function runKMeans() {
    let p = parseMatrix(document.getElementById('kmeansInput').value); if(!p) return alert("Data kosong");
    let K = parseInt(document.getElementById('kVal').value), n = p.data.length, m = p.data[0].length;
    
    // Elbow Method
    let wcssArr = []; let maxK = Math.min(10, n-1);
    for(let kTest=1; kTest<=maxK; kTest++) {
        let {wcss} = runSingleKMeans(p.data, kTest); wcssArr.push(wcss);
    }
    
    // Main Run
    let {assigns} = runSingleKMeans(p.data, K);
    
    document.getElementById('kmeansOutput').style.display = 'block';
    let {txt, grid, pal} = getChartColors();
    if(kmElb) kmElb.destroy();
    kmElb = new Chart(document.getElementById('kmeansElbow'), { type: 'line', data: {labels: Array.from({length:maxK},(_,i)=>i+1), datasets:[{label:'WCSS', data:wcssArr, borderColor:pal[0], tension:0.2, pointRadius:4}]}, options:{maintainAspectRatio:false, scales:{y:{grid:{color:grid},ticks:{color:txt}}, x:{grid:{color:grid},ticks:{color:txt}}}, plugins:{legend:{labels:{color:txt}}}} });
    
    let ds = Array.from({length:K}, (_,i)=>({label:`Klaster ${i+1}`, data:[], backgroundColor:pal[i%pal.length], pointRadius:6}));
    assigns.forEach((k, i) => ds[k].data.push({x: p.data[i][0], y: p.data[i][1]||0, label:p.labels[i]}));
    if(kmSc) kmSc.destroy();
    kmSc = new Chart(document.getElementById('kmeansScatter'), { type: 'scatter', data: {datasets:ds}, options:{maintainAspectRatio:false, plugins:{tooltip:{callbacks:{label:c=>c.raw.label}}, legend:{labels:{color:txt}}}, scales:{x:{grid:{color:grid},ticks:{color:txt}, title:{display:true, text:p.headers[1]||'Var 1', color:txt}}, y:{grid:{color:grid},ticks:{color:txt}, title:{display:true, text:p.headers[2]||'Var 2', color:txt}}}} });
    
    // Group table
    let members = Array(K).fill(0).map(()=>[]);
    assigns.forEach((k, i) => members[k].push(p.labels[i]));
    let tbl = `<table><thead><tr><th>Klaster</th><th>Jumlah Sampel</th><th>Anggota</th></tr></thead><tbody>`;
    members.forEach((mem, i) => {
        tbl += `<tr><td style="font-weight:bold; color:${pal[i%pal.length]}">Klaster ${i+1}</td><td>${mem.length}</td><td>${mem.join(', ')}</td></tr>`;
    });
    
    let interpretation = `<div class="r-note"><b>Interpretasi K-Means & Elbow:</b><br>
    <b>Metode Elbow:</b> Amati grafik WCSS (Within-Cluster Sum of Square). Titik K optimal biasanya berada di "siku" patahan di mana grafik mulai melandai secara perlahan.<br>
    Pada tabel di atas, dataset telah dibagi menjadi <b>${K} klaster</b> yang saling eksklusif. Anggota di dalam klaster yang sama memiliki tingkat kemiripan (jarak Euclidean terdekat) terhadap titik pusat (Centroid) klasternya.</div>`;
    
    document.getElementById('kmeansInterpret').innerHTML = `<div class="table-wrap">${tbl}</tbody></table></div>` + interpretation;
}
function runSingleKMeans(data, K) {
    let n = data.length, m = data[0].length, cents = [data[Math.floor(Math.random()*n)]];
    while(cents.length < K) {
        let dists = data.map(pt => Math.min(...cents.map(c => distSq(pt, c))));
        let sum = dists.reduce((a,b)=>a+b,0), rnd = Math.random()*sum, cum=0;
        for(let i=0; i<n; i++) { cum+=dists[i]; if(cum>=rnd) { cents.push(data[i]); break; } }
    }
    let assigns = Array(n).fill(-1), changed=true, iter=0;
    while(changed && iter<100) {
        changed = false; iter++;
        for(let i=0; i<n; i++) {
            let bestK=0, minD=distSq(data[i], cents[0]);
            for(let k=1; k<K; k++) { let d=distSq(data[i], cents[k]); if(d<minD) { minD=d; bestK=k; } }
            if(assigns[i] !== bestK) { assigns[i]=bestK; changed=true; }
        }
        let sums = Array(K).fill(0).map(()=>Array(m).fill(0)), counts = Array(K).fill(0);
        for(let i=0; i<n; i++) { let k=assigns[i]; counts[k]++; for(let j=0; j<m; j++) sums[k][j]+=data[i][j]; }
        for(let k=0; k<K; k++) if(counts[k]>0) for(let j=0; j<m; j++) cents[k][j] = sums[k][j]/counts[k];
    }
    let wcss = 0; for(let i=0; i<n; i++) wcss += distSq(data[i], cents[assigns[i]]);
    return {assigns, wcss};
}

// --- 4. HIERARCHICAL CLUSTERING ---
function runHCA() {
    let p = parseMatrix(document.getElementById('hcaInput').value); if(!p) return alert("Data kosong");
    let n = p.data.length, dists = [], clusters = p.labels.map((l,i)=>({id:i, label:l, size:1, depth:0}));
    for(let i=0; i<n; i++) { dists[i]=[]; for(let j=0; j<n; j++) dists[i][j] = Math.sqrt(distSq(p.data[i], p.data[j])); }
    
    let cCount = n, tree = [];
    while(cCount > 1) {
        let minD = Infinity, c1=-1, c2=-1;
        for(let i=0; i<n; i++) {
            if(!clusters[i]) continue;
            for(let j=i+1; j<n; j++) {
                if(!clusters[j]) continue;
                if(dists[i][j] < minD) { minD=dists[i][j]; c1=i; c2=j; }
            }
        }
        let merged = { left:clusters[c1], right:clusters[c2], dist:minD, size: clusters[c1].size+clusters[c2].size, depth: Math.max(clusters[c1].depth, clusters[c2].depth)+1 };
        tree = merged;
        for(let i=0; i<n; i++) {
            if(i!==c1 && i!==c2 && clusters[i]) {
                let nd = (dists[c1][i]*clusters[c1].size + dists[c2][i]*clusters[c2].size) / merged.size;
                dists[c1][i] = dists[i][c1] = nd;
            }
        }
        clusters[c1] = merged; clusters[c2] = null; cCount--;
    }
    
    document.getElementById('hcaOutput').style.display = 'block';
    const svgW = 600, svgH = Math.max(300, n*25), pad=50;
    let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%">`;
    let leafY = pad, maxDist = tree.dist;
    
    function drawNode(node) {
        if(!node.left && !node.right) {
            let y = leafY; leafY += (svgH-2*pad)/n;
            svg += `<text x="${svgW-pad+5}" y="${y+4}" style="fill:var(--text); font-family:var(--font-mono); font-size:12px; font-weight:bold;">${node.label}</text>`;
            return {x: svgW-pad, y: y};
        }
        let posL = drawNode(node.left), posR = drawNode(node.right);
        let x = svgW - pad - (node.dist/maxDist)*(svgW-2*pad);
        let y = (posL.y + posR.y)/2;
        svg += `<path d="M ${posL.x} ${posL.y} L ${x} ${posL.y} L ${x} ${posR.y} L ${posR.x} ${posR.y}" />`;
        svg += `<path d="M ${x} ${y} L ${x+10} ${y}" stroke-dasharray="2,2" opacity="0.3"/>`;
        return {x: x, y: y};
    }
    drawNode(tree);
    document.getElementById('svgContainer').innerHTML = svg + `</svg>`;
    
    let interpretation = `<div class="r-note" style="margin-top:20px;"><b>Interpretasi Dendrogram UPGMA:</b><br>
    Sumbu vertikal menunjukkan pengelompokan, sedangkan sumbu horizontal menunjukkan jarak Euclidean (tingkat ketidakmiripan). Garis vertikal yang menghubungkan dua cabang di sebelah kanan (nilai jarak rendah) menunjukkan bahwa kelompok sampel tersebut memiliki kemiripan parameter yang sangat tinggi. Sebaliknya, titik pisah di sebelah kiri menandakan perbedaan karakteristik utama.</div>`;
    document.getElementById('hcaInterpret').innerHTML = interpretation;
}

// --- 5. ANOSIM ---
function runANOSIM() {
    let p = parseMatrix(document.getElementById('anosimInput').value, true); if(!p) return alert("Data kosong");
    let n = p.data.length, dists = [];
    for(let i=0; i<n; i++) { for(let j=i+1; j<n; j++) { dists.push({i, j, d: Math.sqrt(distSq(p.data[i], p.data[j]))}); } }
    dists.sort((a,b)=>a.d - b.d);
    dists.forEach((obj, idx) => obj.rank = idx+1);
    
    function calcR(groupsArr) {
        let rw=0, cw=0, rb=0, cb=0;
        dists.forEach(o => {
            if(groupsArr[o.i] === groupsArr[o.j]) { rw += o.rank; cw++; } else { rb += o.rank; cb++; }
        });
        return ((rb/cb) - (rw/cw)) / (n*(n-1)/4);
    }
    
    let R_obs = calcR(p.groups), count = 0, perms = 999;
    for(let pStep=0; pStep<perms; pStep++) {
        let shuf = [...p.groups].sort(()=>Math.random()-0.5);
        if(calcR(shuf) >= R_obs) count++;
    }
    let pVal = (count+1)/(perms+1);
    
    let html = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;"><div class="card-title" style="margin:0; border:none; padding:0;">Hasil ANOSIM (Iterasi Permutasi: ${perms})</div><button class="btn btn-success btn-sm" onclick="copyForWord('anosimOutput')"><span class="dsw-icon-styled">📋</span> Salin ke Word</button></div>
    <div style="font-size:18px; margin-bottom:10px;">R-Statistic: <b style="color:var(--primary);">${R_obs.toFixed(4)}</b> | P-Value: <b style="color:${pVal<=0.05?'var(--success)':'var(--danger)'}">${pVal.toFixed(4)}</b></div>
    <div class="r-note"><b>Interpretasi Analisis Vektor:</b><br>
    Nilai P-Value <b>${pVal <= 0.05 ? '< 0.05 (Signifikan)' : '> 0.05 (Tidak Signifikan)'}</b>. Hal ini mengindikasikan bahwa <b>${pVal <= 0.05 ? 'Terdapat' : 'Tidak terdapat'} perbedaan komposisi/struktur multivariat yang nyata</b> antar grup perlakuan.<br><br>
    Nilai R-Statistic (Global R) berkisar antara -1 hingga 1. Nilai R yang mendekati 1 berarti kelompok terpisah secara sempurna (sangat berbeda). Nilai R yang mendekati 0 berarti sampel tercampur secara acak (homogen antar dan dalam grup).</div>`;
    
    document.getElementById('anosimOutput').style.display = 'block';
    document.getElementById('anosimOutput').innerHTML = html;
}

// --- 6. LDA ---
let ldaChart = null;
function runLDA() {
    let p = parseMatrix(document.getElementById('ldaInput').value, true); if(!p) return alert("Data kosong");
    let n = p.data.length, m = p.data[0].length;
    let classes = [...new Set(p.groups)]; let cCount = classes.length;
    if(cCount < 2) return alert("Butuh minimal 2 grup untuk didiskriminasi!");
    
    let globalMean = Array(m).fill(0);
    for(let i=0; i<n; i++) for(let j=0; j<m; j++) globalMean[j] += p.data[i][j]/n;
    
    let SW = Array(m).fill(0).map(()=>Array(m).fill(0));
    let SB = Array(m).fill(0).map(()=>Array(m).fill(0));
    
    classes.forEach(c => {
        let cData = p.data.filter((_,i)=>p.groups[i]===c); let cn = cData.length;
        let cMean = Array(m).fill(0);
        cData.forEach(row => { for(let j=0; j<m; j++) cMean[j] += row[j]/cn; });
        cData.forEach(row => { for(let i=0; i<m; i++) for(let j=0; j<m; j++) SW[i][j] += (row[i]-cMean[i])*(row[j]-cMean[j]); });
        for(let i=0; i<m; i++) for(let j=0; j<m; j++) SB[i][j] += cn * (cMean[i]-globalMean[i])*(cMean[j]-globalMean[j]);
    });
    
    for(let i=0; i<m; i++) SW[i][i] += 0.0001; 
    let invSW = numeric.inv(SW); let mat = numeric.dot(invSW, SB);
    let eig = numeric.eig(mat);
    
    let pairs = [];
    for(let i=0; i<m; i++) { if(!eig.lambda.y || Math.abs(eig.lambda.y[i]) < 1e-10) pairs.push({ val: eig.lambda.x[i], vec: eig.E.x.map(r=>r[i]) }); }
    pairs.sort((a,b)=>b.val-a.val);
    
    let ld1 = pairs[0].vec, ld2 = pairs.length>1 ? pairs[1].vec : Array(m).fill(0);
    let scores = [];
    for(let i=0; i<n; i++) {
        let s1=0, s2=0;
        for(let j=0; j<m; j++) { s1 += p.data[i][j]*ld1[j]; s2 += p.data[i][j]*ld2[j]; }
        scores.push({x:s1, y:s2, grp: p.groups[i], lbl: p.labels[i]});
    }
    
    document.getElementById('ldaOutput').style.display = 'block';
    let {txt, grid, pal} = getChartColors();
    let datasets = classes.map((c, i) => ({ label: c, data: scores.filter(s=>s.grp===c), backgroundColor: pal[i%pal.length], pointRadius: 6 }));
    
    if(ldaChart) ldaChart.destroy();
    ldaChart = new Chart(document.getElementById('ldaChart'), { type: 'scatter', data: {datasets}, options:{maintainAspectRatio:false, plugins:{tooltip:{callbacks:{label:c=>c.raw.lbl}}, legend:{labels:{color:txt}}}, scales:{x:{grid:{color:grid},ticks:{color:txt},title:{display:true,text:'LD1',color:txt}}, y:{grid:{color:grid},ticks:{color:txt},title:{display:true,text:'LD2',color:txt}}}} });
    
    let tbl = `<table><thead><tr><th>Fungsi Diskriminan</th><th>Eigenvalue (Daya Pisah)</th></tr></thead><tbody>`;
    pairs.slice(0, Math.min(cCount-1, m)).forEach((p,i) => tbl += `<tr><td>LD${i+1}</td><td style="font-family:var(--font-mono); color:var(--success); font-weight:bold;">${p.val.toFixed(4)}</td></tr>`);
    document.getElementById('ldaTable').innerHTML = tbl + `</tbody></table>`;
    
    let interpretation = `<div class="r-note"><b>Interpretasi Diskriminan:</b><br>
    Nilai Eigenvalue merepresentasikan "Daya Pisah". Semakin tinggi nilai Eigenvalue pada LD tertentu, semakin kuat komponen tersebut membedakan antar kelompok. Plot di samping memetakan pemisahan kelas (memaksimalkan varians antar-grup dan meminimalkan varians dalam-grup) secara simultan.</div>`;
    document.getElementById('ldaInterpret').innerHTML = interpretation;
}

// Init view
switchView('v-rapfish', document.querySelector('.menu-item.active'));