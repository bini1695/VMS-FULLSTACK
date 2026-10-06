import Joi from 'joi';

export const createItemSchema = Joi.object({
  item_name: Joi.string().min(2).max(100).required(),
  category: Joi.string().valid('Medication', 'Vaccine', 'Consumable', 'Equipment').optional(),
  unit_of_measure: Joi.string().max(30).optional(),
  quantity_in_stock: Joi.number().integer().min(0).required(),
  reorder_level: Joi.number().integer().min(0).optional(),
  unit_price: Joi.number().precision(2).positive().required(),
});

export const createPrescriptionSchema = Joi.object({
  patient_id: Joi.number().integer().required(),
  vet_id: Joi.number().integer().required(),
  item_id: Joi.number().integer().required(),
  dosage: Joi.string().max(100).required(),
  quantity_prescribed: Joi.number().integer().positive().required(),
});