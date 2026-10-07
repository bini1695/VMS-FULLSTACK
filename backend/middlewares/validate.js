export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(({ message, path }) => ({ message, path })),
      });
    }

    req.body = value;
    return next();
  };
}

export default validate;