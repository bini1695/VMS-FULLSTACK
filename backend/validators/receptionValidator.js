import Joi from 'joi';

export const registerOwnerPetSchema = Joi.object({
  owner_name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(7).max(20).required(),
  email: Joi.string().email().allow('', null).optional(),
  address: Joi.string().allow('', null).optional(),
  pet_name: Joi.string().min(1).max(50).required(),
  species: Joi.string().valid('Dog', 'Cat', 'Bird', 'Reptile', 'Other').required(),
  breed: Joi.string().allow('', null).optional(),
  age: Joi.number().integer().min(0).max(100).optional(),
  gender: Joi.string().valid('Male', 'Female', 'Unknown').optional(),
});

export const checkInSchema = Joi.object({
  appointment_id: Joi.number().integer().required(),
});

export const updateQueueStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      'Scheduled',
      'Arrived',
      'Checked in',
      'Triage now',
      'In consultation',
      'Completed',
      'Rescheduled',
      'Cancelled'
    )
    .required(),
});