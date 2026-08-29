/**
 * AREs BioTools - 3D Protein & Macromolecule Visualizer (Mol3D Engine)
 * Render interaktif 3D struktur protein format PDB / CIF
 * Dilengkapi dengan 3Dmol WebGL Renderer & Fallback 3D Canvas
 */

// ===================================================================
// SAMPLE PDB EMBEDDED DATA (1CRN - Crambin Plant Protein)
// ===================================================================
const PDB_SAMPLE_1CRN = `HEADER    PLANT SEED PROTEIN                      30-APR-81   1CRN              
TITLE     WATER STRUCTURE OF A HYDROPHOBIC PROTEIN AT ATOMIC RESOLUTION.        
TITLE    2 PENTANE-BASED REFINEMENT OF CRAMBIN AT 0.83 ANGSTROMS                
COMPND    MOL_ID: 1;                                                            
COMPND   2 MOLECULE: CRAMBIN;                                                   
COMPND   3 CHAIN: A;                                                            
COMPND   4 ENGINEERED: NO                                                       
SOURCE    MOL_ID: 1;                                                            
SOURCE   2 ORGANISM_SCIENTIFIC: ABYSSINIAN CABBAGE;                             
SOURCE   3 ORGANISM_COMMON: CRAMBE ABYSSINICA;                                 
SOURCE   4 ORGANISM_TAXID: 3721;                                                
SOURCE   5 TISSUE: SEED                                                         
EXPDTA    X-RAY DIFFRACTION                                                     
REMARK   2 RESOLUTION.    0.83 ANGSTROMS.                                       
HELIX    1   1 THR A    7  GLY A   19  1                                  13    
HELIX    2   2 GLU A   23  THR A   30  1                                   8    
SHEET    1  A 2 VAL A   1  CYS A   4  0                                         
SHEET    2  A 2 ILE A  32  CYS A  35 -1  N  CYS A  35   O  THR A   2           
ATOM      1  N   THR A   1      17.047  14.099   3.625  1.00 13.79           N  
ATOM      2  CA  THR A   1      16.967  12.784   4.338  1.00 10.80           C  
ATOM      3  C   THR A   1      15.685  12.755   5.133  1.00  9.19           C  
ATOM      4  O   THR A   1      15.268  13.825   5.594  1.00  9.85           O  
ATOM      5  CB  THR A   1      18.170  12.703   5.337  1.00 13.02           C  
ATOM      6  OG1 THR A   1      19.334  12.829   4.463  1.00 15.06           O  
ATOM      7  CG2 THR A   1      18.156  11.379   6.045  1.00 13.78           C  
ATOM      8  N   THR A   2      15.115  11.555   5.265  1.00  7.81           N  
ATOM      9  CA  THR A   2      13.856  11.469   6.066  1.00  7.51           C  
ATOM     10  C   THR A   2      14.164  10.785   7.379  1.00  6.11           C  
ATOM     11  O   THR A   2      14.993   9.862   7.443  1.00  6.86           O  
ATOM     12  CB  THR A   2      12.732  10.708   5.261  1.00  8.83           C  
ATOM     13  OG1 THR A   2      12.443  11.458   4.059  1.00  8.89           O  
ATOM     14  CG2 THR A   2      11.464  10.573   6.104  1.00 10.54           C  
ATOM     15  N   CYS A   3      13.488  11.241   8.417  1.00  6.00           N  
ATOM     16  CA  CYS A   3      13.660  10.707   9.753  1.00  6.44           C  
ATOM     17  C   CYS A   3      12.269  10.431  10.370  1.00  6.46           C  
ATOM     18  O   CYS A   3      11.370  11.272  10.279  1.00  7.45           O  
ATOM     19  CB  CYS A   3      14.401  11.758  10.603  1.00  7.53           C  
ATOM     20  SG  CYS A   3      14.492  11.332  12.356  1.00  9.62           S  
ATOM     21  N   CYS A   4      12.115   9.257  10.970  1.00  6.55           N  
ATOM     22  CA  CYS A   4      10.837   8.826  11.530  1.00  7.12           C  
ATOM     23  C   CYS A   4      10.908   8.846  13.064  1.00  7.09           C  
ATOM     24  O   CYS A   4      11.954   8.547  13.655  1.00  7.68           O  
ATOM     25  CB  CYS A   4      10.457   7.442  11.026  1.00  8.79           C  
ATOM     26  SG  CYS A   4       8.802   6.917  11.583  1.00 10.02           S  
ATOM     27  N   PRO A   5       9.813   9.186  13.727  1.00  7.55           N  
ATOM     28  CA  PRO A   5       9.827   9.197  15.201  1.00  8.36           C  
ATOM     29  C   PRO A   5       9.610   7.781  15.719  1.00  8.36           C  
ATOM     30  O   PRO A   5       8.820   7.014  15.176  1.00  8.94           O  
ATOM     31  CB  PRO A   5       8.653  10.089  15.549  1.00 10.37           C  
ATOM     32  CG  PRO A   5       7.712  10.046  14.341  1.00 11.23           C  
ATOM     33  CD  PRO A   5       8.563   9.722  13.125  1.00  9.13           C  
ATOM     34  N   SER A   6      10.315   7.423  16.786  1.00  8.76           N  
ATOM     35  CA  SER A   6      10.147   6.115  17.411  1.00  9.68           C  
ATOM     36  C   SER A   6       8.775   6.046  18.069  1.00  9.50           C  
ATOM     37  O   SER A   6       8.243   7.087  18.471  1.00 10.87           O  
ATOM     38  CB  SER A   6      11.233   5.945  18.477  1.00 10.99           C  
ATOM     39  OG  SER A   6      10.874   6.666  19.646  1.00 15.65           O  
ATOM     40  N   ILE A   7       8.214   4.842  18.172  1.00  8.85           N  
ATOM     41  CA  ILE A   7       6.903   4.636  18.779  1.00  8.91           C  
ATOM     42  C   ILE A   7       6.974   3.385  19.664  1.00  8.91           C  
ATOM     43  O   ILE A   7       7.801   2.492  19.467  1.00  9.74           O  
ATOM     44  CB  ILE A   7       5.795   4.551  17.702  1.00  9.70           C  
ATOM     45  CG1 ILE A   7       5.617   5.938  17.065  1.00 10.74           C  
ATOM     46  CG2 ILE A   7       4.492   4.041  18.322  1.00 11.29           C  
ATOM     47  CD1 ILE A   7       4.673   5.962  15.867  1.00 14.73           C  
ATOM     48  N   VAL A   8       6.103   3.332  20.662  1.00  8.49           N  
ATOM     49  CA  VAL A   8       5.992   2.203  21.583  1.00  8.88           C  
ATOM     50  C   VAL A   8       4.647   2.274  22.316  1.00  9.08           C  
ATOM     51  O   VAL A   8       3.738   3.023  21.944  1.00  9.68           O  
ATOM     52  CB  VAL A   8       6.103   0.814  20.912  1.00  9.25           C  
ATOM     53  CG1 VAL A   8       6.002  -0.297  21.968  1.00 10.23           C  
ATOM     54  CG2 VAL A   8       7.411   0.725  20.125  1.00  9.88           C  
ATOM     55  N   ALA A   9       4.520   1.488  23.369  1.00  9.24           N  
ATOM     56  CA  ALA A   9       3.262   1.472  24.137  1.00  9.99           C  
ATOM     57  C   ALA A   9       3.298   0.370  25.201  1.00  9.69           C  
ATOM     58  O   ALA A   9       4.270  -0.380  25.281  1.00 10.15           O  
ATOM     59  CB  ALA A   9       3.064   2.827  24.789  1.00 11.75           C  
ATOM     60  N   ARG A  10       2.222   0.288  25.993  1.00  9.94           N  
ATOM     61  CA  ARG A  10       2.110  -0.697  27.069  1.00 11.16           C  
ATOM     62  C   ARG A  10       0.999  -0.320  28.053  1.00 10.60           C  
ATOM     63  O   ARG A  10      -0.082   0.141  27.674  1.00 10.87           O  
ATOM     64  CB  ARG A  10       1.859  -2.100  26.505  1.00 13.06           C  
ATOM     65  CG  ARG A  10       3.048  -2.698  25.753  1.00 17.65           C  
ATOM     66  CD  ARG A  10       2.668  -3.993  25.044  1.00 23.30           C  
ATOM     67  NE  ARG A  10       3.797  -4.634  24.364  1.00 30.64           N  
ATOM     68  CZ  ARG A  10       3.985  -5.952  24.237  1.00 35.80           C  
ATOM     69  NH1 ARG A  10       3.109  -6.804  24.757  1.00 36.31           N  
ATOM     70  NH2 ARG A  10       5.048  -6.422  23.578  1.00 39.81           N  
ATOM     71  N   SER A  11       1.272  -0.518  29.336  1.00 10.49           N  
ATOM     72  CA  SER A  11       0.264  -0.218  30.347  1.00 10.96           C  
ATOM     73  C   SER A  11      -0.902  -1.200  30.297  1.00 10.45           C  
ATOM     74  O   SER A  11      -0.707  -2.399  30.495  1.00 10.74           O  
ATOM     75  CB  SER A  11       0.893  -0.274  31.748  1.00 12.87           C  
ATOM     76  OG  SER A  11       1.353   1.016  32.100  1.00 17.58           O  
ATOM     77  N   ASN A  12      -2.109  -0.697  30.016  1.00 10.15           N  
ATOM     78  CA  ASN A  12      -3.298  -1.547  29.939  1.00 10.76           C  
ATOM     79  C   ASN A  12      -4.249  -1.127  31.066  1.00 10.68           C  
ATOM     80  O   ASN A  12      -4.482   0.063  31.309  1.00 10.74           O  
ATOM     81  CB  ASN A  12      -3.990  -1.428  28.583  1.00 12.02           C  
ATOM     82  CG  ASN A  12      -3.153  -1.996  27.460  1.00 13.91           C  
ATOM     83  OD1 ASN A  12      -2.730  -3.153  27.533  1.00 16.48           O  
ATOM     84  ND2 ASN A  12      -2.910  -1.196  26.425  1.00 15.68           N  
ATOM     85  N   PHE A  13      -4.786  -2.112  31.765  1.00 10.59           N  
ATOM     86  CA  PHE A  13      -5.696  -1.859  32.880  1.00 10.96           C  
ATOM     87  C   PHE A  13      -6.840  -0.963  32.428  1.00 10.66           C  
ATOM     88  O   PHE A  13      -6.902  -0.457  31.305  1.00 10.87           O  
ATOM     89  CB  PHE A  13      -4.957  -1.246  34.084  1.00 12.28           C  
ATOM     90  CG  PHE A  13      -3.955  -2.179  34.707  1.00 13.79           C  
ATOM     91  CD1 PHE A  13      -4.349  -3.418  35.210  1.00 15.93           C  
ATOM     92  CD2 PHE A  13      -2.610  -1.815  34.793  1.00 16.29           C  
ATOM     93  CE1 PHE A  13      -3.418  -4.281  35.787  1.00 18.23           C  
ATOM     94  CE2 PHE A  13      -1.670  -2.671  35.367  1.00 18.39           C  
ATOM     95  CZ  PHE A  13      -2.079  -3.909  35.867  1.00 18.22           C  
ATOM     96  N   ASN A  14      -7.755  -0.785  33.376  1.00 10.23           N  
ATOM     97  CA  ASN A  14      -8.889   0.068  33.090  1.00 10.42           C  
ATOM     98  C   ASN A  14      -9.923  -0.741  32.327  1.00  9.74           C  
ATOM     99  O   ASN A  14     -10.446  -1.704  32.880  1.00 10.49           O  
ATOM    100  CB  ASN A  14      -9.527   0.627  34.372  1.00 11.75           C  
ATOM    101  CG  ASN A  14      -8.549   1.503  35.127  1.00 13.77           C  
ATOM    102  OD1 ASN A  14      -7.447   1.767  34.662  1.00 15.95           O  
ATOM    103  ND2 ASN A  14      -8.956   1.956  36.307  1.00 15.98           N  
ATOM    104  N   CYS A  15     -10.203  -0.344  31.082  1.00  8.94           N  
ATOM    105  CA  CYS A  15     -11.196  -1.045  30.274  1.00  8.49           C  
ATOM    106  C   CYS A  15     -12.441  -0.180  30.125  1.00  8.30           C  
ATOM    107  O   CYS A  15     -12.383   1.048  30.089  1.00  9.07           O  
ATOM    108  CB  CYS A  15     -10.667  -1.442  28.892  1.00  9.05           C  
ATOM    109  SG  CYS A  15      -9.148  -2.433  28.971  1.00 10.70           S  
ATOM    110  N   ARG A  16     -13.578  -0.867  30.046  1.00  7.76           N  
ATOM    111  CA  ARG A  16     -14.862  -0.218  29.845  1.00  7.73           C  
ATOM    112  C   ARG A  16     -15.651   0.009  31.135  1.00  8.00           C  
ATOM    113  O   ARG A  16     -16.143   1.116  31.393  1.00  9.01           O  
ATOM    114  CB  ARG A  16     -15.688  -1.106  28.916  1.00  8.76           C  
ATOM    115  CG  ARG A  16     -15.111  -1.306  27.525  1.00 10.37           C  
ATOM    116  CD  ARG A  16     -16.030  -2.221  26.742  1.00 12.87           C  
ATOM    117  NE  ARG A  16     -15.420  -2.696  25.498  1.00 15.66           N  
ATOM    118  CZ  ARG A  16     -15.999  -3.593  24.708  1.00 18.07           C  
ATOM    119  NH1 ARG A  16     -17.214  -4.097  24.996  1.00 19.82           N  
ATOM    120  NH2 ARG A  16     -15.352  -4.004  23.619  1.00 19.34           N  
ATOM    121  N   TYR A  17     -15.751  -1.049  31.947  1.00  7.91           N  
ATOM    122  CA  TYR A  17     -16.502  -1.011  33.203  1.00  8.30           C  
ATOM    123  C   TYR A  17     -15.867   0.003  34.156  1.00  8.60           C  
ATOM    124  O   TYR A  17     -16.549   0.884  34.678  1.00  9.74           O  
ATOM    125  CB  TYR A  17     -16.544  -2.399  33.864  1.00  9.08           C  
ATOM    126  CG  TYR A  17     -17.485  -2.457  35.045  1.00 10.42           C  
ATOM    127  CD1 TYR A  17     -18.847  -2.203  34.887  1.00 11.53           C  
ATOM    128  CD2 TYR A  17     -17.022  -2.730  36.326  1.00 11.41           C  
ATOM    129  CE1 TYR A  17     -19.722  -2.223  35.974  1.00 12.87           C  
ATOM    130  CE2 TYR A  17     -17.886  -2.757  37.425  1.00 12.75           C  
ATOM    131  CZ  TYR A  17     -19.231  -2.502  37.240  1.00 13.06           C  
ATOM    132  OH  TYR A  17     -20.089  -2.527  38.318  1.00 15.65           O  
ATOM    133  N   ASN A  18     -14.545   0.016  34.331  1.00  8.28           N  
ATOM    134  CA  ASN A  18     -13.824   0.942  35.201  1.00  8.70           C  
ATOM    135  C   ASN A  18     -14.072   2.395  34.789  1.00  8.94           C  
ATOM    136  O   ASN A  18     -14.195   3.279  35.642  1.00 10.16           O  
ATOM    137  CB  ASN A  18     -12.333   0.601  35.186  1.00  9.74           C  
ATOM    138  CG  ASN A  18     -11.977  -0.655  35.961  1.00 10.74           C  
ATOM    139  OD1 ASN A  18     -12.766  -1.205  36.729  1.00 12.75           O  
ATOM    140  ND2 ASN A  18     -10.771  -1.121  35.736  1.00 11.85           N  
ATOM    141  N   GLY A  19     -14.162   2.641  33.486  1.00  8.79           N  
ATOM    142  CA  GLY A  19     -14.394   3.992  32.990  1.00  9.25           C  
ATOM    143  C   GLY A  19     -15.753   4.568  33.360  1.00  9.50           C  
ATOM    144  O   GLY A  19     -15.864   5.734  33.738  1.00 10.66           O  
ATOM    145  N   ALA A  20     -16.797   3.748  33.249  1.00  9.42           N  
ATOM    146  CA  ALA A  20     -18.158   4.179  33.568  1.00  9.99           C  
ATOM    147  C   ALA A  20     -18.423   4.258  35.074  1.00 10.48           C  
ATOM    148  O   ALA A  20     -19.167   5.127  35.539  1.00 11.77           O  
ATOM    149  CB  ALA A  20     -19.164   3.218  32.928  1.00 11.23           C  
ATOM    150  N   THR A  21     -17.785   3.368  35.836  1.00 10.37           N  
ATOM    151  CA  THR A  21     -17.962   3.332  37.288  1.00 11.08           C  
ATOM    152  C   THR A  21     -17.151   4.425  37.979  1.00 11.53           C  
ATOM    153  O   THR A  21     -17.485   4.869  39.080  1.00 12.98           O  
ATOM    154  CB  THR A  21     -17.587   1.954  37.863  1.00 11.78           C  
ATOM    155  OG1 THR A  21     -18.490   0.985  37.332  1.00 13.06           O  
ATOM    156  CG2 THR A  21     -17.653   1.989  39.385  1.00 13.26           C  
ATOM    157  N   ALA A  22     -16.096   4.866  37.306  1.00 11.16           N  
ATOM    158  CA  ALA A  22     -15.228   5.918  37.828  1.00 11.60           C  
ATOM    159  C   ALA A  22     -15.867   7.297  37.701  1.00 11.84           C  
ATOM    160  O   ALA A  22     -15.654   8.172  38.544  1.00 12.87           O  
ATOM    161  CB  ALA A  22     -13.882   5.885  37.106  1.00 12.75           C  
ATOM    162  N   GLU A  23     -16.666   7.486  36.650  1.00 11.75           N  
ATOM    163  CA  GLU A  23     -17.340   8.751  36.398  1.00 12.28           C  
ATOM    164  C   GLU A  23     -18.486   8.948  37.391  1.00 12.75           C  
ATOM    165  O   GLU A  23     -18.730  10.076  37.829  1.00 13.79           O  
ATOM    166  CB  GLU A  23     -17.844   8.826  34.954  1.00 12.87           C  
ATOM    167  CG  GLU A  23     -18.705  10.046  34.629  1.00 14.59           C  
ATOM    168  CD  GLU A  23     -19.167  10.089  33.181  1.00 17.65           C  
ATOM    169  OE1 GLU A  23     -18.358  10.518  32.327  1.00 19.82           O  
ATOM    170  OE2 GLU A  23     -20.329   9.673  32.894  1.00 20.34           O  
ATOM    171  N   CYS A  24     -19.176   7.876  37.766  1.00 12.75           N  
ATOM    172  CA  CYS A  24     -20.297   7.935  38.703  1.00 13.26           C  
ATOM    173  C   CYS A  24     -19.789   8.349  40.082  1.00 13.48           C  
ATOM    174  O   CYS A  24     -20.444   9.147  40.751  1.00 14.73           O  
ATOM    175  CB  CYS A  24     -21.378   6.864  38.673  1.00 13.79           C  
ATOM    176  SG  CYS A  24     -22.183   6.680  37.070  1.00 15.65           S  
ATOM    177  N   PRO A  25     -18.636   7.807  40.528  1.00 13.26           N  
ATOM    178  CA  PRO A  25     -18.064   8.118  41.839  1.00 13.79           C  
ATOM    179  C   PRO A  25     -17.387   9.479  41.794  1.00 13.79           C  
ATOM    180  O   PRO A  25     -17.587  10.287  42.709  1.00 15.06           O  
ATOM    181  CB  PRO A  25     -17.069   6.994  42.146  1.00 14.59           C  
ATOM    182  CG  PRO A  25     -17.433   5.992  41.111  1.00 14.73           C  
ATOM    183  CD  PRO A  25     -18.083   6.828  40.046  1.00 13.79           C  
ATOM    184  N   THR A  26     -16.591   9.728  40.751  1.00 13.26           N  
ATOM    185  CA  THR A  26     -15.897  11.006  40.603  1.00 13.79           C  
ATOM    186  C   THR A  26     -16.764  12.181  41.059  1.00 14.15           C  
ATOM    187  O   THR A  26     -16.326  13.330  41.045  1.00 15.35           O  
ATOM    188  CB  THR A  26     -14.580  10.999  41.401  1.00 14.59           C  
ATOM    189  OG1 THR A  26     -13.821   9.851  40.994  1.00 15.65           O  
ATOM    190  CG2 THR A  26     -13.774  12.269  41.168  1.00 15.93           C  
ATOM    191  N   MET A  27     -17.986  11.890  41.492  1.00 14.15           N  
ATOM    192  CA  MET A  27     -18.916  12.923  41.947  1.00 14.73           C  
ATOM    193  C   MET A  27     -19.673  13.488  40.751  1.00 14.73           C  
ATOM    194  O   MET A  27     -19.824  14.708  40.613  1.00 16.29           O  
ATOM    195  CB  MET A  27     -19.897  12.355  42.981  1.00 15.65           C  
ATOM    196  CG  MET A  27     -19.261  11.890  44.290  1.00 17.65           C  
ATOM    197  SD  MET A  27     -20.477  11.160  45.412  1.00 21.05           S  
ATOM    198  CE  MET A  27     -21.579  12.532  45.698  1.00 22.15           C  
ATOM    199  N   CYS A  28     -20.147  12.607  39.880  1.00 14.15           N  
ATOM    200  CA  CYS A  28     -20.890  13.023  38.703  1.00 14.15           C  
ATOM    201  C   CYS A  28     -19.988  13.882  37.828  1.00 13.79           C  
ATOM    202  O   CYS A  28     -20.444  14.887  37.288  1.00 15.06           O  
ATOM    203  CB  CYS A  28     -21.464  11.794  37.994  1.00 14.73           C  
ATOM    204  SG  CYS A  28     -22.756  10.942  38.948  1.00 16.82           S  
ATOM    205  N   ILE A  29     -18.718  13.504  37.697  1.00 13.06           N  
ATOM    206  CA  ILE A  29     -17.766  14.240  36.883  1.00 12.87           C  
ATOM    207  C   ILE A  29     -17.487  15.617  37.489  1.00 13.06           C  
ATOM    208  O   ILE A  29     -17.502  16.638  36.796  1.00 14.15           O  
ATOM    209  CB  ILE A  29     -16.444  13.447  36.697  1.00 13.06           C  
ATOM    210  CG1 ILE A  29     -16.717  12.146  35.939  1.00 13.79           C  
ATOM    211  CG2 ILE A  29     -15.420  14.305  35.974  1.00 13.79           C  
ATOM    212  CD1 ILE A  29     -15.510  11.232  35.828  1.00 15.65           C  
ATOM    213  N   THR A  30     -17.234  15.642  38.796  1.00 12.87           N  
ATOM    214  CA  THR A  30     -16.949  16.902  39.467  1.00 13.26           C  
ATOM    215  C   THR A  30     -18.170  17.818  39.431  1.00 13.79           C  
ATOM    216  O   THR A  30     -18.067  19.040  39.539  1.00 15.06           O  
ATOM    217  CB  THR A  30     -16.505  16.657  40.925  1.00 13.79           C  
ATOM    218  OG1 THR A  30     -15.352  15.823  40.912  1.00 14.73           O  
ATOM    219  CG2 THR A  30     -16.208  17.971  41.636  1.00 14.73           C  
ATOM    220  N   PRO A  31     -19.349  17.227  39.277  1.00 13.79           N  
ATOM    221  CA  PRO A  31     -20.573  18.016  39.227  1.00 14.59           C  
ATOM    222  C   PRO A  31     -20.678  18.892  37.979  1.00 14.59           C  
ATOM    223  O   PRO A  31     -21.222  20.000  38.037  1.00 16.29           O  
ATOM    224  CB  PRO A  31     -21.688  16.971  39.256  1.00 15.65           C  
ATOM    225  CG  PRO A  31     -21.009  15.772  39.845  1.00 15.65           C  
ATOM    226  CD  PRO A  31     -19.641  15.823  39.208  1.00 14.59           C  
ATOM    227  N   ILE A  32     -20.147  18.384  36.862  1.00 13.79           N  
ATOM    228  CA  ILE A  32     -20.183  19.127  35.603  1.00 13.79           C  
ATOM    229  C   ILE A  32     -19.176  20.274  35.617  1.00 13.79           C  
ATOM    230  O   ILE A  32     -19.467  21.365  35.127  1.00 15.06           O  
ATOM    231  CB  ILE A  32     -19.907  18.192  34.408  1.00 14.15           C  
ATOM    232  CG1 ILE A  32     -21.059  17.188  34.301  1.00 15.06           C  
ATOM    233  CG2 ILE A  32     -19.742  18.995  33.125  1.00 15.06           C  
ATOM    234  CD1 ILE A  32     -20.910  16.216  33.150  1.00 17.65           C  
ATOM    235  N   SER A  33     -17.994  20.021  36.183  1.00 13.26           N  
ATOM    236  CA  SER A  33     -16.953  21.040  36.260  1.00 13.26           C  
ATOM    237  C   SER A  33     -17.433  22.259  37.045  1.00 13.79           C  
ATOM    238  O   SER A  33     -17.140  23.411  36.711  1.00 15.06           O  
ATOM    239  CB  SER A  33     -15.688  20.472  36.903  1.00 13.79           C  
ATOM    240  OG  SER A  33     -15.228  19.387  36.111  1.00 14.73           O  
ATOM    241  N   ALA A  34     -18.181  22.012  38.118  1.00 13.79           N  
ATOM    242  CA  ALA A  34     -18.706  23.102  38.932  1.00 14.15           C  
ATOM    243  C   ALA A  34     -19.868  23.804  38.228  1.00 14.59           C  
ATOM    244  O   ALA A  34     -19.882  25.034  38.140  1.00 16.29           O  
ATOM    245  CB  ALA A  34     -19.147  22.585  40.300  1.00 14.73           C  
ATOM    246  N   CYS A  35     -20.841  23.018  37.740  1.00 14.59           N  
ATOM    247  CA  CYS A  35     -22.012  23.578  37.070  1.00 15.06           C  
ATOM    248  C   CYS A  35     -21.688  24.368  35.807  1.00 15.06           C  
ATOM    249  O   CYS A  35     -22.378  25.334  35.485  1.00 16.82           O  
ATOM    250  CB  CYS A  35     -23.037  22.484  36.758  1.00 15.65           C  
ATOM    251  SG  CYS A  35     -23.708  21.696  38.236  1.00 17.65           S  
ATOM    252  N   ASP A  36     -20.638  23.948  35.101  1.00 14.59           N  
ATOM    253  CA  ASP A  36     -20.219  24.620  33.876  1.00 14.73           C  
ATOM    254  C   ASP A  36     -19.468  25.918  34.195  1.00 14.59           C  
ATOM    255  O   ASP A  36     -19.789  26.974  33.649  1.00 16.29           O  
ATOM    256  CB  ASP A  36     -19.340  23.680  33.047  1.00 15.35           C  
ATOM    257  CG  ASP A  36     -20.089  22.999  31.916  1.00 16.82           C  
ATOM    258  OD1 ASP A  36     -21.144  23.523  31.488  1.00 18.88           O  
ATOM    259  OD2 ASP A  36     -19.620  21.942  31.442  1.00 18.23           O  
ATOM    260  N   ILE A  37     -18.472  25.836  35.082  1.00 13.79           N  
ATOM    261  CA  ILE A  37     -17.680  27.009  35.464  1.00 13.79           C  
ATOM    262  C   ILE A  37     -18.572  28.140  35.968  1.00 14.15           C  
ATOM    263  O   ILE A  37     -18.423  29.289  35.539  1.00 15.65           O  
ATOM    264  CB  ILE A  37     -16.666  26.664  36.574  1.00 14.15           C  
ATOM    265  CG1 ILE A  37     -15.637  25.666  36.037  1.00 14.73           C  
ATOM    266  CG2 ILE A  37     -15.992  27.935  37.070  1.00 14.73           C  
ATOM    267  CD1 ILE A  37     -14.747  25.045  37.086  1.00 16.82           C  
ATOM    268  N   ILE A  38     -19.508  27.818  36.862  1.00 13.79           N  
ATOM    269  CA  ILE A  38     -20.428  28.815  37.423  1.00 14.15           C  
ATOM    270  C   ILE A  38     -21.282  29.479  36.341  1.00 14.59           C  
ATOM    271  O   ILE A  38     -21.611  30.666  36.438  1.00 16.29           O  
ATOM    272  CB  ILE A  38     -21.327  28.219  38.530  1.00 14.73           C  
ATOM    273  CG1 ILE A  38     -20.472  27.674  39.683  1.00 15.65           C  
ATOM    274  CG2 ILE A  38     -22.316  29.255  39.064  1.00 15.65           C  
ATOM    275  CD1 ILE A  38     -21.278  26.883  40.702  1.00 17.65           C  
ATOM    276  N   ILE A  39     -21.637  28.708  35.313  1.00 14.59           N  
ATOM    277  CA  ILE A  39     -22.457  29.231  34.218  1.00 15.06           C  
ATOM    278  C   ILE A  39     -21.642  30.228  33.400  1.00 15.06           C  
ATOM    279  O   ILE A  39     -22.188  31.246  32.966  1.00 16.82           O  
ATOM    280  CB  ILE A  39     -22.999  28.093  33.328  1.00 15.65           C  
ATOM    281  CG1 ILE A  39     -24.019  27.279  34.125  1.00 16.82           C  
ATOM    282  CG2 ILE A  39     -23.639  28.666  32.067  1.00 16.82           C  
ATOM    283  CD1 ILE A  39     -24.629  26.155  33.308  1.00 18.88           C  
ATOM    284  N   CYS A  40     -20.347  29.939  33.199  1.00 14.59           N  
ATOM    285  CA  CYS A  40     -19.467  30.809  32.428  1.00 14.59           C  
ATOM    286  C   CYS A  40     -19.261  32.146  33.141  1.00 15.06           C  
ATOM    287  O   CYS A  40     -19.245  33.209  32.518  1.00 16.82           O  
ATOM    288  CB  CYS A  40     -18.118  30.138  32.176  1.00 14.73           C  
ATOM    289  SG  CYS A  40     -18.232  28.530  31.365  1.00 16.29           S  
ATOM    290  N   ARG A  41     -19.112  32.088  34.459  1.00 15.06           N  
ATOM    291  CA  ARG A  41     -18.913  33.298  35.253  1.00 15.65           C  
ATOM    292  C   ARG A  41     -20.155  34.181  35.313  1.00 16.29           C  
ATOM    293  O   ARG A  41     -19.988  35.399  35.439  1.00 18.23           O  
ATOM    294  CB  ARG A  41     -18.490  32.906  36.671  1.00 16.29           C  
ATOM    295  CG  ARG A  41     -17.151  32.193  36.721  1.00 17.65           C  
ATOM    296  CD  ARG A  41     -16.790  31.815  38.150  1.00 20.34           C  
ATOM    297  NE  ARG A  41     -15.485  31.171  38.204  1.00 23.94           N  
ATOM    298  CZ  ARG A  41     -14.331  31.748  38.549  1.00 27.24           C  
ATOM    299  NH1 ARG A  41     -14.316  33.023  38.900  1.00 28.56           N  
ATOM    300  NH2 ARG A  41     -13.190  31.059  38.539  1.00 29.80           N  
ATOM    301  N   PRO A  42     -21.365  33.593  35.228  1.00 16.29           N  
ATOM    302  CA  PRO A  42     -22.610  34.349  35.281  1.00 16.82           C  
ATOM    303  C   PRO A  42     -22.756  35.278  34.072  1.00 17.65           C  
ATOM    304  O   PRO A  42     -23.360  36.350  34.195  1.00 19.82           O  
ATOM    305  CB  PRO A  42     -23.708  33.284  35.337  1.00 17.65           C  
ATOM    306  CG  PRO A  42     -22.952  32.062  35.772  1.00 17.65           C  
ATOM    307  CD  PRO A  42     -21.657  32.181  34.996  1.00 16.82           C  
ATOM    308  N   GLY A  43     -22.188  34.872  32.939  1.00 17.65           N  
ATOM    309  CA  GLY A  43     -22.259  35.688  31.727  1.00 18.88           C  
ATOM    310  C   GLY A  43     -21.261  36.837  31.699  1.00 19.82           C  
ATOM    311  O   GLY A  43     -21.439  37.848  31.018  1.00 22.15           O  
ATOM    312  N   ALA A  44     -20.203  36.680  32.484  1.00 19.82           N  
ATOM    313  CA  ALA A  44     -19.183  37.712  32.553  1.00 21.05           C  
ATOM    314  C   ALA A  44     -17.828  37.227  32.054  1.00 21.62           C  
ATOM    315  O   ALA A  44     -17.202  37.882  31.216  1.00 23.94           O  
ATOM    316  CB  ALA A  44     -19.064  38.219  33.990  1.00 22.75           C  
ATOM    317  N   ALA A  45     -17.387  36.069  32.564  1.00 21.62           N  
ATOM    318  CA  ALA A  45     -16.111  35.485  32.176  1.00 22.75           C  
ATOM    319  C   ALA A  45     -16.155  34.908  30.763  1.00 23.30           C  
ATOM    320  O   ALA A  45     -15.111  34.786  30.106  1.00 25.40           O  
ATOM    321  CB  ALA A  45     -15.696  34.408  33.179  1.00 23.94           C  
ATOM    322  N   ASN A  46     -17.360  34.545  30.297  1.00 23.94           N  
ATOM    323  CA  ASN A  46     -17.518  33.985  28.961  1.00 25.40           C  
ATOM    324  C   ASN A  46     -17.653  35.088  27.915  1.00 26.60           C  
ATOM    325  O   ASN A  46     -18.064  36.216  28.228  1.00 28.56           O  
ATOM    326  CB  ASN A  46     -18.730  33.053  28.912  1.00 26.60           C  
ATOM    327  CG  ASN A  46     -18.897  32.392  27.553  1.00 28.56           C  
ATOM    328  OD1 ASN A  46     -17.925  31.956  26.935  1.00 30.64           O  
ATOM    329  ND2 ASN A  46     -20.147  32.327  27.086  1.00 30.64           N  
ATOM    330  OXT ASN A  46     -17.332  34.786  26.742  1.00 27.89           O  
HETATM  331  O   HOH A 101       4.464  21.905  15.939  1.00 24.50           O  
HETATM  332  O   HOH A 102      13.504   7.842  21.328  1.00 27.80           O  
HETATM  333  O   HOH A 103      -8.490   9.022  24.119  1.00 31.40           O  
HETATM  334  O   HOH A 104     -10.820  14.200  28.450  1.00 33.20           O  
HETATM  335  O   HOH A 105     -12.010  25.400  42.100  1.00 35.10           O  
CONECT   15  176                                                                
CONECT   26  109                                                                
CONECT  204  251                                                                
END`;

