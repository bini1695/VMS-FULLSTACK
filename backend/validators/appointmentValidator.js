import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  branch_id: Joi.number().integer().optional(),
  patient_id: Joi.number().integer().optional(),
  animal_id: Joi.number().integer().optional(),
  vet_id: Joi.number().integer().optional(),
  appointment_date: Joi.date().iso().required(),
  reason_for_visit: Joi.string().min(3).max(255).required(),
}).oxor('patient_id', 'animal_id').or('patient_id', 'animal_id');

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Scheduled', 'Arrived', 'Checked in', 'Triage now', 'In consultation', 'Completed', 'Rescheduled', 'Cancelled')
    .required(),
});

export const rescheduleAppointmentSchema = Joi.object({
  appointment_date: Joi.date().iso().required(),
});