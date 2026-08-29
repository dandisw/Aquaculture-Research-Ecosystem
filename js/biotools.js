// ===================================================================
// SAMPLE DATA LOADER 
// ===================================================================
function loadSampleBioTools(type) {
    switch(type) {
        case 'blast':
            document.getElementById('queryInput').value = 'GGCGCCTGATCCGGAATTCTGGCCGCCAGCCTGTTCCTCCTTTATCTAGTATTTGGTGCCTGGGCCGGGATAGTAGGGACCGCCCTAAGCCTCCTAATTCGTGCTGAATTAGGCCAACCTGGGACCCTACTAGGAGACGACCAAATTTATAATGTTATCGTTACAGCCCATGCCTTCGTAATAATTTTCTTTAT';
            break;
        case 'manipulasi':
            document.getElementById('rawSeq').value = 'ATGCGTACTAGCTAGCTAGCTGATCGATCGTAGCTAGCTAGCTAGCTAGC';
            liveSeqStats();
            break;
        case 'pairwise':
            document.getElementById('alignSeqA').value = 'ATGCGTACGTAGCTAGCTAGGATCCTTCGATCGATCG';
            document.getElementById('alignSeqB').value = 'ATGCGTACGTGGCTAGCTAGGATCCTTCGATCGAACG';
            break;
        case 'msa':
            document.getElementById('msaInput').value = `>Isolat_A\nATGCGTACGTAGCTAGCTAGGATCCTTCGATCGATCG\n>Isolat_B\nATGCGTACGTAGCTAGCTAGGATCCTTCGATCGAACG\n>Isolat_C\nATGCGTACGTGGCTAGCTAGGATCCTTCGATCGATCG\n>Isolat_D\nATGCGTACGTGGCTAGCTAGGATCCTTCGATCGAACG\n>Isolat_E\nATGCGTACGTGGCTAGC----ATCCTTCGATCGAACG`;
            break;
        case 'protein':
            document.getElementById('proteinInput').value = 'MGLSDGEWQLVLNVWGKVEADIPGHGQEVLIRLFKGHPETLEKFDKFKHLKSEDEMKASEDLKKHGATVLTALGGILKKKGHHEAEIKPLAQSHATKHKIPVKYLEFISECIIQVLQSKHPGDFGADAQGAMNKALELFRKDMASNYKELGFQG';
            break;
        case 'orf':
            document.getElementById('orfInput').value = 'TCGATCGATCATGGCGTACGTAGCTAGCTAGGATCCTTCGATCGATCGATCGACTGCAGGCGTACGTAGCTAGCTAGGATCCTTCGATCGATCGATCGACTGCAGTAAATCGATCGATGCGTACGTAGCTAGCTAGGATCCTTCGATCGATCGATCGACTGCAGGCGTACGTAGCTAGCTAGGATCCTTCGATCGATCGATCGACTGCAGTAAATCGATCG';
            break;
        case 'digest':
            document.getElementById('digestInput').value = 'GCGGAATTCATGCGTACGTAGCTAGCTAGGATCCTTCGATCGATCGATCGACTGCAGGC';
            break;
        case 'phylo':
            document.getElementById('fastaInput').value = `>Isolat_A_Nila\nATGCGTACGTAGCTAGCTAGGATCCTTCGATCGATCG\n>Isolat_B_Nila\nATGCGTACGTAGCTAGCTAGGATCCTTCGATCGAACG\n>Isolat_C_Lele\nATGCGTACGTGGCTAGCTAGGATCCTTCGATCGATCG\n>Isolat_D_Lele\nATGCGTACGTGGCTAGCTAGGATCCTTCGATCGAACG`;
            break;
        case 'primer-calc':
            document.getElementById('pFwd').value = 'ATGCGTACGTAGCTAGCTA';
            document.getElementById('pRev').value = 'CGATGCTAGCTAGCTAGCT';
            calcPrimer();
            break;
        case 'primer-auto':
            document.getElementById('targetGen').value = 'ATGCGTACGTAGCTAGCTATTCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGAGCTAGCTAGCTAGCATCGATGCGTACGTAGCTAGCTATTCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGAGCTAGCTAGCTAGCATCG';
            break;
        case 'mol3d':
            if (typeof loadMol3DPreset === 'function') loadMol3DPreset('1CRN');
            break;
    }
    toast("Data sampel berhasil dimuat. Silakan klik tombol analisis.");
}

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `<span style="color:var(--success); font-size:16px;">✓</span> ${msg}`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 300); }, 2500);
}

// ===================================================================
// UTILITIES
// ===================================================================
function switchView(viewId, el) {
  document.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  el.classList.add('active');
  if (viewId === 'v-mol3d' && typeof Mol3DState !== 'undefined') {
    setTimeout(() => {
      if (Mol3DState.glViewer) { Mol3DState.glViewer.resize(); Mol3DState.glViewer.render(); }
      if (Mol3DState.fallbackCanvas && typeof resizeMol3DFallbackCanvas === 'function') resizeMol3DFallbackCanvas();
    }, 120);
  }
}
function openSub(btn, id, grp) {
  const pane = btn.closest('.tab-pane');
  pane.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  pane.querySelectorAll('.'+grp).forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
}
function toggleTheme() {
  const h = document.documentElement;
  const next = h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  h.setAttribute('data-theme', next);
  localStorage.setItem('ares_theme', next);
}
function copyText(elementId) {
  const text = document.getElementById(elementId);
  if(text.tagName === 'DIV') {
      const range = document.createRange();
      range.selectNodeContents(text); // select contents instead of node itself for better paste format
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
  } else {
      text.select(); document.execCommand('copy');
  }
  toast("Berhasil disalin ke clipboard!");
}
// Copy to Word Feature
function copyForWord(containerId) {
    const el = document.getElementById(containerId);
    if(!el) return;
    const clone = el.cloneNode(true);
    const buttons = clone.querySelectorAll('button');
    buttons.forEach(b => b.remove());
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.position = 'absolute'; hiddenDiv.style.left = '-9999px';
    hiddenDiv.appendChild(clone); document.body.appendChild(hiddenDiv);
    const range = document.createRange(); range.selectNodeContents(hiddenDiv);
    window.getSelection().removeAllRanges(); window.getSelection().addRange(range);
    try { document.execCommand('copy'); toast("Tabel berhasil disalin. Silakan Paste (Ctrl+V) di dokumen Word Anda."); } 
    catch(err) { alert("Gagal menyalin. Silakan blok tabel secara manual dan copy."); }
    window.getSelection().removeAllRanges(); document.body.removeChild(hiddenDiv);
}

