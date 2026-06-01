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

Access to professional-grade scientific software presents a particularly acute challenge for researchers and students in low- and middle-income countries (LMICs). Commercial licenses impose substantial financial barriers, while free and open-source alternatives (e.g., R, Python) require non-trivial technical competence in programming and dependency management. Furthermore, existing web portals that provide bioinformatics or statistical utilities are entirely server-dependent. This reliance on server-side processing introduces significant data privacy concerns—especially when handling unpublished genomic sequences or proprietary experimental datasets—and renders the tools unusable in offline field settings. 

AREs addresses these critical gaps by democratizing access to high-level scientific computing. It provides a zero-infrastructure computational platform that requires no installation, server backend, or software licensing fees. 

The software consolidates essential analytical workflows into four offline-capable domains:
1. **AquaLab Workspace:** Provides structured laboratory data management, real-time water quality early warning systems, and hematological profiling.
2. **StatWise:** Delivers a comprehensive suite of inferential statistics. Its mathematical engine is validated against IBM SPSS and R CRAN, implementing robust algorithms including normality testing (Shapiro-Wilk, Kolmogorov-Smirnov with Lilliefors correction), ANOVA with GLM Type III Sum of Squares, post hoc multiple comparisons with compact letter displays [@Piepho:2004], and non-parametric tests with exact p-values for small samples [@Royston:1992].
3. **BioTools Suite:** Offers end-to-end molecular bioinformatics capable of processing FASTA-formatted inputs without server dependency. It features Smith-Waterman local alignment, Needleman-Wunsch-based Multiple Sequence Alignment (MSA) [@Notredame:2000], UPGMA phylogenetic reconstruction with Felsenstein Bootstrap [@Felsenstein:1985], ORF detection across six reading frames, and physicochemical protein analysis.
4. **EcoMetrics Multivariat:** Equips ecologists with multivariate analytical tools including Principal Component Analysis (PCA) biplots [@Jolliffe:2016], Hierarchical Clustering Analysis (UPGMA), K-Means++ clustering, Analysis of Similarities (ANOSIM) with 999-permutation testing, and Rapfish multidimensional scaling for sustainability assessments [@Pitcher:2001].

To our knowledge, AREs represents the first research software platform to combine laboratory data management, statistical analysis, molecular bioinformatics, and ecological modelling in a single, offline-capable, client-side web application specifically designed for the aquaculture research community.

# Acknowledgements

The author acknowledges the academic environment and continuous support provided by the Faculty of Fisheries and Marine Sciences (FPIK), Universitas Jenderal Soedirman, Indonesia.

# References