// Dictionary of 3-letter to 1-letter amino acid codes
const AA_3TO1 = {
  ALA: 'A', ARG: 'R', ASN: 'N', ASP: 'D', CYS: 'C',
  GLN: 'Q', GLU: 'E', GLY: 'G', HIS: 'H', ILE: 'I',
  LEU: 'L', LYS: 'K', MET: 'M', PHE: 'F', PRO: 'P',
  SER: 'S', THR: 'T', TRP: 'W', TYR: 'Y', VAL: 'V',
  SEC: 'U', PYL: 'O', ASX: 'B', GLX: 'Z', XAA: 'X',
  // Nucleic Acids
  DA: 'A', DT: 'T', DC: 'C', DG: 'G',
  A: 'A', T: 'T', C: 'C', G: 'G', U: 'U'
};

// Hydrophobicity index (Kyte-Doolittle)
const AA_HYDROPHOBICITY = {
  ILE: 4.5, VAL: 4.2, LEU: 3.8, PHE: 2.8, CYS: 2.5,
  MET: 1.9, ALA: 1.8, GLY: -0.4, THR: -0.7, SER: -0.8,
  TRP: -0.9, TYR: -1.3, PRO: -1.6, HIS: -3.2, GLU: -3.5,
  GLN: -3.5, ASP: -3.5, ASN: -3.5, LYS: -3.9, ARG: -4.5
};