function cleanDNA(seq) { return seq.toUpperCase().replace(/[^ATCGU-]/g, ''); }
function openDialog(id) { document.getElementById(id).classList.add('active'); }
function closeDialog(id) { document.getElementById(id).classList.remove('active'); }
function switchAboutTab(tabId) {
    document.querySelectorAll('.about-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.about-section').forEach(s => s.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('sec-' + tabId).classList.add('active');
}

// ===================================================================
// COLORIZER UNTUK SEQUENCES
// ===================================================================
function colorizeSeq(seq) {
    return seq.split('').map(c => {
        switch(c) {
            case 'A': return '<span style="color:#ef4444; font-weight:600;">A</span>';
            case 'T': return '<span style="color:#10b981; font-weight:600;">T</span>';
            case 'U': return '<span style="color:#10b981; font-weight:600;">U</span>';
            case 'C': return '<span style="color:#3b82f6; font-weight:600;">C</span>';
            case 'G': return '<span style="color:#f59e0b; font-weight:600;">G</span>';
            case '-': return '<span style="color:#64748b; font-weight:600;">-</span>';
            default: return `<span style="font-weight:600;">${c}</span>`;
        }
    }).join('');
}

// ===================================================================
// MODULE 1: NCBI BLAST & MANIPULASI BAA
// ===================================================================
let globalNCBIData = [];
async function runNCBIAnalyzer() {
    const rawQuery = document.getElementById('queryInput').value.trim();
    const filter = document.getElementById('filterType').value;
    const maxOutput = parseInt(document.getElementById('maxHits').value) || 100;
    
    if (!rawQuery) { alert("Masukkan kata kunci atau sekuens pencarian!"); return; }

    const cleanedSeq = rawQuery.toUpperCase().replace(/\s/g, '');
    const isSequence = /^[ATCGN]+$/.test(cleanedSeq) && cleanedSeq.length > 20;

    const btn = document.getElementById('btnSearch');
    const resultArea = document.getElementById('ncbiResultArea');
    const tbody = document.getElementById('ncbiBody');
    const statusText = document.getElementById('ncbiStatusText');

    btn.innerHTML = '<span class="spinner"></span> Menganalisis...'; btn.disabled = true;
    resultArea.style.display = 'block'; tbody.innerHTML = ''; globalNCBIData = [];

    try {
        if (isSequence) {
            statusText.innerHTML = "Sekuens terdeteksi. Mengirim ke server NCBI QBlast <br><span style='font-size:12px; color:var(--text3);'>(Mohon tunggu 30-60 detik)</span>";
            statusText.style.color = "var(--warning)";

            const putParams = new URLSearchParams({ CMD: 'Put', PROGRAM: 'blastn', DATABASE: 'nt', QUERY: cleanedSeq });
            const putRes = await fetch('https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi', { method: 'POST', body: putParams });
            const putText = await putRes.text();
            
            const ridMatch = putText.match(/RID = (.*)/);
            if (!ridMatch) throw new Error("Gagal mendapatkan Request ID.");
            const rid = ridMatch[1];

            let isReady = false; let pollingAttempts = 0;
            while (!isReady && pollingAttempts < 25) { 
                await new Promise(r => setTimeout(r, 6000));
                pollingAttempts++;
                statusText.innerHTML = `Menunggu hasil penjajaran dari NCBI... <br><span style='font-size:12px; color:var(--text3);'>(Pengecekan ${pollingAttempts}/25)</span>`;
                const statRes = await fetch(`https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_OBJECT=SearchInfo&RID=${rid}`);
                const statText = await statRes.text();
                if (statText.includes('Status=FAILED') || statText.includes('Status=UNKNOWN')) throw new Error("Dibatalkan oleh server.");
                if (statText.includes('Status=READY')) isReady = true;
            }
            if (!isReady) throw new Error("Waktu tunggu habis.");

            statusText.textContent = "Mengunduh data alignment...";
            const getRes = await fetch(`https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_TYPE=Text&FORMAT_OBJECT=Alignment&ALIGNMENT_VIEW=Tabular&RID=${rid}`);
            const getText = await getRes.text();
            
            const lines = getText.split('\n').filter(l => l.trim() && !l.startsWith('#'));
            let blastHits = [];
            for (let i = 0; i < Math.min(lines.length, maxOutput * 2); i++) {
                const cols = lines[i].split('\t');
                if (cols.length >= 12) blastHits.push({ acc: cols[1], ident: parseFloat(cols[2]).toFixed(2), evalue: cols[10], score: cols[11] });
            }
            if (blastHits.length === 0) throw new Error("Tidak ada homologi ditemukan.");

            statusText.textContent = `Memfilter diversitas dari ${blastHits.length} kandidat...`;
            const accessionList = blastHits.map(b => b.acc.split('.')[0]).slice(0, 150).join(',');
            const sumRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=nucleotide&id=${accessionList}&retmode=json`);
            const sumData = await sumRes.json();

            let sTracker = {}, gTracker = {};
            for (let hit of blastHits) {
                const uid = Object.keys(sumData.result).find(key => key !== 'uids' && sumData.result[key].caption === hit.acc.split('.')[0]);
                if (!uid) continue;
                
                const detail = sumData.result[uid], org = detail.organism || "Unknown", len = detail.slen || "N/A";
                const parts = org.split(' '); const genus = parts[0]; const species = parts.length > 1 ? `${parts[0]} ${parts[1]}` : genus;

                if (filter === 'strain') { if (sTracker[species]) continue; sTracker[species] = 1; } 
                else if (filter === 'genus') { if ((gTracker[genus] || 0) >= 2) continue; gTracker[genus] = (gTracker[genus] || 0) + 1; }

                globalNCBIData.push({ acc: hit.acc, uid: uid, organism: org, score: hit.score, evalue: hit.evalue, ident: hit.ident, length: len });
                if (globalNCBIData.length >= maxOutput) break;
            }
            statusText.textContent = `Selesai. Tampil ${globalNCBIData.length} sekuens terbaik.`;
        } else {
            statusText.textContent = "Teks terdeteksi. Mencari Accession dari database NCBI...";
            const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nucleotide&term=${encodeURIComponent(rawQuery)}&retmode=json&retmax=${maxOutput * 2}`);
            const searchData = await searchRes.json();
            const uids = searchData.esearchresult.idlist;
            if (!uids || uids.length === 0) throw new Error("0 hasil ditemukan.");

            await new Promise(r => setTimeout(r, 500)); 
            const sumRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=nucleotide&id=${uids.join(',')}&retmode=json`);
            const sumData = await sumRes.json();

            let sTracker = {}, gTracker = {};
            for (const uid of uids) {
                const detail = sumData.result[uid]; if (!detail) continue;
                const org = detail.organism || "Unknown", len = detail.slen || "0", acc = detail.caption || uid;
                const parts = org.split(' '); const genus = parts[0]; const species = parts.length > 1 ? `${parts[0]} ${parts[1]}` : genus;

                if (filter === 'strain') { if (sTracker[species]) continue; sTracker[species] = 1; } 
                else if (filter === 'genus') { if ((gTracker[genus] || 0) >= 2) continue; gTracker[genus] = (gTracker[genus] || 0) + 1; }

                globalNCBIData.push({ acc: acc, uid: uid, organism: org, score: "N/A", evalue: "N/A", ident: "N/A", length: len });
                if (globalNCBIData.length >= maxOutput) break;
            }
            statusText.textContent = `Tampil ${globalNCBIData.length} sekuens dari hasil pencarian.`;
        }

        statusText.style.color = "var(--success)";
        globalNCBIData.forEach((item, index) => {
            const tr = document.createElement('tr');
            let identColor = "var(--text)";
            if (item.ident !== "N/A") {
                const idVal = parseFloat(item.ident);
                if (idVal >= 97) identColor = "var(--success)"; else if (idVal >= 90) identColor = "var(--warning)"; else identColor = "var(--danger)";
            }
            tr.innerHTML = `
                <td style="color:var(--text3);">${index + 1}</td>
                <td><a href="https://www.ncbi.nlm.nih.gov/nuccore/${item.uid}" target="_blank" class="badge" style="text-decoration:none; color:var(--primary);">${item.acc}</a></td>
                <td style="font-style:italic; font-weight:600;">${item.organism}</td>
                <td style="font-family:var(--font-mono); font-size:12px;">${item.score}</td>
                <td style="font-family:var(--font-mono); font-size:12px;">${item.evalue}</td>
                <td style="font-family:var(--font-mono); font-size:12px; font-weight:700; color:${identColor};">${item.ident !== 'N/A' ? item.ident + '%' : 'N/A'}</td>
                <td style="font-family:var(--font-mono); font-size:12px;">${item.length} bp</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        statusText.textContent = err.message;
        statusText.style.color = "var(--danger)";
    }
    btn.innerHTML = '<span class="dsw-icon-styled">🔍</span> Analisis di NCBI'; btn.disabled = false;
}
function exportBlastCSV() {
    if (globalNCBIData.length === 0) return;
    let csv = "No,Accession,Organism,Max_Score,E_value,Identity_Pct,Length_bp\n";
    globalNCBIData.forEach((item, i) => { csv += `"${i+1}","${item.acc}","${item.organism}","${item.score}","${item.evalue}","${item.ident}","${item.length}"\n`; });
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], {type: 'text/csv'}));
    a.download = 'NCBI_Blast_Search_Results.csv'; a.click();
}

