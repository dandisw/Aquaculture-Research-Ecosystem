# Aquaculture Research Ecosystem (AREs)

> A Progressive Web Application for integrated aquaculture data management, statistical computing, molecular bioinformatics, multivariate ecological analysis, spatial mapping, and AI-assisted manuscript formatting — running entirely in your browser.

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
  - [GeoPlot](#5-geoplot)
  - [CiteShift](#6-citeshift)
  - [ShifterAI](#7-shifterai)
  - [Mendeley FPIK Portal](#8-mendeley-fpik-portal)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Data Privacy](#data-privacy)
- [Validation & References](#validation--references)
- [Changelog](#changelog)
- [Citation](#citation)
- [Author](#author)

---

## Overview

**AREs (Aquaculture Research Ecosystem)** is an open-source, browser-based scientific computing platform built specifically for aquaculture and fisheries researchers. It integrates eight specialized analytical and productivity modules into a single, unified interface that works completely offline via PWA — no installation, no backend dependency, and no licensing fees.

Calculations are executed client-side using pure JavaScript, ensuring your experimental data and genomic sequences **never leave your device**.

```text
Platform URL : [https://dandisw.github.io/Aquaculture-Research-Ecosystem/](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)
Developed by : Dandi Setio Wibowo
Institution  : Faculty of Fisheries and Marine Sciences (FPIK),
               Universitas Jenderal Soedirman, Indonesia

```

---

## Key Features

| Feature | Description |
| --- | --- |
| **Offline-first** | Full functionality via Service Worker caching — no internet required after first load |
| **Zero server dependency** | Computation runs in the browser (pure JavaScript) |
| **Privacy-preserving** | No data is transmitted to external servers (except voluntary API queries) |
| **Cross-platform** | Works on desktop, tablet, and mobile browsers |
| **No installation** | Open the URL and start working immediately |
| **SPSS/R parity** | Statistical outputs validated against IBM SPSS and R CRAN |
| **AI Integration** | Bring-Your-Own-Key (BYOK) architecture for Gemini AI |
| **Installable PWA** | Can be installed as a desktop/mobile app via browser "Add to Home Screen" |

---

## Modules

### 1. AquaLab Workspace

A comprehensive digital laboratory notebook for aquaculture research, covering in vivo performance analytics through molecular lab management.

* **In Vivo Analytics**: SR, ADG, SGR, FCR, Feed Efficiency (EP).
* **Health Profile**: Clinical blood analysis (Erythrocyte, Leukocyte, Ht, Hb), Haemocytometer Calculator, and Chemical Dosimetry.
* **Water Quality EWS**: Real-time monitoring for DO, TAN, Free NH₃, and Biofloc C/N ratio management.
* **Microbiology (In Vitro)**: OD600 to cell density, Log-phase kinetics, TPC Calculator, and Inhibition Zone Analyzer.

### 2. StatWise

A pure JavaScript statistical computing engine with output validated against IBM SPSS and R CRAN. Supports an SPSS-style Data View / Variable View interface.

* **Parametric**: Independent/Paired t-test, One-Way ANOVA, Two-Way ANOVA (GLM Type III SS).
* **Non-Parametric**: Mann-Whitney U, Wilcoxon, Kruskal-Wallis.
* **Post Hoc**: Tukey HSD with Compact Letter Display (CLD) and Dunn's Test.
* **Regression**: Linear regression with interactive scatter plot and PDF export.

### 3. BioTools Suite

An end-to-end molecular bioinformatics toolkit that processes standard FASTA sequences entirely client-side.

* **Sequence Manipulation**: GC%, Reverse Complement, Transcription, Translation.
* **Alignment**: Smith-Waterman local alignment and Center-Star Heuristic MSA.
* **Phylogenetics**: UPGMA clustering with Felsenstein Bootstrap (1,000 iterations) and SVG tree export.
* **Protein Analysis**: Molecular Weight and Theoretical pI (ProtParam equivalent).
* **Lab Tools**: ORF Finder, Restriction Enzyme Mapper, and Auto Primer Design.

### 4. EcoMetrics Multivariat

A multivariate statistics and ecological analysis hub for fisheries and aquaculture research.

* **Rapfish (MDS)**: Multi-dimensional sustainability assessment with Kite Diagram visualization.
* **PCA**: Principal Component Analysis with Scree Plot and Biplot vectors.
* **Clustering**: K-Means++ with Elbow Method, and Hierarchical Clustering (UPGMA Dendrogram).
* **Discriminant Analysis**: ANOSIM (999-permutation) and Linear Discriminant Analysis (LDA).

### 5. GeoPlot

An interactive spatial mapping and cartography platform for field surveys.

* **Geolocation**: Pinpoint sampling locations using high-accuracy device GPS.
* **Measurements**: Interactive distance (polylines) and area (polygons) calculation.
* **Export**: Automatic cartographic layout generation and SVG/PNG vector export.

### 6. CiteShift

A smart scientific citation converter and reference manager.

* **Format Conversion**: Converts raw bibliography text (APA, Vancouver, Harvard, IEEE) into BibTeX, RIS (for Mendeley/Zotero), or APA 7th (Word).
* **Crossref Auto-Complete**: Instantly fetches missing metadata (volume, issue, pages) using DOI via the public Crossref API.
* **Auto-Italic**: Heuristic engine that automatically detects and italicizes over 60+ aquaculture/microbiology Latin names (e.g., *Penaeus monodon*, *Lactobacillus*).
* **Duplicate & Name Flipper**: Detects duplicate entries and normalizes author names to standard academic format.

### 7. ShifterAI

An AI-powered academic text formatting and structuring assistant.

* **Omni-Reader**: Extracts data directly from PDF, Word (DOCX), Excel, CSV, and FASTA files locally.
* **Academic Synthesis**: Rewrites paragraphs, fixes grammar/typos, translates to Academic English, and cleans hidden MS Word characters.
* **BYOK Architecture**: Uses Google Gemini 1.5 Flash via a secure Bring-Your-Own-Key approach stored in `localStorage` and routed through a secure proxy.

### 8. Mendeley FPIK Portal

Digital repository for the official CSL Style (Tugas Akhir FPIK 2018) of Universitas Jenderal Soedirman for instant Mendeley Cite installation.

---

## Architecture

AREs is built as a **Progressive Web Application (PWA)** using only HTML, CSS, and vanilla JavaScript — no build tools, no bundlers, no backend framework.

```text
┌─────────────────────────────────────────────────────────┐
│                      User's Browser                     │
│                                                         │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌─────────┐        │
│  │AquaLab │  │StatWise│  │GeoPlot │  │CiteShift│  ...   │
│  └────────┘  └────────┘  └────────┘  └─────────┘        │
│                                                         │
│         All computation runs here (V8 JS engine)        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Service Worker (PWA Cache v4)           │  │
│  │      Full offline support after first load        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │ (Only for specific API triggers)
         ▼
   NCBI E-Utilities / Crossref API / Gemini AI Proxy

```

---

## Getting Started

### Option 1 — Use directly (recommended)

Open in any modern browser (Chrome, Firefox, Edge, Safari):

```text
[https://dandisw.github.io/Aquaculture-Research-Ecosystem/](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)

```

### Option 2 — Install as a PWA (desktop/mobile)

1. Open the URL in Chrome or Edge.
2. Click the **"Install AREs App"** button or the install icon (⊕) in the browser address bar.
3. The platform will be installed as a standalone app and will work fully offline.

### Option 3 — Run locally (for development)

```bash
git clone [https://github.com/dandisw/Aquaculture-Research-Ecosystem.git](https://github.com/dandisw/Aquaculture-Research-Ecosystem.git)
cd Aquaculture-Research-Ecosystem

# Serve with any static file server, e.g.:
python3 -m http.server 8000

```

---

## Data Privacy

All computation in AREs is performed **locally in your browser**. Your data is never transmitted to any external server or database.

Exceptions (User-Initiated APIs):

1. **BioTools**: Entering a sequence and clicking BLAST sends the sequence to NCBI E-Utilities (`eutils.ncbi.nlm.nih.gov`).
2. **CiteShift**: Clicking the Auto-Complete (DOI) button fetches metadata from the Crossref API (`api.crossref.org`).
3. **ShifterAI**: Document extraction is done locally (via PDF.js/SheetJS). The extracted text is then sent to Google Gemini AI via a secure proxy. Your API Key is stored safely in your browser's `localStorage`.

---

## Validation & References

* **StatWise**: Validated against IBM SPSS and R CRAN (e.g., Shapiro-Wilk via Royston 1992; Levene via Brown & Forsythe 1974; ANOVA Type III SS).
* **BioTools**: MSA via Center-Star Heuristic (Notredame et al., 2000); UPGMA phylogeny (Saitou & Nei, 1987).
* **EcoMetrics**: Rapfish MDS (Pitcher & Preikshot, 2001); PCA (Jolliffe & Cadima, 2016); K-Means++ (Jain, 2010).

---

## Changelog

### New Modules (v1.0)

* **GeoPlot**: Introduced spatial mapping, GPS geolocation, and SVG cartographic export.
* **CiteShift**: Introduced smart citation converter with Crossref DOI auto-complete and 60+ genera auto-italic engine.
* **ShifterAI**: Introduced local omni-reader document extraction and Gemini AI text synthesis via BYOK proxy.

*(For detailed module-specific changelogs such as AquaLab and StatWise, refer to previous versions).*

---

## Citation

If you use AREs in your research, please cite:

```bibtex
@software{wibowo2026ares,
  author    = {Wibowo, Dandi Setio},
  title     = {AREs: A Progressive Web Application for Integrated Aquaculture
               Data Management, Statistical Computing, Spatial Mapping, and Molecular Analytics},
  year      = {2026},
  url       = {[https://dandisw.github.io/Aquaculture-Research-Ecosystem/](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)},
  note      = {Accessed: [date]}
}

```

---

## Author

**Dandi Setio Wibowo** Faculty of Fisheries and Marine Sciences (FPIK)

Universitas Jenderal Soedirman, Purwokerto, Indonesia

* Instagram: [@aquaculture.research](https://instagram.com/aquaculture.research)
* GitHub: [github.com/dandisw](https://github.com/dandisw)
* ORCID: 0009-0002-5337-499X

---

## License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).
You are free to use, copy, modify, merge, publish, distribute, and sublicense this software, provided the original copyright notice is included.
