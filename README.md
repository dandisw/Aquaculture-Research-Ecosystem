# Aquaculture Research Ecosystem (AREs)

> A Progressive Web Application for integrated aquaculture data management, statistical computing, molecular bioinformatics, and multivariate ecological analysis — running entirely in your browser, with no server required.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-orange?style=flat-square)](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)
[![Platform](https://img.shields.io/badge/Platform-Browser%20(No%20Install)-lightgrey?style=flat-square)]()

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Modules](#modules)
  - [AquaLab Workspace](#1-aqualab-workspace)
  - [StatWise](#2-statwise)
  - [BioTools Suite](#3-biotools-suite)
  - [EcoMetrics Multivariat](#4-ecometrics-multivariat)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Data Privacy](#data-privacy)
- [Validation & References](#validation--references)
- [Changelog](#changelog)
- [Citation](#citation)
- [Author](#author)

---

## Overview

**AREs (Aquaculture Research Ecosystem)** is an open-source, browser-based scientific computing platform built specifically for aquaculture and fisheries researchers. It integrates four specialized analytical modules into a single, unified interface that works completely offline — no installation, no server backend, no licensing fees.

All calculations are executed client-side using pure JavaScript, meaning your experimental data and genomic sequences **never leave your device**.

```
Platform URL : https://dandisw.github.io/Aquaculture-Research-Ecosystem/
Developed by : Dandi Setio Wibowo
Institution  : Faculty of Fisheries and Marine Sciences (FPIK),
               Universitas Jenderal Soedirman, Indonesia
```

---

## Key Features

| Feature | Description |
|---|---|
| **Offline-first** | Full functionality via Service Worker caching — no internet required after first load |
| **Zero server dependency** | All computation runs in the browser (pure JavaScript) |
| **Privacy-preserving** | No data is transmitted to external servers (except voluntary NCBI BLAST queries) |
| **Cross-platform** | Works on desktop, tablet, and mobile browsers |
| **No installation** | Open the URL and start working immediately |
| **SPSS/R parity** | Statistical outputs validated against IBM SPSS and R CRAN |
| **Export-ready** | Export results to CSV, PDF, and SPSS-compatible formats |
| **Installable PWA** | Can be installed as a desktop/mobile app via browser "Add to Home Screen" |

---

## Modules

### 1. AquaLab Workspace

A comprehensive digital laboratory notebook for aquaculture research, covering in vivo performance analytics through molecular lab management.

#### Aquaculture Performance (In Vivo)

Comparative performance calculator for multi-treatment experiments. Computes all standard growth and survival metrics from biomass data.

| Parameter | Formula |
|---|---|
| Survival Rate (SR) | `(Nt / N0) × 100 (%)` |
| Average Daily Growth (ADG) | `(Wt − W0) / t  (g/day)` |
| Specific Growth Rate (SGR) | `[(ln Wt − ln W0) / t] × 100 (%/day)` |
| Feed Conversion Ratio (FCR) | `F / (Final Biomass − Initial Biomass)` |
| Feed Efficiency (EP) | `(Biomass Gain / F) × 100 (%)` |

> Reference: Lugert et al. (2016). *Reviews in Aquaculture*, 8(1), 50–62. doi:10.1111/raq.12099

#### Fish & Shrimp Health Profile

Clinical blood analysis module for hematology and immunology parameters:

- **Fish blood parameters**: Erythrocyte count, Leukocyte count, Hematocrit (Ht), Hemoglobin (Hb), Phagocytic Activity (AF), Blood Glucose, Liver TPC
- **Shrimp hemolymph**: Total Haemocyte Count (THC), Respiratory Burst (RB), Prophenoloxidase Activity (PO)
- **Haemocytometer Calculator** (Neubauer Improved): converts raw microscopic cell counts to standardized hematological units (cells/mm³)
- **Chemical Dosimetry Calculator**: calculates required amounts of disinfectants/treatments (Chlorine, KMnO₄, Formalin, Lime) based on water volume and target concentration (ppm)
- **Expert Diagnostic Dashboard**: automated immunological status interpretation

> References: Blaxhall & Daisley (1973), doi:10.1111/j.1095-8649.1973.tb04510.x; Johansson et al. (2000), doi:10.1016/S0044-8486(00)00342-9

#### Reproduction & Hatchery

Gonad maturation and hatchery performance analysis:

| Parameter | Formula |
|---|---|
| Gonadosomatic Index (GSI) | `(Wg / Wt) × 100 (%)` |
| Hepatosomatic Index (HSI) | `(Wh / Wt) × 100 (%)` |
| Gravimetric Fecundity | `(Wg / w) × n (eggs)` |
| Fertilization Rate (FR) | `(Fertilized Eggs / Total Egg Sample) × 100 (%)` |
| Hatching Rate (HR) | `(Hatched Eggs / Fertilized Eggs) × 100 (%)` |
| Larval Survival Rate (SR) | `(Nt / N0) × 100 (%)` |

> References: Effendie (1997); SNI 8111:2015

#### Feed & Nutrition Management

- **Feeding Rate Program**: daily feed requirement based on Average Body Weight (ABW), population, biomass, and feeding rate (%)
- **Pearson Square Formulation**: two-ingredient feed formulation to achieve target protein content
- **Proximate Analysis Table**: records and manages Protein, Fat, Crude Fiber, Ash, Moisture, and NFE data per feed brand/batch

> Reference: NRC (2011). *Nutrient Requirements of Fish and Shrimp*, doi:10.17226/13039

#### Water Quality EWS (Early Warning System)

Real-time water quality monitoring with dynamic expert dashboard:

- **Monitored parameters**: Temperature, DO, TAN (Total Ammonia Nitrogen), Free NH₃, Alkalinity, TDS, Turbidity (Secchi), Nitrite, Nitrate, BOD, TOM
- **Free NH₃ calculation**: `TAN × fraction(pH, T°C)` — lethal limit: ≤ 0.02 mg/L
- **Biofloc C/N Ratio Management**: calculates required carbon source addition (molasses, tapioca, sugar) to achieve target C/N ratio and control TAN

> References: Emerson et al. (1975), doi:10.1139/f75-274; Avnimelech (1999), doi:10.1016/S0044-8486(99)00085-X; SNI 8228.1:2015

#### Plankton & Ecology Analysis

- **Cell Density Calculator**: Sedgwick-Rafter Cell (SRC) and Haemocytometer methods
- **Bloom Kinetics**: Specific Growth Rate (K), Relative Growth Rate (RGR), Doubling Time
- **Ecological Indices**: Shannon-Wiener Diversity (H'), Evenness (E), Dominance (C)

> Reference: Hillebrand et al. (1999), doi:10.1046/j.1529-8817.1999.3520403.x

#### Microbiology Lab (In Vitro)

- **OD600 to Cell Density**: converts optical density readings to CFU/mL estimates
- **Log-phase Kinetics**: specific growth rate (µ) and generation time (td) from OD600 time-series
- **TPC Calculator**: `TPC (CFU/mL) = (Σ colonies / plating volume) × 10^dilution factor`
- **Inhibition Zone Analyzer**: categorizes antibacterial/antifungal activity from disk/well diffusion measurements

> Reference: Sutton (2011). *Journal of Validation Technology*, 17(3), 42–46

#### Molecular Lab (DNA/PCR)

- **Thermocycler Profile Generator**: annealing temperature recommendation based on primer Tm
- **PCR Master Mix Calculator**: automatically scales reagent volumes for n reactions + 10% overage
- **Electrophoresis Log**: records band size (bp) and intensity per sample

> Reference: SantaLucia (1998). *PNAS*, 95(4), 1460–1465. doi:10.1073/pnas.95.4.1460

#### Lab Data Management

- **Research Logbook**: timestamped activity and observation journal
- **Reagent Inventory**: tracks item categories, storage temperature, and stock levels
- **Booking & Scheduling**: equipment booking and material request management

**Export formats**: CSV (for spreadsheet/SPSS import), SPSS-labeled column headers, interactive charts (PNG via right-click)

---

### 2. StatWise

A pure JavaScript statistical computing engine with output validated against IBM SPSS and R CRAN. Supports an SPSS-style Data View / Variable View interface with direct paste from Excel.

#### Data Management

| Feature | Description |
|---|---|
| **Missing Data Handler** | Listwise and pairwise deletion options |
| **Data Transformation** | Log (ln, log₁₀), Square Root, Arcsine transformations |
| **Descriptive Statistics** | Mean, SD, SE, Min, Max, Median, IQR, 95% CI |

#### Normality Tests

| Test | Implementation |
|---|---|
| **Shapiro-Wilk** | Royston (1992) approximation — validated against R `shapiro.test()` |
| **Kolmogorov-Smirnov** | With Lilliefors correction (Dallal-Wilkinson, 1986) — validated against R `nortest::lillie.test()` |

#### Homogeneity Tests

| Test | Implementation |
|---|---|
| **Levene's Test** | Median-based (Brown & Forsythe, 1974) — robust against outliers |
| **Bartlett's Test** | Parametric option for normally distributed data |

#### Parametric Tests

| Test | Notes |
|---|---|
| **Independent t-test** | Student's and Welch's variants |
| **Paired t-test** | |
| **One-Way ANOVA** | |
| **Two-Way ANOVA** | GLM with Type III Sum of Squares via Gauss-Jordan matrix elimination — handles unbalanced designs |
| **Post Hoc (Tukey HSD)** | Compact Letter Display (CLD) via Piepho (2004) algorithm — journal-standard notation |

#### Non-Parametric Tests

| Test | Notes |
|---|---|
| **Mann-Whitney U** | Exact p-value for N < 20 (permutation distribution); asymptotic Z for larger samples |
| **Wilcoxon Signed-Rank** | |
| **Kruskal-Wallis** | With Dunn's post hoc test |

#### Correlation & Regression

- Pearson and Spearman correlation coefficients
- Simple linear regression with R², p-value, and interactive scatter plot

**Output**: All results accumulate in a scrollable Analysis Report panel. Export to print-ready PDF with one click (native browser print, no server needed).

> Key references: Royston (1992); Brown & Forsythe (1974); Piepho, H.P. (2004). *Agronomy Journal*, 96(4), 1155–1159.

---

### 3. BioTools Suite

An end-to-end molecular bioinformatics toolkit that processes standard FASTA-formatted sequences entirely client-side.

> **Privacy note**: All sequence analysis is performed locally in your browser. Sequences are **never uploaded to any server**. The sole exception is the NCBI BLAST module, which communicates with NCBI E-Utilities as required for database search.

#### NCBI Search & BLAST Integration

- Keyword search via NCBI E-Search API (species names, accession numbers)
- Automatic QBlast trigger when a DNA sequence (>20 bp) is entered
- Diversity filter options: no filter / max 1 per species / max 2 per genus
- Results table: Accession, Organism, E-value, Identity (%), Length (bp)

#### DNA Sequence Manipulation

Offline tools for basic sequence operations:

| Function | Description |
|---|---|
| GC Content (%) | Calculates GC percentage |
| Reverse Complement | Standard 5'→3' reverse complement |
| DNA → RNA | Transcription (T → U) |
| Protein Translation | Standard genetic code, 5'→3' reading frame |

#### Pairwise Sequence Alignment

- Algorithm: **Smith-Waterman local alignment** (Smith & Waterman, 1981)
- Outputs: aligned sequences with gap characters, Sequence Identity (%), Sequence Similarity (%)
- Recommended input limit: ≤ 3,000 bp per sequence for optimal browser RAM usage

> Reference: Smith & Waterman (1981). *Journal of Molecular Biology*, 147(1), 195–197.

#### Multiple Sequence Alignment (MSA)

- Algorithm: **Center-Star Heuristic** with pairwise Needleman-Wunsch global alignment
- Input: Multi-FASTA format (max 20 sequences)
- Output: color-coded alignment (A=Red, T/U=Green, C=Blue, G=Yellow), asterisk (*) marks 100% conserved columns
- Export: Copy to Word (preserves HTML color formatting)

> Reference: Notredame et al. (2000). *Journal of Molecular Biology*, 302(1), 205–217.

#### Physicochemical Protein Analysis (ProtParam equivalent)

Calculates from single-letter amino acid sequences:

| Parameter | Method |
|---|---|
| Molecular Weight (Da) | Average isotope masses |
| Theoretical pI | EMBOSS pK values (Bjellqvist et al., 1993) |
| Chain length (aa) | |
| Amino acid frequency | All 20 standard residues |

> References: Bjellqvist et al. (1993). *Electrophoresis*, 14(1), 1023–1031; Gasteiger et al. (2005).

#### ORF Finder

- Detects all Open Reading Frames across **6 reading frames** (3 forward + 3 reverse)
- Minimum ORF threshold: > 30 amino acids
- Output: ORF list with length (bp), frame, and translated protein sequence

#### Restriction Enzyme Mapper

- Library: New England Biolabs (NEB) standard recognition site database
- Input: DNA sequence (plasmid or linear gene)
- Output: cut site table (enzyme name, recognition sequence, positions) + gel electrophoresis fragment prediction

#### Phylogenetic Tree Construction

- MSA → distance matrix → **UPGMA clustering** → **Felsenstein Bootstrap** (up to 1,000 iterations)
- Distance metric: 1 − Percent Identity from MSA
- Output: SVG tree visualization with customizable line color, font family, and italic style (for taxonomic names)
- Exports: SVG fullscreen, Newick format (plain text)
- Bootstrap values displayed at each clade node

> References: Felsenstein (1985). *Evolution*, 39(4), 783–791; Saitou & Nei (1987).

#### Primer Design & Analysis

- **Manual calculator**: Tm (nearest-neighbor thermodynamics), GC%, length, recommended annealing temperature (Ta = Tm(min) − 5°C)
- **Auto-design**: generates optimal forward/reverse primer pairs from a target sequence (min 150 bp input), with predicted amplicon size and translated candidate gene sequence

> Reference: SantaLucia (1998). *PNAS*, 95(4), 1460–1465. doi:10.1073/pnas.95.4.1460

---

### 4. EcoMetrics Multivariat

A multivariate statistics and ecological analysis hub for fisheries and aquaculture research. All algorithms are implemented in pure client-side JavaScript with copy-to-Word output support.

**Input format**: Tab-separated data pasted directly from Microsoft Excel or Google Sheets.

#### Rapfish (MDS Sustainability Assessment)

- Implements the **RAPFISH** ordination framework (Pitcher & Preikshot, 2001) for multidimensional scaling along a Bad–Good reference axis
- Supports multiple sustainability dimensions (Ecological, Social, Economic, Ethical, Technological)
- Output: Sustainability Index (%) per dimension, Kite Diagram (radar chart) for visual reporting

> Reference: Pitcher, T.J. & Preikshot, D. (2001). *Fisheries Research*, 49(3), 255–270. doi:10.1016/S0165-7836(00)00205-8

#### PCA + Biplot

- Algorithm: real eigenvalue decomposition of the standardized covariance matrix
- Outputs: Scree Plot (variance explained per PC), PCA Biplot (sample scores + variable loadings), Eigenvalue & Variance summary table
- Input: Label column + numeric variable columns (paste from Excel)

> Reference: Jolliffe & Cadima (2016). *Philosophical Transactions of the Royal Society A*, 374(2065), 20150202.

#### K-Means++ & Elbow Method

- Algorithm: **K-Means++** (smart centroid initialization) with Within-Cluster Sum of Squares (WCSS) minimization
- **Elbow Method**: plots WCSS across k = 1…10 to identify optimal number of clusters
- Output: cluster membership table, 2D scatter plot (first two variables)

> Reference: Jain (2010). *Pattern Recognition Letters*, 31(8), 651–666. doi:10.1016/j.patrec.2009.09.011

#### Hierarchical Clustering (UPGMA Dendrogram)

- Algorithm: Agglomerative hierarchical clustering using **UPGMA (Unweighted Pair Group Method with Arithmetic Mean)** and Euclidean distance
- Output: interactive SVG dendrogram

> Reference: Murtagh & Contreras (2012). *WIREs Data Mining*, 2(1), 86–97. doi:10.1002/widm.53

#### ANOSIM (Analysis of Similarities)

- Algorithm: non-parametric multivariate test on a Bray-Curtis dissimilarity matrix
- **999-permutation test** for significance (R-statistic and p-value)
- Input: Label | Group | Numeric variables (columns)

> Reference: Clarke, K.R. (1993). *Australian Journal of Ecology*, 18(1), 117–143. doi:10.1111/j.1442-9993.1993.tb00438.x

#### Linear Discriminant Analysis (LDA)

- Finds discriminant axes that maximize between-group separation
- Output: LDA scatter plot (LD1 vs LD2), discriminant function summary
- Input: Label | Group | Numeric variables (columns)

> Reference: Izenman (2013). *Modern Multivariate Statistical Techniques*, Springer. doi:10.1007/978-0-387-78189-1_8

---

## Architecture

AREs is built as a **Progressive Web Application (PWA)** using only HTML, CSS, and vanilla JavaScript — no build tools, no bundlers, no backend framework.

```
┌─────────────────────────────────────────────────────┐
│                    User's Browser                   │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │AquaLab   │  │StatWise  │  │BioTools  │  ...      │
│  │Workspace │  │          │  │Suite     │           │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
│         All computation runs here (JS engine)       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │         Service Worker (PWA Cache)          │   │
│  │    Full offline support after first load    │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         │ (Only if user initiates BLAST)
         ▼
   NCBI E-Utilities API
```

| Property | Value |
|---|---|
| **Computation** | 100% client-side JavaScript |
| **Server dependency** | None (except NCBI BLAST API, optional) |
| **Offline support** | Yes — Service Worker with full asset caching |
| **Storage** | None — session-only, no persistent local storage |
| **Frameworks** | None — pure vanilla JS, HTML5, CSS3 |
| **Hosting** | GitHub Pages (static) |
| **Installation** | Not required — runs in any modern browser |

---

## Getting Started

### Option 1 — Use directly (recommended)

Open in any modern browser (Chrome, Firefox, Edge, Safari):

```
https://dandisw.github.io/Aquaculture-Research-Ecosystem/
```

No installation, no sign-up, no account required.

### Option 2 — Install as a PWA (desktop/mobile)

1. Open the URL in Chrome or Edge
2. Click the **install icon** (⊕) in the browser address bar, or open the browser menu and select **"Add to Home Screen"** / **"Install App"**
3. The platform will be installed as a standalone app and will work fully offline

### Option 3 — Run locally (for development)

```bash
git clone https://github.com/dandisw/Aquaculture-Research-Ecosystem.git
cd Aquaculture-Research-Ecosystem

# Serve with any static file server, e.g.:
python3 -m http.server 8000
# Then open: http://localhost:8000
```

> A static file server is required for Service Worker registration. Opening `index.html` directly as a file (`file://`) will disable the offline/PWA features.

---

## Data Privacy

All computation in AREs is performed **locally in your browser**. Your data is never transmitted to any external server, database, or cloud service.

This applies to:
- In vivo and hematological data entered in AquaLab
- Statistical datasets entered in StatWise
- DNA and protein sequences processed in BioTools
- Ecological datasets processed in EcoMetrics

**The only exception** is the NCBI BLAST module in BioTools Suite. When you enter a DNA sequence and trigger BLAST, that sequence is sent to the NCBI E-Utilities API (`https://eutils.ncbi.nlm.nih.gov`) as required for database search. This action is always user-initiated and clearly labeled in the interface.

---

## Validation & References

### StatWise — SPSS/R Computational Parity

StatWise has been developed and iteratively validated against IBM SPSS Statistics and R CRAN to achieve equivalent numerical outputs:

| Test | Validation Reference |
|---|---|
| Shapiro-Wilk | Royston, P. (1992). *Statistics and Computing*, 2(3), 117–119 |
| K-S + Lilliefors | Dallal, G.E. & Wilkinson, L. (1986). *American Statistician*, 40(4), 294–296 |
| Levene (median) | Brown, M.B. & Forsythe, A.B. (1974). *Journal of the American Statistical Association*, 69(346), 364–367 |
| GLM ANOVA (Type III SS) | Implemented via Gauss-Jordan matrix inversion — equivalent to SPSS `UNIANOVA` Type III |
| Post Hoc CLD | Piepho, H.P. (2004). *Agronomy Journal*, 96(4), 1155–1159 |
| Mann-Whitney exact | Exact permutation p-value for N < 20; asymptotic Z for larger N |

### BioTools Suite — Algorithm References

| Module | Reference |
|---|---|
| Smith-Waterman | Smith & Waterman (1981). *J. Mol. Biol.*, 147(1), 195–197 |
| Needleman-Wunsch / MSA | Notredame et al. (2000). *J. Mol. Biol.*, 302(1), 205–217 |
| UPGMA phylogeny | Saitou & Nei (1987). *Mol. Biol. Evol.*, 4(4), 406–425 |
| Felsenstein Bootstrap | Felsenstein (1985). *Evolution*, 39(4), 783–791 |
| ProtParam (pI) | Bjellqvist et al. (1993). *Electrophoresis*, 14(1), 1023–1031 |
| Primer Tm | SantaLucia (1998). *PNAS*, 95(4), 1460–1465 |

### EcoMetrics — Algorithm References

| Module | Reference |
|---|---|
| Rapfish MDS | Pitcher & Preikshot (2001). *Fisheries Research*, 49(3), 255–270 |
| PCA | Jolliffe & Cadima (2016). *Phil. Trans. R. Soc. A*, 374, 20150202 |
| K-Means++ | Jain (2010). *Pattern Recognition Letters*, 31(8), 651–666 |
| UPGMA HCA | Murtagh & Contreras (2012). *WIREs Data Mining*, 2(1), 86–97 |
| ANOSIM | Clarke (1993). *Australian Journal of Ecology*, 18(1), 117–143 |
| LDA | Izenman (2013). *Modern Multivariate Statistical Techniques*, Springer |

---

## Changelog

### AquaLab Workspace

| Version | Changes |
|---|---|
| v5.0 (current) | Added Hatchery Performance module (FR, HR, larval SR); UI theme emoji standardization via CSS filters |
| v4.0–v4.3 | Blood Health module; Gonad Analysis; Biofloc C/N management; Feed Formulation (Pearson); Plankton Ecology Indices; PCR Thermocycler UI fix; Feed Efficiency (EP) |
| v1.0–v3.5 | In Vivo, In Vitro (Microbiology/PCR), Water Quality EWS, basic plankton |

### StatWise

| Version | Changes |
|---|---|
| v10.0 (current) | Full responsive layout for mobile/tablet; documentation integration; UI restructure without breaking computation |
| v9.0 | SPSS/R parity closure: GLM Type III SS matrix, Missing Data handling, K-S Lilliefors approximation, exact Mann-Whitney for small N |
| v7.0–v8.0 | Log/sqrt/arcsine transformations; t-test (Student/Welch); Pearson/Spearman correlation; linear regression; interactive boxplot; Dunn's test; CSV/TSV export |
| v5.0–v6.0 | Cumulative analysis report panel; native PDF export; automatic scientific-language text interpretation |
| v1.0–v4.0 | SPA architecture; Excel matrix input; Incomplete Beta & Log-Gamma engine for extreme p-values; Piepho (2004) CLD notation |

### BioTools Suite

| Version | Changes |
|---|---|
| v6.0 (current) | Physicochemical Protein Analysis (ProtParam equivalent): MW, pI, amino acid composition; UI standardization |
| v5.0 | Copy-to-Word with HTML color preservation; custom SVG tree palette (line color, font style, italic); zoom up to 300% |
| v4.0 | Center-Star Heuristic MSA; Felsenstein Non-parametric Bootstrap (up to 1,000 iterations) |
| v1.0–v3.0 | Client-side architecture; Smith-Waterman alignment; NEB Restriction Mapper; auto primer design |

### EcoMetrics Multivariat

| Version | Changes |
|---|---|
| v2.0 (current) | **New modules**: Hierarchical Clustering Analysis (HCA) with UPGMA linkage and interactive SVG dendrogram; ANOSIM with 999-permutation rank-based significance test; Linear Discriminant Analysis (LDA) via within/between-class scatter matrix decomposition ($S_W^{-1} S_B$) with ridge regularization. **Enhancements**: PCA Biplot now overlays loadings vectors on score plot; K-Means Elbow Method automatically plots WCSS for k = 1–10. **Bug fixes**: Rapfish Anchored Projection replaced linear distance ratio with orthogonal vector projection onto Bad–Good anchor line (equivalent to standard MDS rotation); PCA imaginary eigenvalue filter applied to `numeric.js` decomposition output (real parts only); K-Means centroid initialization upgraded from random to K-Means++ for stable convergence |
| v1.0 | Initial prototype: Copy-paste matrix input from Excel; Rapfish MDS for multi-dimensional sustainability assessment (Ecological, Economic, Social, Technological dimensions); PCA with Scree Plot visualization; K-Means clustering for unsupervised grouping of aquaculture stations |

---

## Citation

If you use AREs in your research, please cite:

```bibtex
@software{wibowo2026ares,
  author    = {Wibowo, Dandi Setio},
  title     = {AREs: A Progressive Web Application for Integrated Aquaculture
               Data Management, Statistical Computing, and Molecular Analytics},
  year      = {2026},
  url       = {https://dandisw.github.io/Aquaculture-Research-Ecosystem/},
  note      = {Accessed: [date]}
}
```

> A peer-reviewed manuscript describing the platform architecture and validation is currently under preparation for submission to an international journal.

---

## Author

**Dandi Setio Wibowo**  
Faculty of Fisheries and Marine Sciences (FPIK)  
Universitas Jenderal Soedirman, Purwokerto, Indonesia

- Instagram: [@aquaculture.research](https://instagram.com/aquaculture.research)
- GitHub: [github.com/dandisw](https://github.com/dandisw)
- ORCID: 0009-0002-5337-499X

---

## License

This project is licensed under the [MIT License](LICENSE).

You are free to use, copy, modify, merge, publish, distribute, and sublicense this software, provided the original copyright notice is included.

---

<p align="center">
  <em>© 2026 Aquaculture Research Ecosystem — All tools execute locally in your browser for absolute privacy.</em>
</p>