const codonTable = {'ATA':'I','ATC':'I','ATT':'I','ATG':'M','ACA':'T','ACC':'T','ACG':'T','ACT':'T','AAC':'N','AAT':'N','AAA':'K','AAG':'K','AGC':'S','AGT':'S','AGA':'R','AGG':'R','CTA':'L','CTC':'L','CTG':'L','CTT':'L','CCA':'P','CCC':'P','CCG':'P','CCT':'P','CAC':'H','CAT':'H','CAA':'Q','CAG':'Q','CGA':'R','CGC':'R','CGG':'R','CGT':'R','GTA':'V','GTC':'V','GTG':'V','GTT':'V','GCA':'A','GCC':'A','GCG':'A','GCT':'A','GAC':'D','GAT':'D','GAA':'E','GAG':'E','GGA':'G','GGC':'G','GGG':'G','GGT':'G','TCA':'S','TCC':'S','TCG':'S','TCT':'S','TTC':'F','TTT':'F','TTA':'L','TTG':'L','TAC':'Y','TAT':'Y','TAA':'*','TAG':'*','TGA':'*','TGC':'C','TGT':'C','TGG':'W'};
function liveSeqStats() { 
  const s=cleanDNA(document.getElementById('rawSeq').value); 
  document.getElementById('statLen').textContent=s.length; 
  document.getElementById('statGc').textContent=s.length>0?(((s.match(/[GC]/g)||[]).length/s.length)*100).toFixed(1):"0.0"; 
}
function processSeq(action) {
  const s=cleanDNA(document.getElementById('rawSeq').value); let o=""; if(!s)return;
  if(action==='rc'){ const m={'A':'T','T':'A','C':'G','G':'C'}; o=s.split('').reverse().map(b=>m[b]||b).join(''); }
  else if(action==='transcribe') o=s.replace(/T/g,'U');
  else if(action==='translate') { let d = s.replace(/U/g, 'T'); for (let i=0; i<d.length-2; i+=3) o += codonTable[d.substring(i, i+3)] || '?'; }
  document.getElementById('outSeq').value=o;
}
function clearSeq(){ document.getElementById('rawSeq').value=""; document.getElementById('outSeq').value=""; liveSeqStats(); }

// ===================================================================
// MODULE 2: PAIRWISE ALIGNMENT (Smith-Waterman)
// ===================================================================
function runPairwise() {
    const s1 = cleanDNA(document.getElementById('alignSeqA').value);
    const s2 = cleanDNA(document.getElementById('alignSeqB').value);
    
    if(!s1 || !s2) return alert("Masukkan kedua sekuens terlebih dahulu!");
    if(s1.length > 3000 || s2.length > 3000) return alert("Maksimal 3000 base pair untuk mempertahankan stabilitas RAM.");
    
    const match = 3, mismatch = -3, gap = -2;
    const m = s1.length, n = s2.length;
    let matrix = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    let maxScore = 0, maxI = 0, maxJ = 0;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            let diag = matrix[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? match : mismatch);
            let up = matrix[i - 1][j] + gap;
            let left = matrix[i][j - 1] + gap;
            matrix[i][j] = Math.max(0, diag, up, left);
            if (matrix[i][j] > maxScore) { maxScore = matrix[i][j]; maxI = i; maxJ = j; }
        }
    }

    let align1 = "", align2 = "", alignSym = "";
    let i = maxI, j = maxJ;
    
    while (i > 0 && j > 0 && matrix[i][j] > 0) {
        let current = matrix[i][j];
        let diag = matrix[i - 1][j - 1], up = matrix[i - 1][j], left = matrix[i][j - 1];
        if (current === diag + (s1[i - 1] === s2[j - 1] ? match : mismatch)) { align1 = s1[i - 1] + align1; align2 = s2[j - 1] + align2; alignSym = (s1[i - 1] === s2[j - 1] ? "|" : " ") + alignSym; i--; j--; } 
        else if (current === left + gap) { align1 = "-" + align1; align2 = s2[j - 1] + align2; alignSym = " " + alignSym; j--; } 
        else { align1 = s1[i - 1] + align1; align2 = "-" + align2; alignSym = " " + alignSym; i--; }
    }

    let matchesCount = 0, mismatchesCount = 0, gapsCount = 0;
    const totalLen = align1.length;
    for (let k = 0; k < totalLen; k++) {
        if (align1[k] === align2[k] && align1[k] !== '-') matchesCount++;
        else if (align1[k] === '-' || align2[k] === '-') gapsCount++;
        else mismatchesCount++;
    }
    
    let identPct = totalLen > 0 ? ((matchesCount / totalLen) * 100).toFixed(2) : "0.00";
    let gapPct = totalLen > 0 ? ((gapsCount / totalLen) * 100).toFixed(2) : "0.00";

    let formattedOut = "";
    for(let k=0; k < totalLen; k+=60) {
        formattedOut += `Q: ${colorizeSeq(align1.substring(k, k+60))}\n`;
        formattedOut += `   ${alignSym.substring(k, k+60)}\n`;
        formattedOut += `S: ${colorizeSeq(align2.substring(k, k+60))}\n\n`;
    }

    document.getElementById('alignScore').textContent = `Max Score: ${maxScore}`;
    document.getElementById('alignOutputBox').innerHTML = formattedOut || "Tidak ada homologi lokal terdeteksi.";
    document.getElementById('siasStats').innerHTML = `<div class="badge badge-success" style="font-size:13px; padding:6px 12px;">Identity: ${identPct}%</div><div class="badge badge-neutral" style="font-size:12px;">Matches: ${matchesCount}</div><div class="badge badge-warning" style="font-size:12px;">Mismatches: ${mismatchesCount}</div><div class="badge badge-danger" style="font-size:12px;">Gaps: ${gapsCount} (${gapPct}%)</div>`;
    document.getElementById('pairwiseResult').style.display = 'block';
}