// Global Mol3D Viewer State
const Mol3DState = {
  glViewer: null,
  activePdbText: "",
  activeFilename: "1CRN.pdb",
  parsedInfo: null,
  activeStyle: "cartoon",
  activeColorScheme: "ss",
  isSpinning: false,
  spinTimer: null,
  showAxes: false,
  axesMesh: null,
  showLigands: true,
  showSidechains: false,
  showWaters: false,
  showLabels: true,
  surfaceOpacity: 0.7,
  bgColorIndex: 0,
  bgColors: ["#0f172a", "#000000", "#ffffff"],
  highlightedResidue: null,
  fallbackCanvas: null,
  fallbackAnimId: null,
  fallbackRotX: 0.2,
  fallbackRotY: 0.3,
  fallbackZoom: 1.0,
  fallbackIsDragging: false,
  fallbackLastMouseX: 0,
  fallbackLastMouseY: 0
};

// ===================================================================
// PDB PARSER ENGINE
// ===================================================================
function parsePdbData(pdbString) {
  if (!pdbString || typeof pdbString !== 'string') return null;

  const lines = pdbString.split('\n');
  const atoms = [];
  const hetatms = [];
  const helices = [];
  const sheets = [];
  const chainsMap = {};
  const ligandsMap = {};
  let title = "";
  let classification = "";
  let resolution = "";
  let expMethod = "";

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const recType = line.substring(0, 6).trim();

    if (recType === 'HEADER') {
      classification = line.substring(10, 50).trim();
    } else if (recType === 'TITLE') {
      const t = line.substring(10, 80).trim();
      title += (title ? " " : "") + t;
    } else if (recType === 'EXPDTA') {
      expMethod = line.substring(10, 60).trim();
    } else if (recType === 'REMARK' && line.includes('RESOLUTION.')) {
      const match = line.match(/RESOLUTION\.\s+([\d\.]+)\s+ANGSTROMS/i);
      if (match) resolution = match[1] + " Å";
    } else if (recType === 'HELIX') {
      const hChain = line.substring(19, 20).trim() || 'A';
      const hStart = parseInt(line.substring(21, 25).trim(), 10);
      const hEnd = parseInt(line.substring(33, 37).trim(), 10);
      helices.push({ chain: hChain, start: hStart, end: hEnd });
    } else if (recType === 'SHEET') {
      const sChain = line.substring(21, 22).trim() || 'A';
      const sStart = parseInt(line.substring(22, 26).trim(), 10);
      const sEnd = parseInt(line.substring(33, 37).trim(), 10);
      sheets.push({ chain: sChain, start: sStart, end: sEnd });
    } else if (recType === 'ATOM' || recType === 'HETATM') {
      const serial = parseInt(line.substring(6, 11).trim(), 10) || (atoms.length + hetatms.length + 1);
      const name = line.substring(12, 16).trim();
      const resName = line.substring(17, 20).trim();
      const chainID = line.substring(21, 22).trim() || 'A';
      const resSeq = parseInt(line.substring(22, 26).trim(), 10) || 1;
      const x = parseFloat(line.substring(30, 38).trim()) || 0;
      const y = parseFloat(line.substring(38, 46).trim()) || 0;
      const z = parseFloat(line.substring(46, 54).trim()) || 0;
      const occupancy = parseFloat(line.substring(54, 60).trim()) || 1.0;
      const tempFactor = parseFloat(line.substring(60, 66).trim()) || 0.0;
      const element = line.substring(76, 78).trim() || name.substring(0, 1);

      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;

      const atomObj = {
        serial, name, resName, chainID, resSeq,
        x, y, z, occupancy, tempFactor, element,
        isHet: (recType === 'HETATM')
      };

      if (recType === 'ATOM') {
        atoms.push(atomObj);
        if (!chainsMap[chainID]) {
          chainsMap[chainID] = { id: chainID, residues: {}, residueList: [] };
        }
        if (!chainsMap[chainID].residues[resSeq]) {
          const resObj = {
            seq: resSeq,
            name: resName,
            code: AA_3TO1[resName] || 'X',
            atoms: []
          };
          chainsMap[chainID].residues[resSeq] = resObj;
          chainsMap[chainID].residueList.push(resObj);
        }
        chainsMap[chainID].residues[resSeq].atoms.push(atomObj);
      } else {
        hetatms.push(atomObj);
        if (resName !== 'HOH' && resName !== 'WAT') {
          if (!ligandsMap[resName]) ligandsMap[resName] = [];
          ligandsMap[resName].push(atomObj);
        }
      }
    }
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  const dx = maxX - minX;
  const dy = maxY - minY;
  const dz = maxZ - minZ;
  const radius = Math.sqrt(dx * dx + dy * dy + dz * dz) / 2 || 20;

  // Flatten residues array
  let allResidues = [];
  const chainKeys = Object.keys(chainsMap);
  chainKeys.forEach(ck => {
    allResidues = allResidues.concat(chainsMap[ck].residueList);
  });

  return {
    title: title || "Makromolekul 3D (Struktur PDB)",
    classification: classification || "Protein",
    expMethod: expMethod || "X-Ray Diffraction / Model",
    resolution: resolution || "N/A",
    atoms,
    hetatms,
    totalAtoms: atoms.length + hetatms.length,
    helices,
    sheets,
    chainsMap,
    chainKeys,
    residues: allResidues,
    ligandsMap,
    ligandKeys: Object.keys(ligandsMap),
    boundingBox: { minX, maxX, minY, maxY, minZ, maxZ, cx, cy, cz, radius }
  };
}

