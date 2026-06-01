/**
 * AREs Vanilla JS Test Suite
 * Berfungsi untuk memvalidasi akurasi perhitungan matematis secara offline.
 * Terhubung dengan arsitektur modular JS AREs versi 1.0.0
 */

let totalTests = 0;
let passedTests = 0;

// Fungsi Asersi Utama
function assert(condition, testName, moduleName) {
    totalTests++;
    const container = document.getElementById(`${moduleName}-results`);
    const p = document.createElement("p");
    
    if (condition) {
        passedTests++;
        p.className = "pass";
        p.innerText = `✅ PASS: ${testName}`;
    } else {
        p.className = "fail";
        p.innerText = `❌ FAIL: ${testName}`;
        console.error(`Test failed: ${testName} in ${moduleName}`);
    }
    container.appendChild(p);
}

// Fungsi untuk membuat wadah modul di HTML
function createModuleContainer(moduleName, title) {
    const mainResults = document.getElementById("test-results");
    const div = document.createElement("div");
    div.className = "test-module";
    div.innerHTML = `<h2>${title}</h2><div id="${moduleName}-results"></div>`;
    mainResults.appendChild(div);
}

// ========================================================
// 1. PENGUJIAN AQUALAB (Water Quality / Ammonia)
// ========================================================
createModuleContainer("aqualab", "🔬 AquaLab Workspace");

try {
    // Menguji fungsi calcNH3 asli dari aqualab.js
    if (typeof calcNH3 === "function") {
        const tan = 1.0;
        const pH = 8.0;
        const tempC = 30;
        const nh3 = calcNH3(tan, pH, tempC); 
        // Logika: nilai amonia bebas pasti lebih besar dari 0 pada pH 8.0 dan suhu 30C
        assert(!isNaN(nh3) && nh3 > 0, "Kalkulasi Free Ammonia (calcNH3) berjalan dengan baik", "aqualab");
    } else {
        assert(false, "Fungsi calcNH3 tidak terdeteksi. Pastikan file aqualab.js terhubung.", "aqualab");
    }
} catch (e) {
    assert(false, `AquaLab test crashed: ${e.message}`, "aqualab");
}

// ========================================================
// 2. PENGUJIAN STATWISE (Inferential Statistics)
// ========================================================
createModuleContainer("statwise", "📊 StatWise");

try {
    const dataTest = [4, 8, 15, 16, 23, 42];
    
    // Menguji fungsi matematika inti dari statwise.js
    if (typeof mean === "function" && typeof median === "function") {
        const meanResult = mean(dataTest);
        assert(meanResult === 18, "Kalkulasi sample mean akurat (expected 18)", "statwise");
        
        const medianResult = median(dataTest);
        assert(medianResult === 15.5, "Kalkulasi median akurat (expected 15.5)", "statwise");
    } else {
        assert(false, "Fungsi mean() atau median() tidak terdeteksi.", "statwise");
    }
} catch (e) {
    assert(false, `StatWise test crashed: ${e.message}`, "statwise");
}

// ========================================================
// 3. PENGUJIAN BIOTOOLS (Molecular Bioinformatics)
// ========================================================
createModuleContainer("biotools", "⚗️ BioTools Suite");

try {
    const dnaSeq = "ATGCGTACGTTAGC"; 
    
    // Menguji fungsi calcGC dan revComp dari biotools.js
    if (typeof calcGC === "function" && typeof revComp === "function") {
        const gcContent = calcGC(dnaSeq);
        assert(gcContent === 50.0, "Kalkulasi persentase GC Content akurat (expected 50%)", "biotools");
        
        const reverseComplement = revComp("ATGC");
        assert(reverseComplement === "GCAT", "Konversi Reverse Complement DNA akurat", "biotools");
    } else {
        assert(false, "Fungsi calcGC() atau revComp() tidak terdeteksi.", "biotools");
    }
} catch (e) {
    assert(false, `BioTools test crashed: ${e.message}`, "biotools");
}

// ========================================================
// 4. PENGUJIAN ECOMETRICS (Multivariate Ecology)
// ========================================================
createModuleContainer("ecometrics", "🌿 EcoMetrics Multivariat");

try {
    const point1 = [0, 0];
    const point2 = [3, 4];
    
    // Menguji kalkulasi Euclidean/Squared distance dari ecometrics.js
    if (typeof distSq === "function") {
        const distanceSquared = distSq(point1, point2);
        // Teorema Pythagoras: 3^2 + 4^2 = 9 + 16 = 25
        assert(distanceSquared === 25, "Kalkulasi Squared Euclidean Distance (distSq) akurat (expected 25)", "ecometrics");
    } else {
        assert(false, "Fungsi distSq() tidak terdeteksi.", "ecometrics");
    }
} catch (e) {
    assert(false, `EcoMetrics test crashed: ${e.message}`, "ecometrics");
}

// ========================================================
// RANGKUMAN PENGUJIAN
// ========================================================
const summaryDiv = document.getElementById("test-summary");
summaryDiv.innerHTML = `<strong>Test Completion:</strong> ${passedTests} of ${totalTests} tests passed.`;
if (passedTests === totalTests && totalTests > 0) {
    summaryDiv.style.color = "#4ade80";
    summaryDiv.style.border = "1px solid #4ade80";
} else {
    summaryDiv.style.color = "#f87171";
    summaryDiv.style.border = "1px solid #f87171";
}