// ===================================================================
// MODULE 3: MULTIPLE SEQUENCE ALIGNMENT (MSA)
// ===================================================================
function nwAlignSimple(s1, s2) {
    let m = s1.length, n = s2.length;
    let dp = Array(m+1).fill(0).map(()=>Array(n+1).fill(0));
    for(let i=1; i<=m; i++) dp[i][0] = -2*i;
    for(let j=1; j<=n; j++) dp[0][j] = -2*j;
    for(let i=1; i<=m; i++) {
        for(let j=1; j<=n; j++) {
            dp[i][j] = Math.max(dp[i-1][j-1] + (s1[i-1] === s2[j-1] ? 3 : -3), dp[i-1][j] - 2, dp[i][j-1] - 2);
        }
    }
    let a1 = "", a2 = "", i = m, j = n;
    while(i>0 || j>0) {
        if(i>0 && j>0 && dp[i][j] === dp[i-1][j-1] + (s1[i-1]===s2[j-1]?3:-3)) { a1 = s1[i-1]+a1; a2 = s2[j-1]+a2; i--; j--; }
        else if(i>0 && dp[i][j] === dp[i-1][j] - 2) { a1 = s1[i-1]+a1; a2 = "-"+a2; i--; }
        else { a1 = "-"+a1; a2 = s2[j-1]+a2; j--; }
    }
    return [a1, a2];
}

function runMSA() {
    let raw = document.getElementById('msaInput').value.trim();
    if(!raw) return alert("Masukkan sekuens Multi-FASTA!");
    
    let lines = raw.split('\n'), seqs = [], names = [], currSeq = "";
    for(let line of lines) {
        line = line.trim();
        if(line.startsWith('>')) {
            if(currSeq) seqs.push(currSeq);
            names.push(line.substring(1).split(/[\|\s]/)[0].trim().padEnd(12, ' ').substring(0,12)); 
            currSeq = "";
        } else { currSeq += line.toUpperCase().replace(/[^ATCG-]/g, ''); }
    }
    if(currSeq) seqs.push(currSeq);
    
    let N = seqs.length;
    if(N < 2) return alert("Butuh minimal 2 sekuens untuk melakukan MSA.");
    if(N > 20) return alert("Sistem membatasi maksimal 20 sekuens untuk menjaga stabilitas browser.");

    // Center-Star Heuristic MSA
    let dists = Array(N).fill(0);
    for(let i=0; i<N; i++) {
        for(let j=i+1; j<N; j++) {
            let [a1, a2] = nwAlignSimple(seqs[i], seqs[j]);
            let diff = 0; for(let k=0; k<a1.length; k++) if(a1[k] !== a2[k]) diff++;
            dists[i] += diff; dists[j] += diff;
        }
    }
    let centerIdx = 0, minDist = dists[0];
    for(let i=1; i<N; i++) if(dists[i] < minDist) { minDist = dists[i]; centerIdx = i; }

    let msa = [seqs[centerIdx]];
    let msaNames = [names[centerIdx]];

    for(let i=0; i<N; i++) {
        if(i === centerIdx) continue;
        let [aCenter, aSeq] = nwAlignSimple(msa[0].replace(/-/g,''), seqs[i].replace(/-/g,''));
        
        let newMsa = msa.map(() => "");
        let newSeq = "";
        let ptMsa = 0, ptCenter = 0;
        
        while(ptMsa < msa[0].length || ptCenter < aCenter.length) {
            let charMsa = ptMsa < msa[0].length ? msa[0][ptMsa] : '';
            let charCenter = ptCenter < aCenter.length ? aCenter[ptCenter] : '';

            if(charMsa === '-' && charCenter === '-') {
                for(let k=0; k<msa.length; k++) newMsa[k] += msa[k][ptMsa];
                newSeq += aSeq[ptCenter]; ptMsa++; ptCenter++;
            } else if(charMsa === '-') {
                for(let k=0; k<msa.length; k++) newMsa[k] += msa[k][ptMsa];
                newSeq += '-'; ptMsa++;
            } else if(charCenter === '-') {
                for(let k=0; k<msa.length; k++) newMsa[k] += '-';
                newSeq += aSeq[ptCenter]; ptCenter++;
            } else {
                for(let k=0; k<msa.length; k++) newMsa[k] += msa[k][ptMsa];
                newSeq += aSeq[ptCenter]; ptMsa++; ptCenter++;
            }
        }
        msa = newMsa; msa.push(newSeq); msaNames.push(names[i]);
    }

    let conservation = "";
    let len = msa[0].length;
    for(let i=0; i<len; i++) {
        let firstChar = msa[0][i];
        let isConserved = firstChar !== '-' && msa.every(s => s[i] === firstChar);
        conservation += isConserved ? '*' : ' ';
    }

    let outStr = "";
    for(let i=0; i<len; i+=60) {
        for(let s=0; s<msa.length; s++) { 
            outStr += `${msaNames[s]}  ${colorizeSeq(msa[s].substring(i, i+60))}\n`; 
        }
        outStr += `Conservation  ${conservation.substring(i, i+60)}\n\n`;
    }

    document.getElementById('msaOutputBox').innerHTML = outStr;
    document.getElementById('msaResultContainer').style.display = 'block';
    toast("Alignment berhasil dieksekusi.");
}

// ===================================================================
// NEW MODULE: PROTEIN ANALYSIS (ProtParam Eq)
// ===================================================================
const aaMass = { A:71.0788, R:156.1875, N:114.1038, D:115.0886, C:103.1388, E:129.1155, Q:128.1307, G:57.0519, H:137.1411, I:113.1594, L:113.1594, K:128.1741, M:131.1926, F:147.1766, P:97.1167, S:87.0782, T:101.1051, W:186.2132, Y:163.1760, V:99.1326 };
const pKa = { N_term:9.69, C_term:2.34, D:3.86, E:4.25, H:6.0, C:8.33, Y:10.07, K:10.53, R:12.48 };
let protChartInstance = null;

