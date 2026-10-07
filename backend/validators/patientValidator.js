import Joi from 'joi';

export const createOwnerSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(7).max(20).required(),
  email: Joi.string().email().allow('', null).optional(),
  address: Joi.string().allow('', null).optional(),
});

export const createPatientSchema = Joi.object({
  owner_id: Joi.number().integer().required(),
  pet_name: Joi.string().min(1).max(50).required(),
  species: Joi.string().min(1).max(50).required(),
  breed: Joi.string().max(80).allow('', null).optional(),
  age: Joi.number().integer().min(0).max(100).optional(),
  date_of_birth: Joi.date().iso().optional(),
  gender: Joi.string().valid('Male', 'Female', 'Male Neutered', 'Female Spayed').required(),
  weight_kg: Joi.number().positive().max(999.99).optional(),
  microchip_number: Joi.string().max(50).allow('', null).optional(),
});