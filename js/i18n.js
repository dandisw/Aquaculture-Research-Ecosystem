/**
 * AREs (Aquaculture Research Ecosystem) - Universal i18n & Layout Helper Engine
 * Manages language preferences (Indonesian 'id' / English 'en'), universal translations,
 * and unified responsive sidebar toggle across all modules.
 */

(function () {
    const I18N_STORAGE_KEY = 'ares_lang';
    const SIDEBAR_STORAGE_KEY = 'ares_sidebar_collapsed';

    const I18N_DICT = {
        id: {
            // Header & Brand & General
            "nav_cite": "Cite Us",
            "nav_back": "Kembali ke AREs",
            "nav_home": "Home AREs",
            "nav_repository": "Repository",
            "nav_language": "🇮🇩 ID",
            "nav_theme": "Tema",
            "nav_theme_dark": "Gelap",
            "nav_theme_light": "Terang",
            "toggle_sidebar": "Bilah Menu",
            "menu_nav": "Menu",
            "hide_sidebar": "Sembunyikan Bilah",
            "show_sidebar": "Tampilkan Bilah",
            "sync_status": "Status Sinkronisasi & Penyimpanan Lokal Data Riset AREs",
            "pwa_online": "Online (Mode Lokal Ready)",
            "pwa_offline": "Offline (Tersimpan di RAM/PWA)",

            // Hero / Landing
            "hero_title": "Aquaculture Research Ecosystem",
            "hero_subtitle": "Ekosistem riset terintegrasi penuh yang dieksekusi secara lokal di peramban Anda dengan jaminan privasi data absolut.",
            "hero_privacy_text": "100% Client-Side Executed · No Data Uploaded",
            "search_placeholder": "Cari modul (Cth: Statistik, Pemetaan, DNA)...",
            "system_status": "SYSTEM ONLINE:",
            "mods_count": "MODS",
            "execute_module": "Execute Module →",
            "access_portal": "Access Portal →",
            "initialize_map": "Initialize Map →",

            // Category Filter & Props
            "filter_all": "Semua Modul",
            "filter_lab": "🔬 Lab & In Vivo",
            "filter_stat": "📊 Statistik & Rapfish",
            "filter_bio": "⚗ Bioinformatika & GIS",
            "filter_cite": "📚 Sitasi & Karir",
            "no_results_title": "Modul tidak ditemukan",
            "no_results_desc": "Tidak ada modul yang cocok dengan kata kunci pencarian Anda.",
            "btn_clear_search": "Reset Pencarian",

            // Value Props
            "feat_compute_title": "Komputasi In-Browser",
            "feat_compute_desc": "Analisis kromatogram, PCA, ANOVA, dan GIS secepat kilat.",
            "feat_privacy_title": "Privasi Absolut",
            "feat_privacy_desc": "100% data diproses di RAM lokal tanpa server perantara.",
            "feat_export_title": "Output Standar Publikasi",
            "feat_export_desc": "Ekspor grafik vektor SVG, BibTeX, RIS, dan tabel riset.",
            "feat_pwa_title": "PWA Offline-Ready",
            "feat_pwa_desc": "Dapat diinstal ke desktop/ponsel dengan sinkronisasi tema.",

            // Citation Tabs
            "tab_apa": "APA 7th Edition",
            "tab_bib": "BibTeX (.bib)",
            "tab_ris": "RIS Format",
            "tab_harvard": "Harvard Format",
            "toast_copied": "Berhasil disalin ke clipboard!",

            // Cards Title & Desc
            "card_aqualab_title": "AquaLab Workspace",
            "card_aqualab_desc": "Buku catatan laboratorium digital komprehensif. Dilengkapi EWS Kualitas Air, kalkulator performa In Vivo, biokinetika mikrobiologi, dan dokumentasi molekuler.",
            "card_statwise_title": "StatWise",
            "card_statwise_desc": "Mesin komputasi statistik murni JavaScript. Mendukung uji Normalitas, ANOVA, Korelasi, hingga visualisasi Scatter Plot tanpa memerlukan server backend.",
            "card_biotools_title": "BioTools Suite",
            "card_biotools_desc": "Perangkat bioinformatika end-to-end. Visualisasi 3D Protein (PDB), baca kromatogram .ab1, ekstraksi ORF, penjajaran sekuens, SSR Finder, Fisikokimia Protein, dan filogenetik.",
            "card_ecometrics_title": "EcoMetrics Multivariat",
            "card_ecometrics_desc": "Pusat eksplorasi data multivariat. Mendukung kalkulasi Rapfish (MDS Keberlanjutan), Principal Component Analysis (PCA), K-Means, ANOSIM, dan LDA.",
            "card_geoplot_title": "GeoPlot",
            "card_geoplot_desc": "Platform pemetaan spasial dan kartografi interaktif. Dilengkapi fitur Geolocation GPS, pengukuran jarak/area, tata letak otomatis, dan ekspor vektor SVG.",
            "card_citeshift_title": "CiteShift",
            "card_citeshift_desc": "Konverter sitasi ilmiah cerdas. Ubah teks daftar pustaka mentah menjadi format BibTeX, RIS, atau APA secara instan dilengkapi auto-complete metadata (Crossref).",
            "card_shifterai_title": "ShifterAI",
            "card_shifterai_desc": "Asisten heuristik format teks. Otomatisasi restrukturisasi paragraf naskah, penghapusan karakter tersembunyi, dan penyesuaian gaya penulisan akademik yang presisi.",
            "card_mendeley_title": "Mendeley FPIK Portal",
            "card_mendeley_desc": "Repositori distribusi digital CSL Style Tugas Akhir FPIK 2018 Resmi Universitas Jenderal Soedirman untuk instalasi Mendeley Cite secara instan.",
            "card_fishcareer_title": "FishCareer Portal",
            "card_fishcareer_desc": "Peta navigasi karir interaktif dari kolam ke laboratorium. Dapatkan wawasan spesialisasi riset, proyeksi industri bioteknologi, dan akses ke komunitas profesional.",

            // Citation
            "cite_title": "Cite This Software",
            "cite_subtitle": "Jika Anda menggunakan ekosistem AREs untuk tugas akhir, tesis, atau publikasi jurnal, mohon sertakan sitasi resmi berikut:",
            "download_bib": "Download .bib",
            "download_ris": "Download .ris",

            // Footer
            "feedback_text": "Punya laporan bug atau saran fitur? Kirimkan umpan balik secara anonim di sini.",
            "footer_copy": "© 2026 Aquaculture Research Ecosystem. Executed purely client-side.",
            "install_pwa": "INSTALL APP",

            // Submodules Common UI
            "btn_reset": "Reset",
            "btn_calculate": "Hitung",
            "btn_export": "Ekspor",
            "btn_download": "Unduh",
            "btn_copy": "Salin",
            "btn_clear": "Bersihkan",
            "btn_help": "Panduan & Referensi",
            "btn_settings": "Pengaturan",
            "btn_analyze": "Analisis",
            "btn_run": "Jalankan",
            "btn_sample": "Isi Data Sampel",
            "btn_fullscreen": "Layar Penuh",
            "btn_export_pdf": "Ekspor PDF",
            "btn_export_png": "Unduh PNG",
            "btn_export_csv": "Ekspor CSV",
            "btn_export_fasta": "Ekspor FASTA",
            "btn_export_svg": "Ekspor SVG",

            // Module Specific Navigation Subtitles
            "mod_aqualab_sub": "Buku Catatan Laboratorium Akuakultur Digital",
            "mod_biotools_sub": "Perangkat Komputasi Bioinformatika & Proteomik",
            "mod_statwise_sub": "Mesin Komputasi Statistik Akuakultur",
            "mod_ecometrics_sub": "Pusat Analisis Multivariat Ekologi",
            "mod_geoplot_sub": "Platform Spasial & Kartografi Akuakultur",
            "mod_citeshift_sub": "Asisten Format Sitasi & Bibliografi",
            "mod_shifterai_sub": "Generator Naskah & Asisten Penulisan Ilmiah AI",
            "mod_mendeley_sub": "Gaya Sitasi Resmi Tugas Akhir FPIK Unsoed",
            "mod_fishcareer_sub": "Navigasi Karir & Bioteknologi Perikanan",

            // BioTools Specific Translations
            "bio_seq_analysis": "Analisis Sekuens",
            "bio_blast": "NCBI Search & BLAST",
            "bio_manipulation": "Manipulasi DNA",
            "bio_pairwise": "Pairwise Alignment",
            "bio_msa": "Multiple Alignment (MSA)",
            "bio_chromato": "Kromatogram (AB1)",
            "bio_proteomics": "Proteomik",
            "bio_physicochem": "Fisikokimia Protein",
            "bio_mol3d": "Visualisasi 3D Protein (PDB)",
            "bio_genomics": "Genomik & Kloning",
            "bio_orf": "ORF Finder",
            "bio_digest": "Restriction Mapper",
            "bio_phylo": "Pohon Filogenetik",
            "bio_popgen": "Genomik Populasi",
            "bio_ssr": "SSR / Mikrosatelit Finder",
            "bio_primer": "Desain Primer",
            "bio_primer_design": "Analisis & Desain Primer",
            "bio_layout_split": "Bagi Kolom",
            "bio_layout_full": "Lebar Penuh (100% Laptop)",
            "bio_height_compact": "400px (Ringkas)",
            "bio_height_std": "540px (Standar)",
            "bio_height_tall": "680px (Tinggi)",
            "bio_height_auto": "Adaptif Layar",
            "bio_spin": "Putar Otomatis",
            "bio_center": "Pusatkan Kamera",
            "bio_reset_cam": "Reset Kamera",
            "bio_axes": "Sumbu Koordinat",
            "bio_bg": "Ganti Background",
            "bio_hd_png": "Tangkapan Layar HD",

            // AquaLab Specific Translations
            "aqua_overview": "Ringkasan Ekosistem",
            "aqua_dashboard": "Visual Dashboard",
            "aqua_performance": "Performa Budidaya",
            "aqua_invivo": "Analisis In Vivo",
            "aqua_health": "Kesehatan Ikan & Udang",
            "aqua_reproduction": "Reproduksi & Pembenihan",
            "aqua_gonad": "Analisis Gonad & Hatchery",
            "aqua_water_quality": "Kualitas Air & Kimia",
            "aqua_water_chem": "Parameter Fisika-Kimia",
            "aqua_nutrition": "Nutrisi & Pakan",
            "aqua_feed_form": "Formulasi Pakan (Pearson)",
            "aqua_microbiology": "Mikrobiologi & Biokinetika",
            "aqua_biokinetics": "Kurva Pertumbuhan Bakteri",
            "aqua_doc": "Dokumentasi & Logbook",
            "aqua_eln": "Electronic Lab Notebook",

            // StatWise Specific Translations
            "stat_data_mgmt": "Manajemen Data",
            "stat_missing": "Manajemen Missing Data",
            "stat_transform": "Transformasi Data",
            "stat_descriptive": "Statistik Deskriptif",
            "stat_assumptions": "Uji Asumsi Dasar",
            "stat_normality": "Uji Normalitas",
            "stat_homogeneity": "Uji Homogenitas",
            "stat_parametric": "Analisis Parametrik",
            "stat_ttest_indep": "Uji-T (Independen)",
            "stat_ttest_paired": "Uji-T (Berpasangan)",
            "stat_anova1": "One-Way ANOVA",
            "stat_anova2": "Two-Way ANOVA",
            "stat_posthoc": "Uji Lanjutan Post-Hoc",
            "stat_correlation": "Korelasi Pearson",
            "stat_regression": "Regresi Linier",
            "stat_nonparametric": "Analisis Non-Parametrik",
            "stat_mannwhitney": "Mann-Whitney U",
            "stat_wilcoxon": "Wilcoxon Signed-Rank",
            "stat_kruskal": "Kruskal-Wallis",
            "stat_spearman": "Korelasi Spearman",
            "stat_charts": "Grafik & Visualisasi",
            "stat_boxplot": "Box Plot & Outlier",
            "stat_scatterplot": "Scatter Plot & Regresi",

            // EcoMetrics Specific Translations
            "eco_sustainability": "Analisis Keberlanjutan",
            "eco_rapfish": "Rapfish (Anchored Proj)",
            "eco_dimension": "Eksplorasi Dimensi & Vektor",
            "eco_pca": "PCA + Biplot",
            "eco_lda": "Discriminant Analysis (LDA)",
            "eco_clustering": "Analisis Pengelompokan",
            "eco_kmeans": "K-Means++ & Elbow",
            "eco_hca": "Hierarchical (Dendrogram)",
            "eco_anosim": "ANOSIM (Permutation)"
        },
        en: {
            // Header & Brand & General
            "nav_cite": "Cite Us",
            "nav_back": "Back to AREs",
            "nav_home": "AREs Home",
            "nav_repository": "Repository",
            "nav_language": "🇬🇧 EN",
            "nav_theme": "Theme",
            "nav_theme_dark": "Dark",
            "nav_theme_light": "Light",
            "toggle_sidebar": "Sidebar Menu",
            "menu_nav": "Menu",
            "hide_sidebar": "Hide Sidebar",
            "show_sidebar": "Show Sidebar",
            "sync_status": "AREs Local Storage & Data Synchronization Status",
            "pwa_online": "Online (Local Storage Ready)",
            "pwa_offline": "Offline (Cached in RAM/PWA)",

            // Hero / Landing
            "hero_title": "Aquaculture Research Ecosystem",
            "hero_subtitle": "A fully integrated research ecosystem executed locally in your browser with absolute data privacy guaranteed.",
            "hero_privacy_text": "100% Client-Side Executed · No Data Uploaded",
            "search_placeholder": "Search modules (e.g., Statistics, Mapping, DNA)...",
            "system_status": "SYSTEM ONLINE:",
            "mods_count": "MODS",
            "execute_module": "Execute Module →",
            "access_portal": "Access Portal →",
            "initialize_map": "Initialize Map →",

            // Category Filter & Props
            "filter_all": "All Modules",
            "filter_lab": "🔬 Lab & In Vivo",
            "filter_stat": "📊 Stats & Rapfish",
            "filter_bio": "⚗ Biotech & GIS",
            "filter_cite": "📚 Citations & Career",
            "no_results_title": "No modules found",
            "no_results_desc": "No tools match your current search query or filter.",
            "btn_clear_search": "Reset Search",

            // Value Props
            "feat_compute_title": "In-Browser Compute",
            "feat_compute_desc": "Analyze chromatograms, PCA, ANOVA, and GIS with zero latency.",
            "feat_privacy_title": "Absolute Privacy",
            "feat_privacy_desc": "100% processed in local browser RAM without cloud relays.",
            "feat_export_title": "Publication Standards",
            "feat_export_desc": "Export SVG vector graphics, BibTeX, RIS, and data tables.",
            "feat_pwa_title": "Offline-Ready PWA",
            "feat_pwa_desc": "Installable on desktop & mobile with real-time theme sync.",

            // Citation Tabs
            "tab_apa": "APA 7th Edition",
            "tab_bib": "BibTeX (.bib)",
            "tab_ris": "RIS Format",
            "tab_harvard": "Harvard Format",
            "toast_copied": "Copied to clipboard successfully!",

            // Cards Title & Desc
            "card_aqualab_title": "AquaLab Workspace",
            "card_aqualab_desc": "Comprehensive digital lab notebook. Equipped with Water Quality EWS, In Vivo performance calculator, microbiology biokinetics, and molecular documentation.",
            "card_statwise_title": "StatWise",
            "card_statwise_desc": "Pure JavaScript statistical computing engine. Supports Normality tests, ANOVA, Correlation, and Scatter Plot visualizations without requiring a backend server.",
            "card_biotools_title": "BioTools Suite",
            "card_biotools_desc": "End-to-end bioinformatics suite. Interactive 3D Protein Visualizer (PDB), .ab1 chromatogram reader, ORF extraction, sequence alignments, SSR Finder, and phylogenetics.",
            "card_ecometrics_title": "EcoMetrics Multivariate",
            "card_ecometrics_desc": "Multivariate data exploration hub. Supports Rapfish (Sustainability MDS), Principal Component Analysis (PCA), K-Means, ANOSIM, and LDA.",
            "card_geoplot_title": "GeoPlot",
            "card_geoplot_desc": "Interactive spatial mapping and cartography platform. Features GPS Geolocation, distance/area measurement, automated layout, and SVG vector export.",
            "card_citeshift_title": "CiteShift",
            "card_citeshift_desc": "Smart scientific citation converter. Instantly transform raw reference lists into BibTeX, RIS, or APA formats with automated Crossref metadata lookup.",
            "card_shifterai_title": "ShifterAI",
            "card_shifterai_desc": "Text formatting heuristic assistant. Automates manuscript paragraph restructuring, hidden character cleaning, and precise academic writing style adjustments.",
            "card_mendeley_title": "Mendeley FPIK Portal",
            "card_mendeley_desc": "Digital CSL style repository for official 2018 FPIK Unsoed undergraduate theses for instant Mendeley Cite integration.",
            "card_fishcareer_title": "FishCareer Portal",
            "card_fishcareer_desc": "Interactive career navigation map from pond to lab. Gain research specialization insights, biotechnology industry projections, and professional community access.",

            // Citation
            "cite_title": "Cite This Software",
            "cite_subtitle": "If you use the AREs ecosystem for your thesis, research project, or journal publication, please cite the following official record:",
            "download_bib": "Download .bib",
            "download_ris": "Download .ris",

            // Footer
            "feedback_text": "Have a bug report or feature suggestion? Submit anonymous feedback here.",
            "footer_copy": "© 2026 Aquaculture Research Ecosystem. Executed purely client-side.",
            "install_pwa": "INSTALL APP",

            // Submodules Common UI
            "btn_reset": "Reset",
            "btn_calculate": "Calculate",
            "btn_export": "Export",
            "btn_download": "Download",
            "btn_copy": "Copy",
            "btn_clear": "Clear",
            "btn_help": "Manual & References",
            "btn_settings": "Settings",
            "btn_analyze": "Analyze",
            "btn_run": "Run",
            "btn_sample": "Load Sample Data",
            "btn_fullscreen": "Fullscreen",
            "btn_export_pdf": "Export PDF",
            "btn_export_png": "Download PNG",
            "btn_export_csv": "Export CSV",
            "btn_export_fasta": "Export FASTA",
            "btn_export_svg": "Export SVG",

            // Module Specific Navigation Subtitles
            "mod_aqualab_sub": "Digital Aquaculture Lab Notebook",
            "mod_biotools_sub": "Bioinformatics & Proteomics Computing Suite",
            "mod_statwise_sub": "Aquaculture Statistical Computing Engine",
            "mod_ecometrics_sub": "Ecological Multivariate Analytics Hub",
            "mod_geoplot_sub": "Aquaculture Spatial Mapping Platform",
            "mod_citeshift_sub": "Citation & Bibliography Formatting Assistant",
            "mod_shifterai_sub": "AI Scientific Writing Assistant & Manuscript Generator",
            "mod_mendeley_sub": "Official FPIK Unsoed Citation Style Portal",
            "mod_fishcareer_sub": "Fisheries & Biotech Career Navigation Map",

            // BioTools Specific Translations
            "bio_seq_analysis": "Sequence Analysis",
            "bio_blast": "NCBI Search & BLAST",
            "bio_manipulation": "DNA Manipulation",
            "bio_pairwise": "Pairwise Alignment",
            "bio_msa": "Multiple Alignment (MSA)",
            "bio_chromato": "Chromatogram (AB1)",
            "bio_proteomics": "Proteomics",
            "bio_physicochem": "Protein Physicochemical",
            "bio_mol3d": "3D Protein Visualizer (PDB)",
            "bio_genomics": "Genomics & Cloning",
            "bio_orf": "ORF Finder",
            "bio_digest": "Restriction Mapper",
            "bio_phylo": "Phylogenetic Tree",
            "bio_popgen": "Population Genomics",
            "bio_ssr": "SSR / Microsatellite Finder",
            "bio_primer": "Primer Design",
            "bio_primer_design": "Primer Analysis & Design",
            "bio_layout_split": "Split Columns",
            "bio_layout_full": "Full Width (100% Laptop)",
            "bio_height_compact": "400px (Compact)",
            "bio_height_std": "540px (Standard)",
            "bio_height_tall": "680px (Tall)",
            "bio_height_auto": "Adaptive Screen",
            "bio_spin": "Auto Spin",
            "bio_center": "Center View",
            "bio_reset_cam": "Reset Camera",
            "bio_axes": "Coordinate Axes",
            "bio_bg": "Change Background",
            "bio_hd_png": "HD Screenshot PNG",

            // AquaLab Specific Translations
            "aqua_overview": "Ecosystem Summary",
            "aqua_dashboard": "Visual Dashboard",
            "aqua_performance": "Culture Performance",
            "aqua_invivo": "In Vivo Analysis",
            "aqua_health": "Fish & Shrimp Health",
            "aqua_reproduction": "Reproduction & Hatchery",
            "aqua_gonad": "Gonad & Hatchery Analysis",
            "aqua_water_quality": "Water Quality & Chemistry",
            "aqua_water_chem": "Physicochemical Parameters",
            "aqua_nutrition": "Nutrition & Feeds",
            "aqua_feed_form": "Feed Formulation (Pearson)",
            "aqua_microbiology": "Microbiology & Biokinetics",
            "aqua_biokinetics": "Bacterial Growth Curves",
            "aqua_doc": "Documentation & Logbook",
            "aqua_eln": "Electronic Lab Notebook",

            // StatWise Specific Translations
            "stat_data_mgmt": "Data Management",
            "stat_missing": "Missing Data Imputation",
            "stat_transform": "Data Transformation",
            "stat_descriptive": "Descriptive Statistics",
            "stat_assumptions": "Basic Assumptions",
            "stat_normality": "Normality Test",
            "stat_homogeneity": "Homogeneity Test",
            "stat_parametric": "Parametric Analysis",
            "stat_ttest_indep": "Independent t-Test",
            "stat_ttest_paired": "Paired Samples t-Test",
            "stat_anova1": "One-Way ANOVA",
            "stat_anova2": "Two-Way ANOVA",
            "stat_posthoc": "Post-Hoc Tests",
            "stat_correlation": "Pearson Correlation",
            "stat_regression": "Linear Regression",
            "stat_nonparametric": "Non-Parametric Analysis",
            "stat_mannwhitney": "Mann-Whitney U Test",
            "stat_wilcoxon": "Wilcoxon Signed-Rank",
            "stat_kruskal": "Kruskal-Wallis Test",
            "stat_spearman": "Spearman Correlation",
            "stat_charts": "Charts & Visualization",
            "stat_boxplot": "Box Plot & Outliers",
            "stat_scatterplot": "Scatter Plot & Fit Line",

            // EcoMetrics Specific Translations
            "eco_sustainability": "Sustainability Analytics",
            "eco_rapfish": "Rapfish (Anchored Proj)",
            "eco_dimension": "Dimension & Vector Exploration",
            "eco_pca": "PCA + Biplot",
            "eco_lda": "Discriminant Analysis (LDA)",
            "eco_clustering": "Clustering Analytics",
            "eco_kmeans": "K-Means++ & Elbow",
            "eco_hca": "Hierarchical (Dendrogram)",
            "eco_anosim": "ANOSIM (Permutation)"
        }
    };

    function getLang() {
        return localStorage.getItem(I18N_STORAGE_KEY) || 'id';
    }

    function t(key, defaultText = '') {
        const lang = getLang();
        if (I18N_DICT[lang] && I18N_DICT[lang][key] !== undefined) {
            return I18N_DICT[lang][key];
        }
        if (I18N_DICT['id'] && I18N_DICT['id'][key] !== undefined) {
            return I18N_DICT['id'][key];
        }
        return defaultText || key;
    }

    function setLang(lang) {
        if (lang !== 'id' && lang !== 'en') lang = 'id';
        localStorage.setItem(I18N_STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        applyI18n(lang);
        updateLangToggleBtns(lang);

        // Dispatch custom event for listeners
        window.dispatchEvent(new CustomEvent('aresLanguageChange', { detail: { lang } }));
    }

    function toggleLang() {
        const cur = getLang();
        const next = cur === 'id' ? 'en' : 'id';
        setLang(next);
    }

    function applyI18n(lang) {
        const dict = I18N_DICT[lang] || I18N_DICT['id'];

        // Elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                if (el.children.length === 0 || el.getAttribute('data-i18n-html') === 'true') {
                    el.innerHTML = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // Elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key] !== undefined) {
                el.placeholder = dict[key];
            }
        });

        // Elements with data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (dict[key] !== undefined) {
                el.title = dict[key];
            }
        });

        // Intelligent Auto-Translation for standard sidebar headers and menu items if untagged
        autoTranslateCommonElements(lang);

        if (typeof window.onAresLanguageChange === 'function') {
            window.onAresLanguageChange(lang);
        }
    }

    // Heuristic mapper for untagged legacy elements
    function autoTranslateCommonElements(lang) {
        const isEn = lang === 'en';
        
        // Translate Sidebar Headers & Common Menu Titles
        const translationPairs = [
            { id: 'Analisis Sekuens', en: 'Sequence Analysis' },
            { id: 'Proteomik', en: 'Proteomics' },
            { id: 'Genomik & Kloning', en: 'Genomics & Cloning' },
            { id: 'Genomik Populasi', en: 'Population Genomics' },
            { id: 'Desain Primer', en: 'Primer Design' },
            { id: 'Ringkasan Ekosistem', en: 'Ecosystem Overview' },
            { id: 'Performa Budidaya', en: 'Culture Performance' },
            { id: 'Reproduksi & Pembenihan', en: 'Reproduction & Hatchery' },
            { id: 'Kualitas Air & Kimia', en: 'Water Quality & Chemistry' },
            { id: 'Nutrisi & Pakan', en: 'Nutrition & Feed' },
            { id: 'Mikrobiologi & Biokinetika', en: 'Microbiology & Biokinetics' },
            { id: 'Dokumentasi & Logbook', en: 'Documentation & Logbook' },
            { id: 'Manajemen Data', en: 'Data Management' },
            { id: 'Uji Asumsi Dasar', en: 'Basic Assumptions' },
            { id: 'Analisis Parametrik', en: 'Parametric Analysis' },
            { id: 'Analisis Non-Parametrik', en: 'Non-Parametric Analysis' },
            { id: 'Grafik & Visualisasi', en: 'Charts & Visualization' },
            { id: 'Analisis Keberlanjutan', en: 'Sustainability Analytics' },
            { id: 'Eksplorasi Dimensi & Vektor', en: 'Dimension & Vector Exploration' },
            { id: 'Analisis Pengelompokan', en: 'Clustering Analytics' },
            { id: 'Panduan & Referensi', en: 'Guide & References' },
            { id: 'Panduan & Info', en: 'Guide & Info' },
            { id: 'Home AREs', en: 'AREs Home' },
            { id: 'Tema', en: 'Theme' },
            { id: 'Bersihkan', en: 'Clear' },
            { id: 'Ekspor PDF', en: 'Export PDF' },
            { id: 'Bilah Menu', en: 'Sidebar Menu' },
            { id: 'Isi Data Sampel', en: 'Load Sample' }
        ];

        document.querySelectorAll('.menu-title, .brand-sub, .sidebar-footer button, .page-desc').forEach(el => {
            const currentText = el.innerText.trim();
            translationPairs.forEach(pair => {
                if (isEn && currentText === pair.id) {
                    el.innerText = pair.en;
                } else if (!isEn && currentText === pair.en) {
                    el.innerText = pair.id;
                }
            });
        });
    }

    function updateLangToggleBtns(lang) {
        const flag = lang === 'en' ? '🇬🇧 EN' : '🇮🇩 ID';

        document.querySelectorAll('.ares-lang-toggle-btn').forEach(btn => {
            const span = btn.querySelector('.ares-lang-text') || btn;
            if (span) {
                span.innerHTML = `<span style="font-weight:700;">${flag}</span>`;
            }
            btn.title = lang === 'en' ? 'Switch to Indonesian / Ganti Bahasa' : 'Switch to English / Ganti Bahasa';
        });

        const singleBtn = document.getElementById('langToggleBtn');
        if (singleBtn) {
            const txt = singleBtn.querySelector('#langToggleText') || singleBtn;
            txt.innerHTML = `<span style="font-weight:700;">${flag}</span>`;
            singleBtn.title = lang === 'en' ? 'Switch to Indonesian / Ganti Bahasa' : 'Switch to English / Ganti Bahasa';
        }
    }

    function setupLangButtons() {
        const lang = getLang();

        const targetContainer = document.querySelector('.header-actions-row') || document.querySelector('.header-actions');
        if (targetContainer && !document.getElementById('langToggleBtn') && !document.querySelector('.ares-lang-toggle-btn')) {
            const btn = document.createElement('button');
            btn.id = 'langToggleBtn';
            btn.type = 'button';
            btn.className = 'header-btn ares-lang-toggle-btn btn btn-outline btn-sm';
            btn.style.cssText = 'cursor:pointer; display:inline-flex; align-items:center; gap:6px; background:var(--surface, transparent); border:1px solid var(--border, #cbd5e1); border-radius:6px; color:var(--text, inherit); padding:6px 12px; font-size:12px; font-weight:600; font-family:inherit; transition:all 0.2s;';
            btn.onclick = toggleLang;
            btn.innerHTML = `<span style="display:inline-block; margin-right:2px;">🌐</span> <span id="langToggleText" class="ares-lang-text"><span style="font-weight:700;">${lang === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'}</span></span>`;
            btn.title = lang === 'en' ? 'Switch to Indonesian / Ganti Bahasa' : 'Switch to English / Ganti Bahasa';
            
            // Insert before theme button or at end
            const themeBtn = document.getElementById('theme-btn') || targetContainer.querySelector('[onclick*="toggleTheme"]');
            if (themeBtn && themeBtn.parentNode === targetContainer) {
                targetContainer.insertBefore(btn, themeBtn);
            } else {
                targetContainer.appendChild(btn);
            }
        }

        updateLangToggleBtns(lang);
    }

    // ═══════════════════════════════════════════════════════════════
    // UNIVERSAL SIDEBAR COLLAPSE & SCREEN FIT UTILITY
    // ═══════════════════════════════════════════════════════════════
    function isSidebarCollapsed() {
        const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
        if (!sidebar) return false;
        return sidebar.classList.contains('collapsed');
    }

    function setSidebarCollapsed(collapsed) {
        const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
        const mainContainer = document.querySelector('.main-container');
        const toggleBtn = document.getElementById('aresSidebarToggleBtn') || document.getElementById('sidebarToggleBtn');
        const floatingBtn = document.getElementById('floatingSidebarOpenBtn');

        if (!sidebar) return;

        if (collapsed) {
            sidebar.classList.add('collapsed');
            if (mainContainer) mainContainer.classList.add('sidebar-is-collapsed');
            localStorage.setItem(SIDEBAR_STORAGE_KEY, 'true');
            if (toggleBtn) {
                toggleBtn.classList.add('active');
                toggleBtn.title = getLang() === 'en' ? 'Show Sidebar Menu' : 'Tampilkan Bilah Menu';
            }
            if (floatingBtn) floatingBtn.style.display = 'inline-flex';
        } else {
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('open'); // For mobile compat
            if (mainContainer) mainContainer.classList.remove('sidebar-is-collapsed');
            localStorage.setItem(SIDEBAR_STORAGE_KEY, 'false');
            if (toggleBtn) {
                toggleBtn.classList.remove('active');
                toggleBtn.title = getLang() === 'en' ? 'Hide Sidebar Menu' : 'Sembunyikan Bilah Menu';
            }
            if (floatingBtn) floatingBtn.style.display = 'none';
        }

        // Trigger resize event for Charts, 3Dmol, Leaflet, Canvas
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 150);
    }

    function toggleUniversalSidebar() {
        // Check if on mobile view (under 768px) where .open class is used for overlay
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar) {
                const isOpen = sidebar.classList.contains('open');
                if (isOpen) {
                    sidebar.classList.remove('open');
                    if (overlay) { overlay.classList.remove('open'); overlay.style.display = 'none'; }
                } else {
                    sidebar.classList.add('open');
                    if (overlay) { overlay.classList.add('open'); overlay.style.display = 'block'; }
                }
            }
            return;
        }

        const currentlyCollapsed = isSidebarCollapsed();
        setSidebarCollapsed(!currentlyCollapsed);
    }

    function setupUniversalSidebar() {
        const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
        if (!sidebar) return;

        // Auto inject sidebar and layout stabilization styles if not already present
        if (!document.getElementById('ares-universal-sidebar-style')) {
            const style = document.createElement('style');
            style.id = 'ares-universal-sidebar-style';
            style.textContent = `
                /* Desktop layout */
                @media (min-width: 769px) {
                    .main-container { 
                        display: flex !important; 
                        flex-direction: row !important;
                        width: 100% !important; 
                        max-width: 100vw !important; 
                        position: relative !important; 
                        overflow: hidden !important; 
                    }
                    .sidebar { 
                        transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1), padding 0.22s ease, opacity 0.18s ease, background 0.3s !important; 
                    }
                    .sidebar.collapsed { 
                        width: 0px !important; 
                        min-width: 0px !important; 
                        max-width: 0px !important; 
                        margin: 0 !important; 
                        margin-left: 0 !important; 
                        padding: 0 !important; 
                        border: none !important; 
                        border-right: none !important; 
                        opacity: 0 !important; 
                        pointer-events: none !important; 
                        overflow: hidden !important; 
                        visibility: hidden !important;
                    }
                    .content-area { 
                        padding: clamp(20px, 2vw, 32px) clamp(20px, 2.5vw, 40px) !important; 
                    }
                }

                /* Mobile & Tablet layout */
                @media (max-width: 768px) {
                    .main-container { 
                        display: flex !important; 
                        flex-direction: column !important; 
                        width: 100% !important; 
                        max-width: 100vw !important; 
                        overflow-x: hidden !important; 
                        overflow-y: auto !important; 
                        height: auto !important; 
                        min-height: calc(100vh - 60px) !important; 
                    }
                    .content-area {
                        padding: 16px 14px 100px 14px !important;
                    }
                }

                /* Universal workspace container centering & overflow guard */
                .content-area, .view-area, .workspace { 
                    flex: 1 1 0% !important; 
                    min-width: 0 !important; 
                    width: 100% !important; 
                    max-width: 100% !important; 
                    box-sizing: border-box !important; 
                    margin: 0 !important; 
                    position: relative !important; 
                    overflow-x: hidden !important;
                }
                
                .tab-pane { 
                    width: 100% !important; 
                    max-width: 1440px !important; 
                    margin-left: auto !important; 
                    margin-right: auto !important; 
                    box-sizing: border-box !important; 
                }

                /* Universal Table horizontal scroll container */
                .table-wrap, .table-wrapper, .tbl-container, .table-data-wrap { 
                    width: 100% !important;
                    max-width: 100% !important; 
                    overflow-x: auto !important; 
                    box-sizing: border-box !important; 
                    -webkit-overflow-scrolling: touch !important; 
                }

                .floating-sidebar-btn { 
                    position: fixed; 
                    left: 16px; 
                    bottom: 20px; 
                    z-index: 95; 
                    background: var(--surface, #1e293b); 
                    color: var(--text, #f8fafc); 
                    border: 1px solid var(--border, #334155); 
                    box-shadow: 0 4px 16px rgba(0,0,0,0.3); 
                    border-radius: 8px; 
                    padding: 8px 14px; 
                    display: none; 
                    align-items: center; 
                    gap: 6px; 
                    font-size: 12px; 
                    font-weight: 700; 
                    cursor: pointer; 
                    transition: all 0.2s ease; 
                    user-select: none; 
                    font-family: inherit; 
                }
                .floating-sidebar-btn:hover { 
                    background: var(--primary-light, #0c4a6e); 
                    color: var(--primary, #38bdf8); 
                    border-color: var(--primary, #38bdf8); 
                    transform: translateY(-2px); 
                    box-shadow: 0 6px 20px rgba(0,0,0,0.4); 
                }
                .main-container.sidebar-is-collapsed .floating-sidebar-btn { 
                    display: inline-flex; 
                }
            `;
            document.head.appendChild(style);
        }

        // Add floating button to main-container if missing
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer && !document.getElementById('floatingSidebarOpenBtn')) {
            const fbtn = document.createElement('button');
            fbtn.id = 'floatingSidebarOpenBtn';
            fbtn.type = 'button';
            fbtn.className = 'floating-sidebar-btn';
            fbtn.onclick = toggleUniversalSidebar;
            fbtn.innerHTML = `<span style="font-size:14px;">☰</span> <span>${getLang() === 'en' ? 'Menu' : 'Bilah Menu'}</span>`;
            fbtn.title = getLang() === 'en' ? 'Show Sidebar Navigation' : 'Buka Bilah Menu';
            mainContainer.appendChild(fbtn);
        }

        // Add header toggle button if missing
        const headerLeft = document.querySelector('.header-left');
        if (headerLeft && !document.getElementById('aresSidebarToggleBtn') && !headerLeft.querySelector('.menu-toggle')) {
            const tbtn = document.createElement('button');
            tbtn.id = 'aresSidebarToggleBtn';
            tbtn.type = 'button';
            tbtn.className = 'btn btn-outline btn-sm';
            tbtn.style.cssText = 'padding:6px 10px; font-size:12px; margin-right:8px; display:inline-flex; align-items:center; gap:5px; cursor:pointer;';
            tbtn.onclick = toggleUniversalSidebar;
            tbtn.innerHTML = `<span style="font-size:13px;">☰</span> <span class="btn-text">${getLang() === 'en' ? 'Sidebar' : 'Bilah'}</span>`;
            tbtn.title = getLang() === 'en' ? 'Toggle Sidebar Menu' : 'Sembunyikan / Tampilkan Bilah Menu';
            
            // Insert at the beginning of header-left
            headerLeft.insertBefore(tbtn, headerLeft.firstChild);
        }

        // Restore saved collapsed state on desktop
        if (window.innerWidth > 768 && localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true') {
            setSidebarCollapsed(true);
        }
    }

    // Storage event for multi-tab synchronization
    window.addEventListener('storage', (e) => {
        if (e.key === I18N_STORAGE_KEY) {
            const newLang = e.newValue || 'id';
            document.documentElement.lang = newLang;
            applyI18n(newLang);
            updateLangToggleBtns(newLang);
        }
    });

    // Public API object
    window.ARES_I18N = {
        getLang,
        setLang,
        toggleLang,
        t,
        applyI18n,
        toggleSidebar: toggleUniversalSidebar,
        setSidebarCollapsed,
        isSidebarCollapsed
    };
    window.toggleLanguage = toggleLang;
    window.toggleSidebar = toggleUniversalSidebar;

    document.addEventListener('DOMContentLoaded', () => {
        const lang = getLang();
        document.documentElement.lang = lang;
        setupLangButtons();
        setupUniversalSidebar();
        applyI18n(lang);
    });

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        const lang = getLang();
        document.documentElement.lang = lang;
        setupLangButtons();
        setupUniversalSidebar();
        applyI18n(lang);
    }
})();