function calculateCharge(pH, aaCounts) {
    let charge = 0;
    // Positively charged
    charge += Math.pow(10, pKa.N_term) / (Math.pow(10, pH) + Math.pow(10, pKa.N_term));
    charge += (aaCounts['K']||0) * Math.pow(10, pKa.K) / (Math.pow(10, pH) + Math.pow(10, pKa.K));
    charge += (aaCounts['R']||0) * Math.pow(10, pKa.R) / (Math.pow(10, pH) + Math.pow(10, pKa.R));
    charge += (aaCounts['H']||0) * Math.pow(10, pKa.H) / (Math.pow(10, pH) + Math.pow(10, pKa.H));
    // Negatively charged
    charge -= Math.pow(10, pH) / (Math.pow(10, pKa.C_term) + Math.pow(10, pH));
    charge -= (aaCounts['D']||0) * Math.pow(10, pH) / (Math.pow(10, pKa.D) + Math.pow(10, pH));
    charge -= (aaCounts['E']||0) * Math.pow(10, pH) / (Math.pow(10, pKa.E) + Math.pow(10, pH));
    charge -= (aaCounts['C']||0) * Math.pow(10, pH) / (Math.pow(10, pKa.C) + Math.pow(10, pH));
    charge -= (aaCounts['Y']||0) * Math.pow(10, pH) / (Math.pow(10, pKa.Y) + Math.pow(10, pH));
    return charge;
}

function runProteinAnalysis() {
    let seq = document.getElementById('proteinInput').value.toUpperCase().replace(/[^ARNDCEQGHILKMFPSTWYV]/g, '');
    if(!seq) return alert("Masukkan sekuens protein yang valid (hanya karakter 20 asam amino standar).");
    
    let mw = 18.01524; // Massa air (H2O)
    let aaCounts = {};
    for(let char of seq) {
        mw += aaMass[char] || 0;
        aaCounts[char] = (aaCounts[char] || 0) + 1;
    }
    
    // Titik Isoelektrik (pI) menggunakan metode Bisection
    let min_pH = 0.0, max_pH = 14.0, pI = 7.0;
    for(let i=0; i<100; i++) {
        pI = (min_pH + max_pH) / 2;
        let charge = calculateCharge(pI, aaCounts);
        if(charge > 0) min_pH = pI; else max_pH = pI;
    }

    document.getElementById('resProtMW').textContent = (mw / 1000).toFixed(2) + " kDa";
    document.getElementById('resProtPI').textContent = pI.toFixed(2);
    document.getElementById('resProtLen').textContent = seq.length;
    
    // Render Chart Bar Frekuensi
    let labels = Object.keys(aaMass).sort();
    let dataFreq = labels.map(aa => ((aaCounts[aa]||0) / seq.length) * 100);
    
    const ctx = document.getElementById('protChart').getContext('2d');
    if(protChartInstance) protChartInstance.destroy();
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridC = isDark ? '#334155' : '#E2E8F0';
    const txtC = isDark ? '#94A3B8' : '#475569';
    
    protChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Komposisi (%)', data: dataFreq, backgroundColor: '#10B981', borderRadius: 4 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: txtC } },
                y: { grid: { color: gridC }, ticks: { color: txtC } }
            }
        }
    });

    document.getElementById('protResultArea').style.display = 'block';
    toast("Analisis protein berhasil.");
}

// ===================================================================
// MODULE 5: ORF FINDER & DIGEST MAPPER
// ===================================================================
function revCompForORF(seq) {
    const m = {'A':'T','T':'A','C':'G','G':'C'};
    return seq.split('').reverse().map(b=>m[b]||b).join('');
}
function proceedORFFinder(bypassConfirm = true) {
    runORFFinder(bypassConfirm);
}
function runORFFinder(bypassConfirm = false) {
    const rawVal = document.getElementById('orfInput').value;
    if (!rawVal.trim()) return alert("Masukkan sekuens DNA mentah terlebih dahulu.");

    const lines = rawVal.split(/\r?\n/).filter(line => !line.trim().startsWith('>'));
    const seqOnly = lines.join('').replace(/\s+/g, '');
    if (!seqOnly) return alert("Sekuens DNA tidak ditemukan dalam input.");

    const nonNucleotides = seqOnly.toUpperCase().match(/[^ATCGN]/g) || [];

    if (!bypassConfirm && nonNucleotides.length > 0) {
        const uniqueChars = Array.from(new Set(nonNucleotides.map(c => c.toUpperCase())));
        const count = nonNucleotides.length;

        const dlgEl = document.getElementById('dlgOrfConfirm');
        const countEl = document.getElementById('orfNonNucCount');
        const charsEl = document.getElementById('orfNonNucChars');

        if (dlgEl && countEl && charsEl) {
            countEl.textContent = `${count}`;
            charsEl.textContent = uniqueChars.join(', ');
            openDialog('dlgOrfConfirm');
            return;
        } else {
            const isConfirmed = confirm(`Sekuens yang Anda masukkan mengandung ${count} karakter non-nukleotida selain ATCGN (karakter: ${uniqueChars.join(', ')}).\n\nApakah Anda yakin ingin melanjutkan analisis ORF? (Karakter non-ATCGN akan diabaikan)`);
            if (!isConfirmed) return;
        }
    }

    if (document.getElementById('dlgOrfConfirm')) {
        closeDialog('dlgOrfConfirm');
    }

    const seq = seqOnly.toUpperCase().replace(/[^ATCGN]/g, '');
    if(seq.length < 90) return alert("Sekuens DNA terlalu pendek (Min. 90 bp untuk kandidat protein fungsional).");
    const revSeq = revCompForORF(seq); const stops = ['TAA', 'TAG', 'TGA']; let orfs = [];

    function scanFrame(dna, frameOffset, isRev) {
        for (let i = frameOffset; i < dna.length - 2; i += 3) {
            if (dna.substr(i, 3) === 'ATG') {
                for (let j = i + 3; j < dna.length - 2; j += 3) {
                    if (stops.includes(dna.substr(j, 3))) {
                        let orfSeq = dna.substring(i, j + 3);
                        if(orfSeq.length >= 90) { 
                            let aStart = isRev ? dna.length - (j + 3) + 1 : i + 1; let aEnd = isRev ? dna.length - i : j + 3;
                            orfs.push({ frame: (isRev ? "-" : "+") + (frameOffset + 1), start: aStart, end: aEnd, len: orfSeq.length, seq: orfSeq });
                        }
                        i = j; break;
                    }
                }
            }
        }
    }
    scanFrame(seq, 0, false); scanFrame(seq, 1, false); scanFrame(seq, 2, false);
    scanFrame(revSeq, 0, true); scanFrame(revSeq, 1, true); scanFrame(revSeq, 2, true);
    
    orfs.sort((a,b) => b.len - a.len); 
    const tb = document.getElementById('orfBody'); tb.innerHTML = '';
    
    if(orfs.length === 0) { tb.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--warning); padding:20px;">Tidak ada frame terbuka utuh (>30 aa) yang terdeteksi.</td></tr>'; } 
    else {
        orfs.forEach(orf => {
            let tr = document.createElement('tr'); let color = orf.frame.includes('+') ? 'var(--primary)' : 'var(--purple)';
            tr.innerHTML = `<td style="font-weight:bold; color:${color};">${orf.frame}</td><td style="font-family:var(--font-mono);">${orf.start}</td><td style="font-family:var(--font-mono);">${orf.end}</td><td>${orf.len} bp / ${orf.len/3} aa</td><td><button class="btn btn-outline btn-sm" onclick="showOrfTranslation('${orf.seq}')">Translasi</button></td>`;
            tb.appendChild(tr);
        });
    }
    document.getElementById('orfResult').style.display = 'block';
}
function showOrfTranslation(dna) {
    let d = dna.replace(/U/g, 'T'); let o = ""; for (let i=0; i<d.length-2; i+=3) o += codonTable[d.substring(i, i+3)] || '?';
    document.getElementById('orfTranslationBox').value = `>Kandidat_Protein_ORF_${dna.length/3}_aa\n${o.replace(/\*/g, '')}`;
    document.getElementById('orfModal').style.display = 'flex';
}

