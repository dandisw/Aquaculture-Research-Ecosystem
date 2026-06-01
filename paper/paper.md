---
title: 'AREs: A Progressive Web Application for Integrated Aquaculture Data Management, Statistical Computing, and Molecular Analytics'
tags:
  - JavaScript
  - aquaculture
  - bioinformatics
  - statistical computing
  - multivariate analysis
  - progressive web app
authors:
  - name: Dandi Setio Wibowo
    orcid: 0009-0002-5337-499X
    affiliation: 1
affiliations:
 - name: Faculty of Fisheries and Marine Sciences, Universitas Jenderal Soedirman, Indonesia
   index: 1
date: 1 June 2026
bibliography: paper.bib
---

# Summary

The Aquaculture Research Ecosystem (AREs) is an open-source, browser-based scientific computing platform designed to address the fragmented and resource-intensive tooling landscape currently faced by aquaculture and fisheries researchers. Built entirely as a Progressive Web Application (PWA), AREs integrates four specialized modules within a single, unified, serverless architecture: **AquaLab Workspace** (laboratory data management and *in vivo* performance analytics), **StatWise** (inferential statistical computing), **BioTools Suite** (molecular bioinformatics), and **EcoMetrics Multivariat** (multivariate ecological analysis). By executing all computational operations—from matrix algebra to genomic sequence alignment—entirely client-side in the user's web browser using pure JavaScript, AREs ensures the strict privacy and security of sensitive experimental data. Furthermore, the platform supports full offline functionality via Service Worker caching, making it highly operable in field research environments, such as coastal hatcheries and remote sampling stations, where internet connectivity is limited or unstable.

# Statement of Need

Contemporary aquaculture and fisheries research routinely requires access to a diverse array of specialized software tools. Statistical analyses are typically performed in commercial platforms like IBM SPSS or environments like R; phylogenetic and sequence analyses rely on MEGA or NCBI web utilities; and multivariate ecological analyses depend on software such as PRIMER-e or RAPFISH. This fragmentation creates a discontinuous research workflow wherein data must be repeatedly exported, reformatted, and transferred between disparate applications, posing risks of data loss and version incompatibility.

Access to professional-grade scientific software presents a particularly acute challenge for researchers and students in low- and middle-income countries (LMICs). Commercial licenses impose substantial financial barriers, while free and open-source alternatives require non-trivial technical competence in programming and dependency management. Furthermore, existing web portals that provide bioinformatics or statistical utilities are entirely server-dependent. This reliance on server-side processing introduces significant data privacy concerns—especially when handling unpublished genomic sequences or proprietary experimental datasets—and renders the tools unusable in offline field settings. 

AREs addresses these critical gaps by democratizing access to high-level scientific computing. It provides a zero-infrastructure computational platform that requires no installation, server backend, or software licensing fees. 

# State of the Field

While several web-based scientific tools exist, they generally serve isolated domains and rely heavily on server-side processing. Statistical portals offer basic inferential procedures but lack integration with biological datasets. Bioinformatics platforms are robust but entirely server-dependent, preventing their use in offline field environments. Domain-specific ecological tools often require legacy software environments. AREs distinguishes itself by unifying these fragmented analytical utilities into a single, offline-capable ecosystem without requiring external computing infrastructure.

# Software Architecture & Algorithmic Implementations

AREs is engineered as a pure Progressive Web Application (PWA). The system operates through a client-side execution engine where all algorithms run entirely within the browser's JavaScript sandbox, guaranteeing data privacy. To ensure computational accuracy, AREs implements standard scientific algorithms across its four modules:

**1. AquaLab Workspace (In Vivo Analytics):**
Calculates standardized growth metrics from biomass data. For instance, the Specific Growth Rate (SGR) is computed as:

$$SGR=\left(\frac{\ln(W_t)-\ln(W_0)}{t}\right)\times100$$

where $W_t$ is the final weight, $W_0$ is the initial weight, and $t$ is the culture period in days [@Lugert:2016].

**2. StatWise (Statistical Computing):**
Executes comprehensive inferential statistics with algorithms validated against R CRAN. For robust variance homogeneity testing against outliers, it utilizes the median-based Levene's test [@Brown:1974]:

$$W=\frac{(N-k)}{(k-1)}\frac{\sum_{i=1}^k N_i(\bar{Z}_{i\cdot}-\bar{Z}_{\cdot\cdot})^2}{\sum_{i=1}^k\sum_{j=1}^{N_i}(Z_{ij}-\bar{Z}_{i\cdot})^2}$$

where $Z_{ij}=|Y_{ij}-\tilde{Y}_{i\cdot}|$ and $\tilde{Y}_{i\cdot}$ is the group median.

**3. BioTools Suite (Molecular Bioinformatics):**
Provides offline genomic capabilities including in-silico primer design. The melting temperature ($T_m$) for sequence primers is calculated using nearest-neighbor thermodynamics [@SantaLucia:1998]:

$$T_m=\frac{\Delta H^{\circ}}{\Delta S^{\circ}+R\ln(C)}-273.15$$

where $\Delta H^{\circ}$ and $\Delta S^{\circ}$ are enthalpy and entropy, $R$ is the gas constant, and $C$ is the oligonucleotide concentration.

**4. EcoMetrics Multivariat (Ecological Analysis):**
Facilitates unsupervised machine learning for spatial aquaculture data, such as K-Means++ clustering. The algorithm minimizes the Within-Cluster Sum of Squares (WCSS) [@Jain:2010]:

$$WCSS=\sum_{j=1}^{k}\sum_{x_i\in C_j}||x_i-\mu_j||^2$$

where $k$ is the number of clusters, $x_i$ is a data point in cluster $C_j$, and $\mu_j$ is the cluster centroid.

By leveraging these robust computational foundations within a modern web API framework, AREs empowers fisheries and biology researchers to process multidimensional data securely, reproducibly, and efficiently.

# AI Usage Disclosure

Generative AI tools, specifically Google Gemini and Anthropic Claude, were utilized during the development of AREs to assist with code generation, algorithmic debugging, and UI/UX component structuring. All AI-generated mathematical functions and algorithms were rigorously reviewed, tested, and validated against standard scientific software outputs (e.g., IBM SPSS and R) by the author prior to implementation.

# Acknowledgements

The author acknowledges the academic environment and continuous support provided by the Faculty of Fisheries and Marine Sciences (FPIK), Universitas Jenderal Soedirman, Indonesia.

# References
