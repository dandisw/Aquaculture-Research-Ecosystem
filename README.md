
```markdown
# Aquaculture Research Ecosystem (AREs)

> An Integrated Progressive Web Application for Aquaculture Data Management, Statistical Computing, Molecular Analytics, and Spatial Mapping — running entirely in your browser with zero server dependencies.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20729217.svg)](https://doi.org/10.5281/zenodo.20729217)
[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=flat-square)](#license)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-orange?style=flat-square)](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)

---

## Table of Contents

- [Overview](#overview)
- [Why AREs? (Statement of Need)](#why-ares-statement-of-need)
- [Key Features](#key-features)
- [Ecosystem Modules](#ecosystem-modules)
  - [1. AquaLab Workspace](#1-aqualab-workspace)
  - [2. StatWise](#2-statwise)
  - [3. BioTools Suite](#3-biotools-suite)
  - [4. EcoMetrics Multivariat](#4-ecometrics-multivariat)
  - [5. GeoPlot](#5-geoplot)
  - [6. CiteShift](#6-citeshift)
  - [7. ShifterAI](#7-shifterai)
  - [8. Mendeley FPIK Portal](#8-mendeley-fpik-portal)
  - [9. FishCareer Portal](#9-fishcareer-portal)
- [System Architecture](#system-architecture)
- [Data Privacy & Security](#data-privacy--security)
- [Getting Started](#getting-started)
- [Validation Benchmarks](#validation-benchmarks)
- [Citation](#citation)
- [Author](#author)
- [License & Copyright](#license--copyright)

---

## Overview

**AREs (Aquaculture Research Ecosystem)** is a client-side scientific computing platform designed specifically for the multidimensional needs of aquaculture, marine biotechnology, and fisheries researchers. 

By integrating laboratory informatics, validated inferential statistics, molecular bioinformatics, and multivariate ecology into a single Progressive Web Application (PWA), AREs eliminates the need for expensive commercial software licenses and fragmented workflows. 

```text
Platform URL : [https://dandisw.github.io/Aquaculture-Research-Ecosystem/](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)
Version      : v1.0.0 (Initial Public Release)
Developed by : Dandi Setio Wibowo
Institution  : Faculty of Fisheries and Marine Sciences, Universitas Jenderal Soedirman

```

---

## Why AREs? (Statement of Need)

Modern aquaculture research is highly complex, often requiring researchers to collect data in remote field stations (e.g., coastal shrimp ponds) while simultaneously performing advanced laboratory assays. Typically, this requires generic spreadsheets for data logging, IBM SPSS or R for statistics, MEGA for phylogenetics, and PRIMER-e for multivariate ecology.

**The Problem:** Commercial licenses are financially prohibitive for many institutions in developing nations. Web-based portals require stable high-speed internet (unavailable in field environments) and pose critical data privacy risks when handling unpublished genomic sequences or proprietary farm data.

**The AREs Solution:** AREs solves this by executing **100% of its computational operations directly in the user's browser using pure JavaScript**. It works entirely **offline** via Service Worker caching, requires **zero installation**, and ensures absolute **data privacy** because your data never leaves your device.

---

## Key Features

* 🌐 **Offline-First PWA:** Full functionality without internet connectivity after the initial load.
* 🔒 **Absolute Privacy:** Session-only data model. Genomic sequences and experimental data are processed in local RAM and discarded when the tab closes.
* 📁 **Local File Integration:** Upload and parse `.fasta`, `.csv`, `.txt`, and Excel files directly from your local drive (with an 8MB client-side safety limit to prevent browser memory crashes).
* 📊 **SPSS/R Computational Parity:** Statistical algorithms rigorously validated against IBM SPSS Statistics 26 and R CRAN 4.3.
* 🤖 **AI & Cartography Ready:** Bring-Your-Own-Key (BYOK) architecture for Google Gemini AI manuscript drafting and integrated GPS-based spatial mapping.
* 📥 **Export Friendly:** One-click exports to CSV, Print-ready PDF, BibTeX, RIS, and high-resolution SVG/PNG.

---

## Ecosystem Modules

### 1. AquaLab Workspace (v5.2)

A comprehensive digital laboratory notebook and calculator for aquaculture field and lab management:

* **Executive v-Dashboard Customization:** Interactive multi-module dashboard supporting flexible layout orientation (1-Column Vertical / 2-Column / 3-Column Horizontal), smooth drag-and-drop card reordering, individual card minimization, and responsive chart scale presets (Compact, Standard, and Expanded).
* **In Vivo Performance:** Multi-treatment calculator for Survival Rate (SR), ADG, Specific Growth Rate (SGR), FCR, and Feed Efficiency (EP).
* **Water Quality EWS:** Early Warning System for pond equilibrium, calculating free un-ionized ammonia (NH₃) fractions (Emerson et al., 1975) and Biofloc C/N ratio management.
* **Health & Hematology:** Neubauer Haemocytometer calculations for fish/shrimp blood cells and an expert immunological diagnostic dashboard.
* **Reproduction:** GSI, HSI, fecundity, fertilization rate, and hatching rate calculators.
* **Microbiology & Genetics:** PCR Master Mix calculator with real-time volume alert warnings, gel electrophoresis lane logger, OD600 to CFU converter, and empirical TPC logs.
* **Logbook & Inventory Management:** Structured chronological logs and reagent/chemical tracking with **interactive confirmation dialogs** to prevent accidental data loss.
* **Data Export & Reporting:** Direct CSV spreadsheet downloads for laboratory tables alongside synthesized multi-module findings summary copying.
* **Print-Ready PDF Personalization:** Customizable executive lab reports complete with institutional letterhead, researcher legitimacy signatures, and managerial recommendations.

### 2. StatWise (v10.0)

An inferential statistics engine featuring an IBM SPSS-style *Data View / Variable View* interface with direct clipboard paste from Excel:

* **Assumptions:** Shapiro-Wilk (Royston 1992), Kolmogorov-Smirnov (Lilliefors), and median-based Levene's Test.
* **Parametric:** Independent/Paired t-tests, One-Way ANOVA, and Two-Way ANOVA utilizing GLM Type III Sum of Squares.
* **Post Hoc:** Tukey HSD automated with Compact Letter Display (CLD) notation.
* **Non-Parametric:** Mann-Whitney U (exact p-values for N < 20), Wilcoxon Signed-Rank, Kruskal-Wallis, and Dunn's post hoc.

### 3. BioTools Suite (v8.2)

A serverless molecular bioinformatics pipeline optimized for amplicon, targeted gene analyses, and structural biology:

* **3D Protein & Macromolecule Visualizer:** Interactive 3D molecular visualization powered by WebGL/3Dmol with multiple render styles (Cartoon/Ribbon, Stick, Sphere/CPK, Surface, Wireframe), color schemes (Secondary Structure, Rainbow Spectrum, Polarity, B-Factor), RCSB PDB live retrieval, residue-level sequence track navigation, and local `.pdb` file parser.
* **Microsatellite (SSR) Finder:** *In silico* mining of mono- to hexa-nucleotide repeats with canonical motif standardization and automated flanking sequence extraction for primer design.
* **Alignment:** Smith-Waterman local alignment and Center-Star Heuristic Multiple Sequence Alignment (MSA) with nucleotide color-coding.
* **Phylogenetics:** Distance matrix-based UPGMA clustering fortified with **Felsenstein Bootstrap** (up to 1,000 iterations) and high-resolution, unclipped PNG export.
* **Sequence Utilities:** ProtParam-equivalent physicochemical protein analysis (MW & pI), ORF Finder, NEB Restriction Mapper, Sanger Trace Chromatogram Viewer (.ab1), and thermodynamic Primer Design.

### 4. EcoMetrics Multivariat (v2.0)

Multivariate ecological analytics designed for fisheries and environmental data:

* **Rapfish MDS:** Multidimensional sustainability assessment with orthogonal vector projection onto the Bad-Good anchor axis (Pitcher & Preikshot, 2001).
* **PCA & Clustering:** Principal Component Analysis (Biplot/Scree plot), K-Means++ with automated Elbow Method, and Hierarchical Clustering Analysis (UPGMA Dendrogram).
* **Multivariate Tests:** ANOSIM (999-permutation significance testing) and Linear Discriminant Analysis (LDA) with ridge regularization.

### 5. GeoPlot (v1.0)

Spatial mapping tool for field sampling stations. Features real-time GPS tracking, polyline transects (distance), polygon boundaries (area/ha), and automated cartographic layout generation.

### 6. CiteShift (v1.0)

A smart citation manager converting APA, Vancouver, Harvard, and IEEE formats to BibTeX/RIS. Features **Crossref DOI auto-complete** and a curated auto-italic engine for aquaculture Latin species names.

### 7. ShifterAI (v1.0)

A BYOK (Bring-Your-Own-Key) Google Gemini academic drafting assistant. Extracts local PDFs, Excel, and FASTA files client-side before synthesizing Introductions, Results, or Conclusions.

### 8. Mendeley FPIK Portal

One-click installer for the official Final Project CSL citation style of FPIK UNSOED.

### 9. FishCareer Portal

An interactive career navigation map designed specifically for fisheries and aquaculture graduates.

* **Career Landscape:** Explores opportunities beyond traditional farming into Life Sciences, Biotechnology, and Digital Innovation.
* **Postgraduate Pathways:** Detailed roadmaps for Master's (S2) and Doctoral (S3) specializations, including potential career outcomes.
* **Community Access:** Direct integration with the official WhatsApp channel for curated job openings, research internships, and scholarship information.

---

## System Architecture

AREs is built exclusively with HTML5, CSS3, and vanilla ES6+ JavaScript. It bypasses backend servers and complex build toolchains to ensure maximum deployability and scientific archival longevity.

```text
┌──────────────────────────────────────────────────────────────────┐
│                         User's Browser                           │
│                                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │AquaLab │ │StatWise│ │BioTools│ │EcoMetr.│ │GeoPlot │  ...   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                                  │
│           All core computation runs here (V8 JS engine)          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Service Worker (PWA Cache Architecture)          │   │
│  │         Full offline support after initial load          │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
         │ (Optional: Only for specific user-initiated queries)
         ▼
   NCBI E-Utilities · Crossref API · Google Gemini (via proxy)

```

---

## Data Privacy & Security

**Your data is yours.** All experimental spreadsheets, water quality metrics, and sensitive pre-publication genomic sequences are processed purely in your device's local RAM.

* No databases are used to store your research.
* When you close the browser tab, the session data is permanently destroyed.
* The ONLY external communications are explicit, user-initiated API calls (e.g., clicking the "BLAST to NCBI" button or querying a DOI).

---

## Getting Started

### Option 1: Run in Browser (Recommended)

Simply open the platform in any modern web browser (Chrome, Firefox, Edge, Safari):

👉 **[Launch AREs Web App](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)**

### Option 2: Install as Desktop/Mobile App (PWA)

1. Open the URL in Chrome or Edge.
2. Click the **Install** icon (⊕) in the browser address bar, or select **"Add to Home Screen"** from your mobile browser menu.
3. AREs will install as a standalone application capable of running completely offline.

### Option 3: Local Execution

```bash
git clone [https://github.com/dandisw/Aquaculture-Research-Ecosystem.git](https://github.com/dandisw/Aquaculture-Research-Ecosystem.git)
cd Aquaculture-Research-Ecosystem
python3 -m http.server 8000
# Open http://localhost:8000 in your browser

```

---

## Validation Benchmarks

To ensure scientific rigor, AREs algorithms have been benchmarked against industry standards:

* **StatWise:** ANOVA (Type III SS), Shapiro-Wilk, and Tukey HSD outputs exactly match **IBM SPSS Statistics 26** and **R CRAN 4.3** within floating-point tolerance.
* **BioTools:** Pairwise alignments and physicochemical properties validate against **EMBOSS Water** and **ExPASy ProtParam**. Phylogenetic tree topologies match **MEGA 11**.
* **EcoMetrics:** Rapfish MDS ordinates identically to the original Excel macro methodology by Pitcher & Preikshot (2001).

---

## Citation

If you use AREs in your research, thesis, or publications, please cite the software using the official Zenodo DOI:

**APA Format:**

> Wibowo, D. S. (2026). AREs: An Integrated Progressive Web Application for Aquaculture Data Management, Statistical Computing, Molecular Analytics, and Spatial Mapping (v1.0.0). Zenodo. https://doi.org/10.5281/zenodo.20729217

**BibTeX Format:**

```bibtex
@software{wibowo2026ares,
  author       = {Wibowo, Dandi Setio},
  title        = {AREs: An Integrated Progressive Web Application for Aquaculture Data Management, Statistical Computing, Molecular Analytics, and Spatial Mapping (v1.0.0)},
  year         = {2026},
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.20729217},
  url          = {[https://doi.org/10.5281/zenodo.20729217](https://doi.org/10.5281/zenodo.20729217)}
}

```

---

## Author

**Dandi Setio Wibowo**

Faculty of Fisheries and Marine Sciences (FPIK), Universitas Jenderal Soedirman, Purwokerto, Indonesia

* GitHub: [@dandisw](https://github.com/dandisw)
* ORCID: [0009-0002-5337-499X](https://orcid.org/0009-0002-5337-499X)
* Instagram: [@aquaculture.research](https://instagram.com/aquaculture.research)

---

## License & Copyright

**Copyright (c) 2026 Dandi Setio Wibowo. All rights reserved.**

This project, including all source code, algorithms, visual designs, and documentation, is proprietary software protected under international copyright laws. Unauthorized copying, distribution, modification, reverse engineering, or commercial exploitation of any part of this repository without explicit prior written consent from the author is strictly prohibited.

```

```
