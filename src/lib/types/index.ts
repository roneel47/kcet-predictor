// src/lib/types/index.ts

export type RecommendationLevel = 'Guaranteed' | 'Safe' | 'Reach' | 'Dream' | 'Not Eligible';

export const RECOMMENDATION_ORDER: RecommendationLevel[] = [
  'Guaranteed',
  'Safe',
  'Reach',
  'Dream',
];

export const RECOMMENDATION_COLORS: Record<RecommendationLevel, string> = {
  Guaranteed: 'emerald',
  Safe: 'blue',
  Reach: 'amber',
  Dream: 'rose',
  'Not Eligible': 'gray',
};

export const ALL_CATEGORIES = [
  '1G', '1K', '1R',
  '2AG', '2AK', '2AR',
  '2BG', '2BK', '2BR',
  '3AG', '3AK', '3AR',
  '3BG', '3BK', '3BR',
  'GM', 'GMK', 'GMR', 'GMP',
  'NRI', 'OPN', 'OTH',
  'SCG', 'SCK', 'SCR',
  'STG', 'STK', 'STR',
] as const;

export type Category = typeof ALL_CATEGORIES[number];

export const BRANCH_GROUPS: Record<string, string[]> = {
  'Computer Science': [
    'COMPUTER SCIENCE AND ENGINEERING',
    'COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE)',
    'COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)',
    'COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)',
    'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)',
    'COMPUTER SCIENCE AND ENGINEERING (INTERNET OF THINGS)',
    'COMPUTER SCIENCE AND ENGINEERING (BUSINESS SYSTEMS)',
    'COMPUTER SCIENCE AND ENGINEERING (FULL STACK DEVELOPMENT)',
    'COMPUTER SCIENCE AND TECHNOLOGY',
    'COMPUTER SCIENCE AND INFORMATION TECHNOLOGY',
    'COMPUTER SCIENCE AND SYSTEMS ENGINEERING',
  ],
  'Information Science': [
    'INFORMATION SCIENCE AND ENGINEERING',
    'INFORMATION TECHNOLOGY',
    'INFORMATION TECHNOLOGY (AUGMENTED REALITY AND VIRTUAL REALITY)',
  ],
  'Artificial Intelligence': [
    'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE',
    'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
    'COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE)',
    'COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)',
  ],
  'Electronics': [
    'ELECTRONICS AND COMMUNICATION ENGINEERING',
    'ELECTRONICS ENGINEERING',
    'ELECTRONICS AND COMPUTER ENGINEERING',
    'ELECTRONICS ENGINEERING (VLSI)',
    'ELECTRONICS AND INSTRUMENTATION ENGINEERING',
  ],
  'Electrical': [
    'ELECTRICAL AND ELECTRONICS ENGINEERING',
    'ELECTRICAL ENGINEERING',
  ],
  'Mechanical': [
    'MECHANICAL ENGINEERING',
    'MECHATRONICS',
    'AUTOMOTIVE ENGINEERING',
    'MANUFACTURING ENGINEERING',
    'INDUSTRIAL ENGINEERING AND MANAGEMENT',
  ],
  'Civil': [
    'CIVIL ENGINEERING',
    'CIVIL ENVIRONMENTAL ENGINEERING',
  ],
  'Chemical': [
    'CHEMICAL ENGINEERING',
    'BIOTECHNOLOGY',
    'BIOMEDICAL ENGINEERING',
    'BIOMEDICAL AND BIOINFORMATICS',
  ],
};

export interface PredictRequest {
  rank: number;
  category: string;
  branches?: string[];
  branchGroups?: string[];
  city?: string[];
  district?: string[];
  college_type?: string[];
  autonomous?: boolean | null;
}

export interface PredictionResult {
  college_code: string;
  college_name: string;
  branch_name: string;
  category: string;
  cutoff_rank: number;
  student_rank: number;
  recommendation: RecommendationLevel;
  city: string | null;
  district: string | null;
  college_type: string | null;
  autonomous: boolean | null;
}

export interface CollegeSummary {
  college_code: string;
  college_name: string;
  city: string | null;
  district: string | null;
  college_type: string | null;
  autonomous: boolean | null;
}

export interface CollegeDetail extends CollegeSummary {
  university: string | null;
  naac_grade: string | null;
  nirf_rank: number | null;
  website: string | null;
  branches: {
    branch_name: string;
    cutoffs: {
      category: string;
      cutoff_rank: number;
    }[];
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}