const ENZYMES = { "EcoRI":"GAATTC", "BamHI":"GGATCC", "HindIII":"AAGCTT", "XhoI":"CTCGAG", "NotI":"GCGGCCGC", "NdeI":"CATATG", "PstI":"CTGCAG", "SalI":"GTCGAC", "KpnI":"GGTACC", "SmaI":"CCCGGG", "SacI":"GAGCTC", "SpeI":"ACTAGT", "SphI":"GCATGC", "XbaI":"TCTAGA", "BglII":"AGATCT", "ClaI":"ATCGAT", "NcoI":"CCATGG", "NheI":"GCTAGC", "TaqI":"TCGA", "AluI":"AGCT", "HaeIII":"GGCC", "DraI":"TTTAAA" };
function runDigest() {
    const seq = cleanDNA(document.getElementById('digestInput').value);
    if(seq.length < 20) return alert("Masukkan sekuens target minimal 20 bp.");
    let cuts = [];
    for (let enz in ENZYMES) {
        let site = ENZYMES[enz]; let pos = seq.indexOf(site);
        while (pos !== -1) { cuts.push({ enz: enz, site: site, pos: pos + 1 }); pos = seq.indexOf(site, pos + 1); }
    }
    cuts.sort((a, b) => a.pos - b.pos);
    let fragments = []; let lastPos = 0;
    for (let i = 0; i < cuts.length; i++) { fragments.push(cuts[i].pos - lastPos); lastPos = cuts[i].pos; }
    fragments.push(seq.length - lastPos); fragments.sort((a,b) => b - a);
    const cb = document.getElementById('cutBody'); cb.innerHTML = ''; const fl = document.getElementById('fragList'); fl.innerHTML = '';
    if(cuts.length === 0) {
        cb.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:var(--text3);">Tidak ada situs pengenalan NEB ditemukan.</td></tr>';
        fl.innerHTML = `<li>1 Pita Tunggal (Uncut): ${seq.length} bp</li>`;
    } else {
        cuts.forEach(c => { cb.innerHTML += `<tr><td style="font-weight:bold; color:var(--primary);">${c.enz}</td><td style="font-family:var(--font-mono);">${c.site}</td><td style="font-family:var(--font-mono);">${c.pos}</td></tr>`; });
        fragments.forEach((sz, idx) => { if(sz > 0) fl.innerHTML += `<li>Fragmen ${idx+1}: <span style="color:var(--text);">${sz} bp</span></li>`; });
    }
    document.getElementById('digestResult').style.display = 'grid';
}