// ===================================================================
// 3D RENDERING CONTROLLER (3Dmol.js + Fallback Engine)
// ===================================================================
function initMol3DViewer(pdbString, filename) {
  Mol3DState.activePdbText = pdbString;
  Mol3DState.activeFilename = filename || "structure.pdb";
  Mol3DState.parsedInfo = parsePdbData(pdbString);

  if (!Mol3DState.parsedInfo || Mol3DState.parsedInfo.totalAtoms === 0) {
    if (typeof toast === 'function') toast("Format berkas PDB tidak valid atau tidak memiliki atom koordinat.");
    return false;
  }

  // Show Workspace UI
  const area = document.getElementById('mol3dWorkspaceArea');
  if (area) area.style.display = 'block';

  updateMol3DMetadataUI(Mol3DState.parsedInfo);
  renderMol3DSequenceTrack(Mol3DState.parsedInfo);
  renderMol3DChainsTable(Mol3DState.parsedInfo);

  // Initialize WebGL viewer via 3Dmol if available
  const container = document.getElementById('mol3dViewer');
  if (!container) return false;
  container.innerHTML = "";

  if (typeof $3Dmol !== 'undefined') {
    try {
      const config = { backgroundColor: Mol3DState.bgColors[Mol3DState.bgColorIndex] };
      Mol3DState.glViewer = $3Dmol.createViewer(container, config);
      Mol3DState.glViewer.addModel(pdbString, "pdb");
      
      applyMol3DStylesToViewer();
      
      // Setup atom click interactions
      Mol3DState.glViewer.setClickable({}, true, function(atom, viewer, event, container) {
        if (!atom) return;
        const infoBadge = document.getElementById('mol3dHoverInfo');
        const aa1 = AA_3TO1[atom.resn] || atom.resn;
        const msg = `[${atom.chain || 'A'}] ${atom.resn} #${atom.resi} (${aa1}) — Atom: ${atom.atom} (${atom.elem}) | Pos: (${atom.x.toFixed(1)}, ${atom.y.toFixed(1)}, ${atom.z.toFixed(1)}) | B-Factor: ${atom.b ? atom.b.toFixed(1) : '-'}`;
        if (infoBadge) infoBadge.innerHTML = `<strong>${msg}</strong>`;

        if (Mol3DState.showLabels) {
          viewer.removeAllLabels();
          viewer.addLabel(`${atom.resn} ${atom.resi}:${atom.chain || 'A'} (${atom.atom})`, {
            position: { x: atom.x, y: atom.y, z: atom.z },
            backgroundColor: 0x10b981,
            backgroundOpacity: 0.85,
            fontColor: 0xffffff,
            fontSize: 12,
            showBackground: true
          });
          viewer.render();
        }
      });

      Mol3DState.glViewer.zoomTo();
      // For large PDB macromolecular structures or multi-chain complexes, add gentle margin so it fits laptop screen cleanly
      if (Mol3DState.parsedInfo?.boundingBox?.radius > 30 || Mol3DState.parsedInfo?.totalAtoms > 500) {
        Mol3DState.glViewer.zoom(0.88);
      }
      Mol3DState.glViewer.render();
      if (typeof toast === 'function') toast(`Berhasil memuat 3D molekul: ${Mol3DState.activeFilename}`);
      return true;
    } catch (e) {
      console.warn("3Dmol WebGL rendering failed, falling back to Vector Canvas 3D:", e);
      initMol3DFallbackCanvas(container, Mol3DState.parsedInfo);
      return true;
    }
  } else {
    // 3Dmol library not loaded, activate fallback 3D vector canvas
    initMol3DFallbackCanvas(container, Mol3DState.parsedInfo);
    return true;
  }
}

