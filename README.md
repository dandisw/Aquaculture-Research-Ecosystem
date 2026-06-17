# Aquaculture Research Ecosystem (AREs)

> A Progressive Web Application for integrated aquaculture data management, statistical computing, molecular bioinformatics, multivariate ecological analysis, spatial mapping, and AI-assisted manuscript drafting — running entirely in your browser, with no server required.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-orange?style=flat-square)](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)
[![Platform](https://img.shields.io/badge/Platform-Browser%20(No%20Install)-lightgrey?style=flat-square)]()
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)

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
- [Contributing & Testing](#contributing--testing)
- [Issues & Support](#issues--support)
- [Citation](#citation)
- [Author](#author)

---

## Overview

**AREs (Aquaculture Research Ecosystem)** is an open-source, browser-based scientific computing platform built specifically for aquaculture and fisheries researchers. It integrates **eight specialized modules** — spanning laboratory analytics, validated statistics, molecular bioinformatics, multivariate ecology, spatial mapping, citation management, and AI-assisted writing — into a single, unified interface that works completely offline — no installation, no server backend, no licensing fees.

All calculations are executed client-side using pure JavaScript, meaning your experimental data and genomic sequences **never leave your device**.

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
| **Zero server dependency** | All computation runs in the browser (pure JavaScript) |
| **Privacy-preserving** | No data is transmitted to external servers (except voluntary API queries) |
| **Cross-platform** | Works on desktop, tablet, and mobile browsers |
| **No installation** | Open the URL and start working immediately |
| **Local File Support** | Directly upload and parse local files (.fasta, .csv, .txt) client-side |
| **SPSS/R parity** | Statistical outputs validated against IBM SPSS and R CRAN |
| **AI Integration** | Bring-Your-Own-Key (BYOK) architecture for Google Gemini AI via ShifterAI |
| **Export-ready** | Export results to CSV, PDF, BibTeX, RIS, SVG, and SPSS-compatible formats |

---

## Modules

*(Bagian penjelasan modul 1, 2, 4, 5, 6, 7, dan 8 dibiarkan sama persis seperti draf asli Anda karena sudah sempurna. Berikut adalah pembaruan pada bagian BioTools)*

### 3. BioTools Suite

An end-to-end molecular bioinformatics toolkit that processes standard FASTA-formatted sequences entirely client-side.

> **Privacy note**: All sequence analysis is performed locally in your browser. Sequences are **never uploaded to any server**. The sole exception is the NCBI BLAST module, which communicates with NCBI E-Utilities as required for database search.

**Local File Integration**: Features a universal file uploader supporting `.fasta`, `.fa`, `.seq`, and `.txt` files with an 8MB client-side memory safety limit to prevent browser crashes when handling genomic datasets.

*(Fitur BLAST, Manipulasi, Pairwise, MSA, Protein, ORF, Digest, Primer dibiarkan sama... tambahkan SSR di bawah ini)*

#### Microsatellite (SSR) Finder

* Identifies Simple Sequence Repeats (mono- to hexa-nucleotide) in genomic sequences
* Evaluates canonical motifs to eliminate redundant reverse-complement counting
* Outputs density statistics, interactive distribution charts (pie, histogram, and genomic position map), and automatic flanking sequence extraction for primer design.

> References: Thiel et al. (2003). *Theoretical and Applied Genetics*, 106(3), 411–422; Kang et al. (2016). *Bioinformatics*, 32(21), 3412–3414.

---

*(Bagian Architecture, Getting Started, Data Privacy, Validation dibiarkan sama)*

## Changelog

*(Ubah tabel changelog BioTools menjadi seperti ini)*

### BioTools Suite

| Version | Changes |
| --- | --- |
| v8.2 (current) | **Final Architecture & SSR Expansion**: Introduced the Microsatellite (SSR) Finder inspired by KRAIT/MISA. Implemented a universal Local File Uploader (Max 8MB safety limit) across all modules. Enhanced Phylogenetic PNG export to use absolute ViewBox dimensions to prevent species name clipping. Restored full UPGMA and Felsenstein Bootstrap pipeline functionalities. |
| v6.0 | Physicochemical Protein Analysis (ProtParam equivalent): MW, pI, amino acid composition; UI standardization |
| v5.0 | Copy-to-Word with HTML color preservation; custom SVG tree palette (line color, font style, italic); zoom up to 300% |
| v4.0 | Center-Star Heuristic MSA; Felsenstein Non-parametric Bootstrap (up to 1,000 iterations) |
| v1.0–v3.0 | Client-side architecture; Smith-Waterman alignment; NEB Restriction Mapper; auto primer design |

---

## Citation

If you use AREs in your research, please cite:

```bibtex
@software{wibowo2026ares,
  author    = {Wibowo, Dandi Setio},
  title     = {AREs: A Progressive Web Application for Integrated Aquaculture
               Data Management, Statistical Computing, Spatial Mapping,
               and Molecular Analytics},
  year      = {2026},
  doi       = {10.5281/zenodo.XXXXXXX},
  url       = {[https://dandisw.github.io/Aquaculture-Research-Ecosystem/](https://dandisw.github.io/Aquaculture-Research-Ecosystem/)},
  note      = {Accessed: [date]}
}

```

> A peer-reviewed manuscript describing the platform architecture and validation is currently under preparation for submission to *SoftwareX* (Elsevier).

---

## Author

**Dandi Setio Wibowo** Faculty of Fisheries and Marine Sciences (FPIK)

Universitas Jenderal Soedirman, Purwokerto, Indonesia

* Instagram: [@aquaculture.research](https://instagram.com/aquaculture.research)
* GitHub: [github.com/dandisw](https://github.com/dandisw)
* ORCID: [0009-0002-5337-499X](https://orcid.org/0009-0002-5337-499X)

---

## License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).

---
