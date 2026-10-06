import Joi from 'joi';

export const createLabRequestSchema = Joi.object({
  patient_id: Joi.number().integer().required(),
  vet_id: Joi.number().integer().required(),
  test_type_id: Joi.number().integer().required(),
  notes: Joi.string().allow('', null).optional(),
});

export const updateLabResultsSchema = Joi.object({
  results: Joi.string().min(3).required(),
  status: Joi.string().valid('In-Progress', 'Completed', 'Cancelled').optional(),
});