function applyMol3DStylesToViewer() {
  if (!Mol3DState.glViewer) return;
  const viewer = Mol3DState.glViewer;
  viewer.removeAllSurfaces();
  viewer.removeAllShapes();

  const colorScheme = Mol3DState.activeColorScheme;
  const style = Mol3DState.activeStyle;

  // Base representations
  const styleSpec = {};
  if (style === 'cartoon') {
    styleSpec.cartoon = get3DmolColorSpec(colorScheme);
  } else if (style === 'stick') {
    styleSpec.stick = { radius: 0.2, ...get3DmolColorSpec(colorScheme) };
  } else if (style === 'sphere') {
    styleSpec.sphere = { scale: 0.85, ...get3DmolColorSpec(colorScheme) };
  } else if (style === 'line') {
    styleSpec.line = { ...get3DmolColorSpec(colorScheme) };
  } else if (style === 'cross') {
    styleSpec.cross = { radius: 0.8, ...get3DmolColorSpec(colorScheme) };
  } else if (style === 'surface') {
    styleSpec.cartoon = { color: '#888888', opacity: 0.5 };
  }

  viewer.setStyle({}, styleSpec);

  // Surface rendering
  const surfaceCtrl = document.getElementById('mol3dSurfaceControls');
  if (style === 'surface') {
    if (surfaceCtrl) surfaceCtrl.style.display = 'block';
    viewer.addSurface($3Dmol.SurfaceType.VDW, {
      opacity: Mol3DState.surfaceOpacity,
      colorscheme: (colorScheme === 'spectrum' ? 'roygb' : (colorScheme === 'chain' ? 'chain' : 'ssJmol'))
    });
  } else {
    if (surfaceCtrl) surfaceCtrl.style.display = 'none';
  }

  // Sidechains toggle
  if (Mol3DState.showSidechains && style !== 'stick' && style !== 'sphere') {
    viewer.setStyle({ atom: ['N', 'CA', 'C', 'O'], invert: true }, { stick: { radius: 0.14, ...get3DmolColorSpec(colorScheme) } });
  }

  // Ligands toggle
  if (Mol3DState.showLigands) {
    viewer.setStyle({ hetflag: true }, {
      stick: { radius: 0.35, colorscheme: 'greenCarbon' },
      sphere: { scale: 0.45, colorscheme: 'greenCarbon' }
    });
  } else {
    viewer.setStyle({ hetflag: true }, {});
  }

  // Waters toggle
  if (!Mol3DState.showWaters) {
    viewer.setStyle({ resn: 'HOH' }, {});
  } else {
    viewer.setStyle({ resn: 'HOH' }, { sphere: { scale: 0.3, color: '#38bdf8' } });
  }

  viewer.render();
}

