// src/lib/validations/index.ts
import { PredictRequest } from '@/lib/types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validatePredictRequest(body: unknown): {
  data?: PredictRequest;
  errors?: ValidationError[];
} {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    return { errors: [{ field: 'body', message: 'Request body is required' }] };
  }

  const req = body as Record<string, unknown>;

  // Rank validation
  if (req.rank === undefined || req.rank === null) {
    errors.push({ field: 'rank', message: 'KCET rank is required' });
  } else {
    const rank = Number(req.rank);
    if (!Number.isInteger(rank) || rank <= 0) {
      errors.push({ field: 'rank', message: 'Rank must be a positive integer' });
    }
  }

  // Category validation
  if (!req.category || typeof req.category !== 'string' || req.category.trim() === '') {
    errors.push({ field: 'category', message: 'Reservation category is required' });
  }

  if (errors.length > 0) return { errors };

  return {
    data: {
      rank: Number(req.rank),
      category: String(req.category).trim().toUpperCase(),
      branches: Array.isArray(req.branches) ? req.branches.map(String) : [],
      branchGroups: Array.isArray(req.branchGroups) ? req.branchGroups.map(String) : [],
      city: Array.isArray(req.city) ? req.city.map(String) : [],
      district: Array.isArray(req.district) ? req.district.map(String) : [],
      college_type: Array.isArray(req.college_type) ? req.college_type.map(String) : [],
      autonomous: req.autonomous === true ? true : req.autonomous === false ? false : null,
    },
  };
}