// ===================================================================
// MODULE 8: POHON FILOGENETIK WITH BOOTSTRAP (TRUE MSA-BASED UPGMA)
// ===================================================================
let currentPhyloTree = null; let currentPhyloN = 0;
function msaDistance(s1, s2) {
    let diff = 0, valid = 0;
    for(let i=0; i<s1.length; i++) {
        if(s1[i] !== '-' && s2[i] !== '-') {
            valid++;
            if(s1[i] !== s2[i]) diff++;
        }
    }
    return valid === 0 ? 1 : diff / valid;
}
function buildUPGMA(dMat, names) {
    let clusters = names.map((name, i) => ({ label: name, size: 1, depth: 0, index: i, isLeaf: true }));
    let dist = dMat.map(row => [...row]);
    let cCount = dist.length;
    let tree = clusters.length === 1 ? clusters[0] : null;
    while(cCount > 1) {
        let minD = Infinity, c1=-1, c2=-1;
        for(let i=0; i<dist.length; i++) {
            if(!clusters[i]) continue;
            for(let j=i+1; j<dist.length; j++) {
                if(!clusters[j]) continue;
                if(dist[i][j] < minD) { minD=dist[i][j]; c1=i; c2=j; }
            }
        }
        let merged = { left:clusters[c1], right:clusters[c2], dist:minD, size: clusters[c1].size+clusters[c2].size, depth: Math.max(clusters[c1].depth, clusters[c2].depth)+1, isLeaf:false };
        tree = merged;
        for(let i=0; i<dist.length; i++) {
            if(i!==c1 && i!==c2 && clusters[i]) { dist[c1][i] = dist[i][c1] = (dist[c1][i]*clusters[c1].size + dist[c2][i]*clusters[c2].size) / merged.size; }
        }
        clusters[c1] = merged; clusters[c2] = null; cCount--;
    }
    return tree;
}
function getClades(node, cladeSet) {
    if(!node) return []; if(node.isLeaf) return [node.index];
    let leftLeaves = getClades(node.left, cladeSet), rightLeaves = getClades(node.right, cladeSet);
    let allLeaves = leftLeaves.concat(rightLeaves).sort((a,b)=>a-b);
    cladeSet.add(allLeaves.join(',')); return allLeaves;
}
function buildPhylo() {
    let raw = document.getElementById('fastaInput').value.trim();
    let bootstrapIter = parseInt(document.getElementById('bootstrapVal').value) || 0;
    if(!raw) return alert("Masukkan sekuens Multi-FASTA terlebih dahulu!");
    
    let lines = raw.split('\n'), seqs = [], names = [], currSeq = "";
    for(let line of lines) {
        line = line.trim();
        if(line.startsWith('>')) {
            if(currSeq) seqs.push(currSeq);
            names.push(line.substring(1).split(/[\|\s]/)[0].trim().substring(0,15)); 
            currSeq = "";
        } else { currSeq += line.toUpperCase().replace(/[^ATCG-]/g, ''); }
    }
    if(currSeq) seqs.push(currSeq);
    
    let n = names.length;
    if(n < 2) return alert("Dibutuhkan minimal 2 sekuens untuk klastering.");
    if(n > 20) return alert("Demi stabilitas browser, batasi maksimal 20 sekuens.");

    toast("Memproses Alignment & Jarak...");

    let dists_init = Array(n).fill(0);
    for(let i=0; i<n; i++) {
        for(let j=i+1; j<n; j++) {
            let [a1, a2] = nwAlignSimple(seqs[i], seqs[j]);
            let diff = 0; for(let k=0; k<a1.length; k++) if(a1[k] !== a2[k]) diff++;
            dists_init[i] += diff; dists_init[j] += diff;
        }
    }
    let centerIdx = 0, minDist = dists_init[0];
    for(let i=1; i<n; i++) if(dists_init[i] < minDist) { minDist = dists_init[i]; centerIdx = i; }

    let msa = [seqs[centerIdx]]; let msaIndices = [centerIdx];
    for(let i=0; i<n; i++) {
        if(i === centerIdx) continue;
        let [aCenter, aSeq] = nwAlignSimple(msa[0].replace(/-/g,''), seqs[i].replace(/-/g,''));
        let newMsa = msa.map(() => ""), newSeq = "", ptMsa = 0, ptCenter = 0;
        while(ptMsa < msa[0].length || ptCenter < aCenter.length) {
            let charMsa = ptMsa < msa[0].length ? msa[0][ptMsa] : '';
            let charCenter = ptCenter < aCenter.length ? aCenter[ptCenter] : '';
            if(charMsa === '-' && charCenter === '-') { for(let k=0; k<msa.length; k++) newMsa[k] += msa[k][ptMsa]; newSeq += aSeq[ptCenter]; ptMsa++; ptCenter++; } 
            else if(charMsa === '-') { for(let k=0; k<msa.length; k++) newMsa[k] += msa[k][ptMsa]; newSeq += '-'; ptMsa++; } 
            else if(charCenter === '-') { for(let k=0; k<msa.length; k++) newMsa[k] += '-'; newSeq += aSeq[ptCenter]; ptCenter++; } 
            else { for(let k=0; k<msa.length; k++) newMsa[k] += msa[k][ptMsa]; newSeq += aSeq[ptCenter]; ptMsa++; ptCenter++; }
        }
        msa = newMsa; msa.push(newSeq); msaIndices.push(i);
    }
    let finalMsa = Array(n).fill(""); for(let i=0; i<n; i++) finalMsa[msaIndices[i]] = msa[i];

    let distMat = Array(n).fill(0).map(()=>Array(n).fill(0));
    for(let i=0; i<n; i++) for(let j=i+1; j<n; j++) distMat[i][j] = distMat[j][i] = msaDistance(finalMsa[i], finalMsa[j]);

    let mTable = `<thead><tr><th style="background:var(--surface-hover);"></th>`;
    names.forEach(name => mTable += `<th style="background:var(--surface-hover);">${name.substring(0,8)}</th>`);
    mTable += "</tr></thead><tbody>";
    for(let i=0; i<n; i++) {
        mTable += `<tr><td style="font-weight:bold; background:var(--surface-hover);">${names[i].substring(0,8)}</td>`;
        for(let j=0; j<n; j++) mTable += `<td>${distMat[i][j].toFixed(3)}</td>`;
        mTable += "</tr>";
    }
    document.getElementById('matrixTable').innerHTML = mTable + "</tbody>";

    let originalTree = buildUPGMA(distMat, names);

    if(bootstrapIter > 0 && n > 2) {
        toast(`Menjalankan ${bootstrapIter} iterasi Bootstrap...`);
        let msaLen = finalMsa[0].length; let cladeFreq = {};
        for(let b=0; b<bootstrapIter; b++) {
            let bMsa = Array(n).fill("");
            for(let c=0; c<msaLen; c++) { let rCol = Math.floor(Math.random() * msaLen); for(let i=0; i<n; i++) bMsa[i] += finalMsa[i][rCol]; }
            let bDist = Array(n).fill(0).map(()=>Array(n).fill(0));
            for(let i=0; i<n; i++) for(let j=i+1; j<n; j++) bDist[i][j] = bDist[j][i] = msaDistance(bMsa[i], bMsa[j]);
            let bTree = buildUPGMA(bDist, names); let clades = new Set(); getClades(bTree, clades);
            clades.forEach(c => { cladeFreq[c] = (cladeFreq[c]||0) + 1; });
        }
        function assignBootstrap(node) {
            if(node.isLeaf) { node.leaves = [node.index]; return; }
            assignBootstrap(node.left); assignBootstrap(node.right);
            node.leaves = node.left.leaves.concat(node.right.leaves).sort((a,b)=>a-b);
            let cKey = node.leaves.join(','); node.bootstrap = Math.round((cladeFreq[cKey] || 0) / bootstrapIter * 100);
        }
        assignBootstrap(originalTree);
    }

    currentPhyloTree = originalTree; currentPhyloN = n;
    redrawTreeOnly();

    function buildNewick(node) {
        if(node.isLeaf) return node.label;
        let leftN = buildNewick(node.left); let rightN = buildNewick(node.right);
        let bStr = node.bootstrap !== undefined && node.size < n ? node.bootstrap : "";
        return `(${leftN},${rightN})${bStr}`;
    }
    document.getElementById('newickOutput').value = buildNewick(originalTree) + ";";
    document.getElementById('phyloResultArea').style.display = 'block';
    
    currentSvgZoom = 1;
    const svgEl = document.querySelector('#phyloSvgContainer svg');
    if(svgEl) { svgEl.style.width = '100%'; svgEl.style.height = '100%'; }
}