function get3DmolColorSpec(colorScheme) {
  if (colorScheme === 'ss') {
    return { colorscheme: 'ssJmol' };
  } else if (colorScheme === 'spectrum') {
    return { colorscheme: 'roygb' };
  } else if (colorScheme === 'elem') {
    return { colorscheme: 'default' };
  } else if (colorScheme === 'chain') {
    return { colorscheme: 'chain' };
  } else if (colorScheme === 'bfactor') {
    return { colorscheme: 'whiteCarbon' };
  } else if (colorScheme === 'polarity') {
    return { color: '#0ea5e9' };
  }
  return { colorscheme: 'ssJmol' };
}

// ===================================================================
// UI INTERACTION HANDLERS
// ===================================================================
function setMol3DStyle(styleName) {
  Mol3DState.activeStyle = styleName;
  document.querySelectorAll('.mol3d-opt-btn').forEach(btn => {
    if (btn.id === `mol3d-style-${styleName}`) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (Mol3DState.glViewer) {
    applyMol3DStylesToViewer();
  } else if (Mol3DState.fallbackCanvas) {
    drawMol3DFallbackCanvas();
  }
}

function setMol3DColorScheme(schemeName) {
  Mol3DState.activeColorScheme = schemeName;
  if (Mol3DState.glViewer) {
    applyMol3DStylesToViewer();
  } else if (Mol3DState.fallbackCanvas) {
    drawMol3DFallbackCanvas();
  }
}

function updateMol3DDisplayOptions() {
  Mol3DState.showLigands = document.getElementById('mol3dToggleLigands')?.checked ?? true;
  Mol3DState.showSidechains = document.getElementById('mol3dToggleSidechains')?.checked ?? false;
  Mol3DState.showWaters = document.getElementById('mol3dToggleWaters')?.checked ?? false;
  Mol3DState.showLabels = document.getElementById('mol3dToggleLabels')?.checked ?? true;

  if (Mol3DState.glViewer) {
    applyMol3DStylesToViewer();
  } else if (Mol3DState.fallbackCanvas) {
    drawMol3DFallbackCanvas();
  }
}

function setMol3DSurfaceOpacity(val) {
  Mol3DState.surfaceOpacity = parseFloat(val);
  const lbl = document.getElementById('mol3dOpacityVal');
  if (lbl) lbl.textContent = parseFloat(val).toFixed(2);
  if (Mol3DState.glViewer && Mol3DState.activeStyle === 'surface') {
    applyMol3DStylesToViewer();
  }
}

function zoomInMol3D() {
  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.zoom(1.25, 200);
    Mol3DState.glViewer.render();
  } else if (Mol3DState.fallbackCanvas) {
    Mol3DState.fallbackZoom = Math.min(5.0, Mol3DState.fallbackZoom * 1.25);
    drawMol3DFallbackCanvas();
  }
}

function zoomOutMol3D() {
  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.zoom(0.8, 200);
    Mol3DState.glViewer.render();
  } else if (Mol3DState.fallbackCanvas) {
    Mol3DState.fallbackZoom = Math.max(0.2, Mol3DState.fallbackZoom * 0.8);
    drawMol3DFallbackCanvas();
  }
}

function fitMol3DToScreen() {
  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.zoomTo();
    const bb = Mol3DState.parsedInfo?.boundingBox;
    if (bb && (bb.radius > 30 || Mol3DState.parsedInfo?.totalAtoms > 500)) {
      Mol3DState.glViewer.zoom(0.88, 200);
    }
    Mol3DState.glViewer.render();
  } else if (Mol3DState.fallbackCanvas) {
    Mol3DState.fallbackZoom = 1.0;
    Mol3DState.fallbackRotX = 0.2;
    Mol3DState.fallbackRotY = 0.3;
    drawMol3DFallbackCanvas();
  }
  if (typeof toast === 'function') toast("Ukuran molekul 3D disesuaikan otomatis dengan layar browser.");
}

function setMol3DLayoutMode(mode) {
  const grid = document.getElementById('mol3dLayoutGrid');
  const btnSplit = document.getElementById('mol3dLayoutSplitBtn');
  const btnFull = document.getElementById('mol3dLayoutFullBtn');
  if (!grid) return;

  if (mode === 'full') {
    grid.className = 'mol3d-grid-full';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gridTemplateColumns = 'none';
    if (btnFull) btnFull.classList.add('active-layout');
    if (btnSplit) btnSplit.classList.remove('active-layout');
  } else {
    grid.className = 'mol3d-grid-split';
    grid.style.display = 'grid';
    grid.style.flexDirection = 'initial';
    grid.style.gridTemplateColumns = '1.5fr 1fr';
    if (btnSplit) btnSplit.classList.add('active-layout');
    if (btnFull) btnFull.classList.remove('active-layout');
  }

  setTimeout(() => {
    if (Mol3DState.glViewer) {
      Mol3DState.glViewer.resize();
      Mol3DState.glViewer.zoomTo();
      const bb = Mol3DState.parsedInfo?.boundingBox;
      if (bb && (bb.radius > 30 || Mol3DState.parsedInfo?.totalAtoms > 500)) {
        Mol3DState.glViewer.zoom(0.88);
      }
      Mol3DState.glViewer.render();
    }
    if (Mol3DState.fallbackCanvas) resizeMol3DFallbackCanvas();
  }, 120);
}

function setMol3DHeight(heightStr) {
  const container = document.getElementById('mol3dViewportContainer');
  if (!container) return;
  container.style.height = heightStr;

  // Update button active state
  ['hbtn-400', 'hbtn-540', 'hbtn-680', 'hbtn-auto'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.classList.remove('active');
  });
  if (heightStr.includes('400')) document.getElementById('hbtn-400')?.classList.add('active');
  else if (heightStr.includes('540')) document.getElementById('hbtn-540')?.classList.add('active');
  else if (heightStr.includes('680')) document.getElementById('hbtn-680')?.classList.add('active');
  else document.getElementById('hbtn-auto')?.classList.add('active');
  
  setTimeout(() => {
    if (Mol3DState.glViewer) {
      Mol3DState.glViewer.resize();
      Mol3DState.glViewer.zoomTo();
      const bb = Mol3DState.parsedInfo?.boundingBox;
      if (bb && (bb.radius > 30 || Mol3DState.parsedInfo?.totalAtoms > 500)) {
        Mol3DState.glViewer.zoom(0.88);
      }
      Mol3DState.glViewer.render();
    }
    if (Mol3DState.fallbackCanvas) resizeMol3DFallbackCanvas();
  }, 120);
}

function toggleMol3DSpin() {
  Mol3DState.isSpinning = !Mol3DState.isSpinning;
  const btn = document.getElementById('mol3dBtnSpin');
  if (btn) {
    if (Mol3DState.isSpinning) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }

  if (Mol3DState.glViewer) {
    if (Mol3DState.isSpinning) {
      Mol3DState.glViewer.spin("y", 1.5);
    } else {
      Mol3DState.glViewer.spin(false);
    }
  }
}

function centerMol3DView() {
  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.zoomTo();
    Mol3DState.glViewer.render();
  } else if (Mol3DState.fallbackCanvas) {
    Mol3DState.fallbackRotX = 0.2;
    Mol3DState.fallbackRotY = 0.3;
    Mol3DState.fallbackZoom = 1.0;
    drawMol3DFallbackCanvas();
  }
}

function resetMol3DCamera() {
  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.setCameraParameters({
      position: { x: 0, y: 0, z: -100 },
      rotation: { x: 0, y: 0, z: 0, w: 1 }
    });
    Mol3DState.glViewer.zoomTo();
    Mol3DState.glViewer.render();
  } else if (Mol3DState.fallbackCanvas) {
    Mol3DState.fallbackRotX = 0;
    Mol3DState.fallbackRotY = 0;
    Mol3DState.fallbackZoom = 1.0;
    drawMol3DFallbackCanvas();
  }
}

function toggleMol3DAxes() {
  Mol3DState.showAxes = !Mol3DState.showAxes;
  const btn = document.getElementById('mol3dBtnAxes');
  if (btn) {
    if (Mol3DState.showAxes) btn.classList.add('active');
    else btn.classList.remove('active');
  }

  if (Mol3DState.glViewer) {
    if (Mol3DState.showAxes) {
      Mol3DState.glViewer.addCustom({
        props: {},
        render: function(gl) {}
      });
      // 3Dmol custom axes shapes
      const p = Mol3DState.parsedInfo?.boundingBox || { cx:0, cy:0, cz:0, radius:20 };
      const len = p.radius * 0.8;
      Mol3DState.glViewer.addCylinder({ start: {x:p.cx, y:p.cy, z:p.cz}, end: {x:p.cx+len, y:p.cy, z:p.cz}, radius:0.4, color:'red' });
      Mol3DState.glViewer.addCylinder({ start: {x:p.cx, y:p.cy, z:p.cz}, end: {x:p.cx, y:p.cy+len, z:p.cz}, radius:0.4, color:'green' });
      Mol3DState.glViewer.addCylinder({ start: {x:p.cx, y:p.cy, z:p.cz}, end: {x:p.cx, y:p.cy, z:p.cz+len}, radius:0.4, color:'blue' });
      Mol3DState.glViewer.render();
    } else {
      applyMol3DStylesToViewer();
    }
  }
}

function cycleMol3DBackground() {
  Mol3DState.bgColorIndex = (Mol3DState.bgColorIndex + 1) % Mol3DState.bgColors.length;
  const color = Mol3DState.bgColors[Mol3DState.bgColorIndex];
  
  const container = document.getElementById('mol3dViewportContainer');
  if (container) container.style.background = color;

  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.setBackgroundColor(color);
    Mol3DState.glViewer.render();
  } else if (Mol3DState.fallbackCanvas) {
    drawMol3DFallbackCanvas();
  }
}

function captureMol3DScreenshot() {
  if (Mol3DState.glViewer) {
    const pngUri = Mol3DState.glViewer.pngURI();
    if (pngUri) {
      const a = document.createElement('a');
      a.href = pngUri;
      a.download = `AREs_BioTools_${Mol3DState.activeFilename.replace(/\.[^/.]+$/, "")}_3D.png`;
      a.click();
      if (typeof toast === 'function') toast("Tangkapan layar 3D resolusi HD berhasil diunduh.");
      return;
    }
  }
  if (Mol3DState.fallbackCanvas) {
    const a = document.createElement('a');
    a.href = Mol3DState.fallbackCanvas.toDataURL('image/png');
    a.download = `AREs_BioTools_Protein3D.png`;
    a.click();
    if (typeof toast === 'function') toast("Gambar 3D berhasil disimpan.");
  }
}

function toggleMol3DFullscreen() {
  const container = document.getElementById('mol3dViewportContainer');
  if (!container) return;
  container.classList.toggle('mol3d-fullscreen');
  
  setTimeout(() => {
    if (Mol3DState.glViewer) {
      Mol3DState.glViewer.resize();
      Mol3DState.glViewer.render();
    } else if (Mol3DState.fallbackCanvas) {
      resizeMol3DFallbackCanvas();
    }
  }, 100);
}

function focusResidueIn3D(chain, resSeq, resName) {
  if (!Mol3DState.parsedInfo) return;
  const chainObj = Mol3DState.parsedInfo.chainsMap[chain];
  if (!chainObj || !chainObj.residues[resSeq]) return;

  const res = chainObj.residues[resSeq];
  const firstAtom = res.atoms[0];
  if (!firstAtom) return;

  // Highlight sequence track item
  document.querySelectorAll('.mol3d-seq-chip').forEach(c => {
    if (c.dataset.chain === chain && parseInt(c.dataset.seq, 10) === resSeq) {
      c.classList.add('active');
      c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } else {
      c.classList.remove('active');
    }
  });

  const infoBadge = document.getElementById('mol3dHoverInfo');
  if (infoBadge) {
    infoBadge.innerHTML = `<strong>Residu Terpilih: [${chain}] ${resName} #${resSeq} (${res.code}) | Total Atom: ${res.atoms.length}</strong>`;
  }

  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.removeAllLabels();
    Mol3DState.glViewer.addLabel(`${resName} ${resSeq}:${chain}`, {
      position: { x: firstAtom.x, y: firstAtom.y, z: firstAtom.z },
      backgroundColor: 0x10b981,
      fontColor: 0xffffff,
      fontSize: 14,
      showBackground: true
    });
    Mol3DState.glViewer.center({ chain: chain, resi: resSeq });
    Mol3DState.glViewer.zoom(1.8, 400);
    Mol3DState.glViewer.render();
  }
}

function focusLigandIn3D(resn, resi, chain) {
  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.removeAllLabels();
    Mol3DState.glViewer.center({ resn: resn });
    Mol3DState.glViewer.zoom(2.0, 400);
    Mol3DState.glViewer.render();
    if (typeof toast === 'function') toast(`Fokus ke Ligan/Kofaktor ${resn}`);
  }
}

// ===================================================================
// UI DATA POPULATION (Stats, Sequence Track, Chains Table)
// ===================================================================
function updateMol3DMetadataUI(info) {
  document.getElementById('mol3dMetaTitle').textContent = info.title;
  document.getElementById('mol3dMetaSub').textContent = `${info.classification} · ${info.expMethod} · Res: ${info.resolution}`;
  document.getElementById('mol3dStatAtoms').textContent = info.totalAtoms.toLocaleString();
  document.getElementById('mol3dStatResidues').textContent = info.residues.length.toLocaleString();
  document.getElementById('mol3dStatChains').textContent = info.chainKeys.length;
  document.getElementById('mol3dStatHelices').textContent = info.helices.length;
  document.getElementById('mol3dStatSheets').textContent = info.sheets.length;
  document.getElementById('mol3dStatLigands').textContent = info.ligandKeys.length;
  document.getElementById('mol3dSeqCountLabel').textContent = `${info.residues.length} Residu (${info.chainKeys.join(', ')})`;
}

function renderMol3DSequenceTrack(info) {
  const track = document.getElementById('mol3dSeqTrack');
  if (!track) return;
  track.innerHTML = "";

  if (info.residues.length === 0) {
    track.innerHTML = `<span style="color:var(--text3); font-size:11px;">Tidak ada deret asam amino terdeteksi</span>`;
    return;
  }

  info.chainKeys.forEach(ck => {
    const chain = info.chainsMap[ck];
    chain.residueList.forEach(res => {
      const chip = document.createElement('div');
      chip.className = 'mol3d-seq-chip';
      chip.dataset.chain = ck;
      chip.dataset.seq = res.seq;
      chip.title = `${res.name} #${res.seq} (Chain ${ck})`;
      chip.innerHTML = `<div style="font-weight:bold; font-size:12px;">${res.code}</div><div style="font-size:8px; opacity:0.7;">${res.seq}</div>`;
      chip.onclick = () => focusResidueIn3D(ck, res.seq, res.name);
      track.appendChild(chip);
    });
  });
}