function redrawTreeOnly() {
    if(!currentPhyloTree) return;
    const n = currentPhyloN;
    let lineColor = document.getElementById('phyloLineColor').value || 'var(--primary)';
    let txtColor = document.getElementById('phyloTextColor').value || 'var(--text)';
    let fontFam = document.getElementById('phyloFont').value || 'var(--font-mono)';
    let fontSty = document.getElementById('phyloFontStyle').value || 'normal';

    const svgW = 600, svgH = Math.max(300, n*40), pad = 50;
    let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="${currentSvgZoom*100}%" height="${currentSvgZoom*100}%" style="transition:all 0.3s ease;">`;
    let leafY = pad, maxDist = currentPhyloTree.dist || 1;
    
    function drawNode(node) {
        if(node.isLeaf) {
            let y = leafY; leafY += (svgH - 2*pad) / n;
            svg += `<text x="${svgW - pad + 10}" y="${y+4}" fill="${txtColor}" font-family="${fontFam}" font-size="13px" font-style="${fontSty}" font-weight="bold">${node.label}</text>`;
            return {x: svgW - pad, y: y};
        }
        let posL = drawNode(node.left), posR = drawNode(node.right);
        let x = svgW - pad - (node.dist / maxDist) * (svgW - 2*pad);
        let y = (posL.y + posR.y) / 2;
        
        svg += `<path d="M ${posL.x} ${posL.y} L ${x} ${posL.y} L ${x} ${posR.y} L ${posR.x} ${posR.y}" fill="none" stroke="${lineColor}" stroke-width="2" />`;
        svg += `<path d="M ${x} ${y} L ${x+15} ${y}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-dasharray="3,3" opacity="0.4"/>`;
        
        if(node.bootstrap !== undefined && node.size < n) {
            svg += `<text x="${x-22}" y="${y-5}" fill="var(--warning)" font-family="var(--font-mono)" font-size="11px" font-weight="bold">${node.bootstrap}</text>`;
        }
        return {x: x, y: y};
    }
    drawNode(currentPhyloTree);
    document.getElementById('phyloSvgContainer').innerHTML = svg + `</svg>`;
}

let currentSvgZoom = 1;
function zoomSvgPhylo(delta) {
    const svg = document.querySelector('#phyloSvgContainer svg');
    if(!svg) return;
    if(delta === 0) currentSvgZoom = 1; else currentSvgZoom += delta;
    currentSvgZoom = Math.max(0.5, Math.min(currentSvgZoom, 3)); 
    svg.style.width = `${currentSvgZoom * 100}%`; svg.style.height = `${currentSvgZoom * 100}%`;
}
function toggleFullscreenSvg() { document.getElementById('phyloSvgContainer').classList.toggle('fullscreen-mode'); }

// ===================================================================
// MODULE 9: PRIMER DESIGN 
// ===================================================================
function calcTm(seq) {
    if (!seq) return 0; const s = cleanDNA(seq); const gc = (s.match(/[GC]/g) || []).length, at = s.length - gc;
    return s.length < 14 ? (at * 2) + (gc * 4) : 64.9 + 41 * (gc - 16.4) / s.length;
}
function calcGCPrimer(seq) { if(!seq) return 0; const s = cleanDNA(seq); return ((s.match(/[GC]/g) || []).length / s.length * 100); }

function calcPrimer() {
    ['F', 'R'].forEach(dir => {
        const id = dir === 'F' ? 'pFwd' : 'pRev';
        const seq = cleanDNA(document.getElementById(id).value);
        document.getElementById(`res${dir}Len`).textContent = seq.length > 0 ? seq.length : '—';
        document.getElementById(`res${dir}Gc`).textContent = seq.length > 0 ? calcGCPrimer(seq).toFixed(1) : '—';
        document.getElementById(`res${dir}Tm`).textContent = seq.length > 0 ? calcTm(seq).toFixed(1) : '—';
    });
    const fTm = calcTm(document.getElementById('pFwd').value);
    const rTm = calcTm(document.getElementById('pRev').value);
    document.getElementById('resTa').textContent = (fTm > 0 && rTm > 0) ? (Math.min(fTm, rTm) - 5).toFixed(1) + ' °C' : '—';
}

function generatePrimers() {
    const targetSeq = cleanDNA(document.getElementById('targetGen').value);
    if (targetSeq.length < 150) return alert("Gen target terlalu pendek (minimal 150 bp).");

    const minAmp = 100, maxAmp = Math.min(targetSeq.length, 800), fwdList = [], revList = [], pLen = 20; 
    for (let i = 0; i < Math.min(targetSeq.length / 2, 800); i++) {
        let p = targetSeq.substr(i, pLen);
        if (p.length === pLen) {
            let tm = calcTm(p), gc = ((p.match(/[GC]/g) || []).length / pLen * 100);
            if (tm >= 55 && tm <= 65 && gc >= 40 && gc <= 60) fwdList.push({ seq: p, pos: i, tm: tm, gc: gc });
        }
    }

    const m = {'A':'T','T':'A','C':'G','G':'C'};
    const rcSeq = targetSeq.split('').reverse().map(b=>m[b]||b).join('');
    
    for (let i = 0; i < Math.min(rcSeq.length / 2, 800); i++) {
        let p = rcSeq.substr(i, pLen);
        if (p.length === pLen) {
            let tm = calcTm(p), gc = ((p.match(/[GC]/g) || []).length / pLen * 100);
            if (tm >= 55 && tm <= 65 && gc >= 40 && gc <= 60) revList.push({ seq: p, pos: targetSeq.length - i - pLen, tm: tm, gc: gc });
        }
    }

    let pairs = [];
    for (let f of fwdList) {
        for (let r of revList) {
            let ampSize = (r.pos + pLen) - f.pos;
            if (ampSize >= minAmp && ampSize <= maxAmp) pairs.push({ f: f, r: r, size: ampSize, tmDiff: Math.abs(f.tm - r.tm) });
        }
    }

    pairs.sort((a, b) => a.tmDiff - b.tmDiff);
    const topPairs = pairs.slice(0, 5);
    const tbody = document.getElementById('autoPrimerBody');
    tbody.innerHTML = '';

    if (topPairs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color:var(--danger);">Kandidat primer tidak ditemukan pada sekuens ini.</td></tr>';
    } else {
        topPairs.forEach((pair, index) => {
            const trFwd = document.createElement('tr');
            trFwd.innerHTML = `
                <td rowspan="2" style="font-weight:700; color:var(--text3); border-bottom:2px solid var(--border);">${index + 1}</td>
                <td style="font-family:var(--font-mono); color:var(--primary);"><span class="badge">Fwd</span> ${pair.f.seq}</td>
                <td>${pLen}</td><td style="font-family:var(--font-mono);">${pair.f.tm.toFixed(1)}</td><td style="font-family:var(--font-mono);">${pair.f.gc.toFixed(1)}</td>
                <td rowspan="2" style="font-weight:700; color:var(--success); border-bottom:2px solid var(--border);">${pair.size}</td>
            `;
            const trRev = document.createElement('tr');
            trRev.innerHTML = `
                <td style="font-family:var(--font-mono); color:var(--purple); border-bottom:2px solid var(--border);"><span class="badge">Rev</span> ${pair.r.seq}</td>
                <td style="border-bottom:2px solid var(--border);">${pLen}</td><td style="font-family:var(--font-mono); border-bottom:2px solid var(--border);">${pair.r.tm.toFixed(1)}</td><td style="font-family:var(--font-mono); border-bottom:2px solid var(--border);">${pair.r.gc.toFixed(1)}</td>
            `;
            tbody.appendChild(trFwd); tbody.appendChild(trRev);
        });
    }
    document.getElementById('autoPrimerResultContainer').style.display = 'block';
}

switchView('v-blast', document.querySelector('.menu-item.active'));