function renderMol3DChainsTable(info) {
  const tbody = document.getElementById('mol3dChainsBody');
  if (!tbody) return;
  tbody.innerHTML = "";

  // Add polypeptide chains
  info.chainKeys.forEach(ck => {
    const chain = info.chainsMap[ck];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge" style="background:var(--primary-light); color:var(--primary);">Rantai Protein</span></td>
      <td><strong>Rantai ${ck}</strong></td>
      <td>${chain.residueList.length} aa</td>
      <td><button class="btn btn-outline btn-xs" onclick="focusResidueIn3D('${ck}', ${chain.residueList[0]?.seq || 1}, '${chain.residueList[0]?.name || ''}')">🎯 Fokus</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Add Ligands / Heteroatoms
  info.ligandKeys.forEach(lk => {
    const ligList = info.ligandsMap[lk];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge" style="background:var(--warning-light); color:var(--warning);">Ligan / HET</span></td>
      <td><strong>${lk}</strong></td>
      <td>${ligList.length} atom</td>
      <td><button class="btn btn-outline btn-xs" onclick="focusLigandIn3D('${lk}')">🔍 Zoom</button></td>
    `;
    tbody.appendChild(tr);
  });

  if (info.chainKeys.length === 0 && info.ligandKeys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text3);">Tidak ada rantai/ligan terdeteksi</td></tr>`;
  }
}

// ===================================================================
// FILE UPLOADERS & PRESETS HANDLERS
// ===================================================================
function fuDragOver(e, id) {
  e.preventDefault();
  e.stopPropagation();
  const el = document.getElementById(id);
  if (el) el.querySelector('.fasta-drop-zone')?.classList.add('dragover');
}

function fuDragLeave(id) {
  const el = document.getElementById(id);
  if (el) el.querySelector('.fasta-drop-zone')?.classList.remove('dragover');
}

function fuDropMol3D(e, containerId) {
  e.preventDefault();
  e.stopPropagation();
  fuDragLeave(containerId);
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    loadMol3DFile(e.dataTransfer.files[0], containerId);
  }
}

function fuReadMol3D(input, containerId) {
  if (input.files && input.files[0]) {
    loadMol3DFile(input.files[0], containerId);
  }
}

function loadMol3DFile(file, containerId) {
  const badge = document.getElementById('fu-mol3d-badge');
  const progWrap = document.getElementById('fu-mol3d-prog');
  const progBar = document.getElementById('fu-mol3d-bar');
  const statsRow = document.getElementById('fu-mol3d-stats');

  if (file.size > 50 * 1024 * 1024) {
    if (typeof toast === 'function') toast("Ukuran file melebihi batas 50 MB.");
    return;
  }

  if (badge) {
    badge.style.display = 'inline-flex';
    badge.textContent = `⏳ Membaca: ${file.name}`;
  }
  if (progWrap) progWrap.style.display = 'block';
  if (progBar) progBar.style.width = '20%';

  const reader = new FileReader();
  reader.onprogress = (e) => {
    if (e.lengthComputable && progBar) {
      const pct = Math.round((e.loaded / e.total) * 100);
      progBar.style.width = `${pct}%`;
    }
  };
  reader.onload = (e) => {
    if (progBar) progBar.style.width = '100%';
    setTimeout(() => {
      if (progWrap) progWrap.style.display = 'none';
      const text = e.target.result;
      const success = initMol3DViewer(text, file.name);
      if (success) {
        if (badge) {
          badge.className = 'fasta-file-badge';
          badge.textContent = `✓ ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        }
        if (statsRow) {
          statsRow.style.display = 'flex';
          statsRow.innerHTML = `<span>File: <b>${file.name}</b></span><span>Ukuran: <b>${(file.size / 1024).toFixed(1)} KB</b></span><span>Tipe: <b>PDB/Struktur 3D</b></span>`;
        }
      } else {
        if (badge) {
          badge.className = 'fasta-file-badge warn';
          badge.textContent = `⚠ Format file gagal diproses`;
        }
      }
    }, 200);
  };
  reader.readAsText(file);
}

function fetchRcsbPdb(explicitId) {
  const input = document.getElementById('rcsbPdbIdInput');
  const pdbId = (explicitId || input?.value || '').trim().toUpperCase();
  if (!pdbId || pdbId.length < 4) {
    if (typeof toast === 'function') toast("Masukkan 4 karakter PDB ID yang valid (cth: 1CRN, 1GFL, 4HHB).");
    return;
  }

  if (typeof toast === 'function') toast(`Menghubungi RCSB PDB untuk struktur: ${pdbId}...`);
  const url = `https://files.rcsb.org/download/${pdbId}.pdb`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(pdbText => {
      const success = initMol3DViewer(pdbText, `${pdbId}.pdb`);
      if (success && typeof toast === 'function') {
        toast(`Struktur ${pdbId} berhasil ditarik dari RCSB PDB!`);
      }
    })
    .catch(err => {
      console.warn(`Gagal menarik dari RCSB PDB (${err.message}). Mencoba server cermin...`);
      // Secondary mirror
      const mirrorUrl = `https://models.rcsb.org/v1/${pdbId}.pdb`;
      fetch(mirrorUrl)
        .then(r => r.text())
        .then(text => {
          initMol3DViewer(text, `${pdbId}.pdb`);
        })
        .catch(e => {
          if (pdbId === '1CRN') {
            initMol3DViewer(PDB_SAMPLE_1CRN, '1CRN.pdb');
            if (typeof toast === 'function') toast("Memuat data offline lokal 1CRN.");
          } else {
            if (typeof toast === 'function') toast(`Gagal mengunduh struktur ${pdbId}. Periksa koneksi internet.`);
          }
        });
    });
}

function renderRawPdbInput() {
  const text = document.getElementById('mol3dRawInput')?.value || '';
  if (!text.trim()) {
    if (typeof toast === 'function') toast("Teks PDB masih kosong. Silakan tempel data koordinat PDB.");
    return;
  }
  initMol3DViewer(text, "raw_pasted.pdb");
}

function loadMol3DPreset(presetKey) {
  if (presetKey === '1CRN') {
    initMol3DViewer(PDB_SAMPLE_1CRN, "1CRN_Crambin.pdb");
  } else if (presetKey) {
    const inp = document.getElementById('rcsbPdbIdInput');
    if (inp) inp.value = presetKey;
    fetchRcsbPdb(presetKey);
  }
}

function exportActivePdbFile() {
  if (!Mol3DState.activePdbText) {
    if (typeof toast === 'function') toast("Belum ada struktur molekul aktif untuk diunduh.");
    return;
  }
  const blob = new Blob([Mol3DState.activePdbText], { type: 'chemical/x-pdb;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = Mol3DState.activeFilename || "protein_structure.pdb";
  a.click();
  if (typeof toast === 'function') toast(`Berkas PDB ${a.download} berhasil diunduh.`);
}

function resetMol3D() {
  Mol3DState.activePdbText = "";
  Mol3DState.parsedInfo = null;
  if (Mol3DState.glViewer) {
    Mol3DState.glViewer.clear();
  }
  if (Mol3DState.fallbackCanvas) {
    const ctx = Mol3DState.fallbackCanvas.getContext('2d');
    ctx.clearRect(0, 0, Mol3DState.fallbackCanvas.width, Mol3DState.fallbackCanvas.height);
  }
  const area = document.getElementById('mol3dWorkspaceArea');
  if (area) area.style.display = 'none';
  const rawInput = document.getElementById('mol3dRawInput');
  if (rawInput) rawInput.value = '';
  const rcsbInput = document.getElementById('rcsbPdbIdInput');
  if (rcsbInput) rcsbInput.value = '';
  const badge = document.getElementById('fu-mol3d-badge');
  if (badge) badge.style.display = 'none';
  const stats = document.getElementById('fu-mol3d-stats');
  if (stats) stats.style.display = 'none';
  if (typeof toast === 'function') toast("Modul Visualisasi 3D Protein direset.");
}

// ===================================================================
// FALLBACK 3D VECTOR CANVAS RENDERER
// (Runs if WebGL/3Dmol CDN is blocked or unavailable)
// ===================================================================
function initMol3DFallbackCanvas(container, info) {
  container.innerHTML = "";
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);
  Mol3DState.fallbackCanvas = canvas;

  resizeMol3DFallbackCanvas();

  // Mouse interaction
  canvas.onmousedown = (e) => {
    Mol3DState.fallbackIsDragging = true;
    Mol3DState.fallbackLastMouseX = e.clientX;
    Mol3DState.fallbackLastMouseY = e.clientY;
  };
  window.onmouseup = () => { Mol3DState.fallbackIsDragging = false; };
  window.onmousemove = (e) => {
    if (!Mol3DState.fallbackIsDragging) return;
    const dx = e.clientX - Mol3DState.fallbackLastMouseX;
    const dy = e.clientY - Mol3DState.fallbackLastMouseY;
    Mol3DState.fallbackRotY += dx * 0.01;
    Mol3DState.fallbackRotX += dy * 0.01;
    Mol3DState.fallbackLastMouseX = e.clientX;
    Mol3DState.fallbackLastMouseY = e.clientY;
    drawMol3DFallbackCanvas();
  };
  canvas.onwheel = (e) => {
    e.preventDefault();
    Mol3DState.fallbackZoom *= (e.deltaY > 0 ? 0.9 : 1.1);
    Mol3DState.fallbackZoom = Math.max(0.2, Math.min(5.0, Mol3DState.fallbackZoom));
    drawMol3DFallbackCanvas();
  };

  drawMol3DFallbackCanvas();

  // Smooth fallback spin loop
  if (!Mol3DState.fallbackAnimId) {
    function animLoop() {
      if (Mol3DState.isSpinning && Mol3DState.fallbackCanvas) {
        Mol3DState.fallbackRotY += 0.015;
        drawMol3DFallbackCanvas();
      }
      Mol3DState.fallbackAnimId = requestAnimationFrame(animLoop);
    }
    Mol3DState.fallbackAnimId = requestAnimationFrame(animLoop);
  }
}

function resizeMol3DFallbackCanvas() {
  if (!Mol3DState.fallbackCanvas) return;
  const rect = Mol3DState.fallbackCanvas.parentElement.getBoundingClientRect();
  Mol3DState.fallbackCanvas.width = rect.width * window.devicePixelRatio || 800;
  Mol3DState.fallbackCanvas.height = rect.height * window.devicePixelRatio || 500;
  drawMol3DFallbackCanvas();
}

function drawMol3DFallbackCanvas() {
  const canvas = Mol3DState.fallbackCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const info = Mol3DState.parsedInfo;
  if (!info) return;

  const w = canvas.width;
  const h = canvas.height;
  const bg = Mol3DState.bgColors[Mol3DState.bgColorIndex];
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const bb = info.boundingBox;
  const scale = (Math.min(w, h) / (bb.radius * 2.6)) * Mol3DState.fallbackZoom;

  const rotX = Mol3DState.fallbackRotX;
  const rotY = Mol3DState.fallbackRotY;
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

  // Transform atoms
  const projAtoms = info.atoms.map(a => {
    const x0 = a.x - bb.cx;
    const y0 = a.y - bb.cy;
    const z0 = a.z - bb.cz;

    // Y rotation then X rotation
    const x1 = x0 * cosY + z0 * sinY;
    const z1 = -x0 * sinY + z0 * cosY;
    const y2 = y0 * cosX - z1 * sinX;
    const z2 = y0 * sinX + z1 * cosX;

    const px = (w / 2) + x1 * scale;
    const py = (h / 2) - y2 * scale;

    return { atom: a, px, py, pz: z2 };
  });

  // Sort by depth (painter's algorithm)
  projAtoms.sort((a, b) => a.pz - b.pz);

  // Draw bonds / backbone backbone lines
  ctx.lineWidth = Math.max(1, 2 * (scale / 10));
  for (let i = 0; i < projAtoms.length - 1; i++) {
    const a1 = projAtoms[i];
    const a2 = projAtoms[i + 1];
    if (a1.atom.chainID === a2.atom.chainID && Math.abs(a1.atom.resSeq - a2.atom.resSeq) <= 1) {
      ctx.strokeStyle = (a1.atom.name === 'CA' ? '#38bdf8' : 'rgba(255,255,255,0.25)');
      ctx.beginPath();
      ctx.moveTo(a1.px, a1.py);
      ctx.lineTo(a2.px, a2.py);
      ctx.stroke();
    }
  }

  // Draw atoms
  projAtoms.forEach(pa => {
    const elem = pa.atom.element || 'C';
    let atomColor = '#94a3b8';
    if (elem === 'C') atomColor = '#22c55e';
    else if (elem === 'N') atomColor = '#3b82f6';
    else if (elem === 'O') atomColor = '#ef4444';
    else if (elem === 'S') atomColor = '#eab308';
    else if (elem === 'P') atomColor = '#f97316';

    const r = Math.max(2, (pa.atom.name === 'CA' ? 4.5 : 2.5) * (scale / 10));
    ctx.fillStyle = atomColor;
    ctx.beginPath();
    ctx.arc(pa.px, pa.py, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Window resize & ResizeObserver listeners
let mol3dResizeTimer = null;
function handleMol3DResize() {
  clearTimeout(mol3dResizeTimer);
  mol3dResizeTimer = setTimeout(() => {
    if (Mol3DState.glViewer) {
      Mol3DState.glViewer.resize();
      Mol3DState.glViewer.render();
    }
    if (Mol3DState.fallbackCanvas) resizeMol3DFallbackCanvas();
  }, 60);
}

window.addEventListener('resize', handleMol3DResize);

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('mol3dViewportContainer');
  if (container && window.ResizeObserver) {
    const ro = new ResizeObserver(() => handleMol3DResize());
    ro.observe(container);
  }
});
