import ApiError from '../utils/ApiError.js';

// Validates req.body against a zod schema and replaces it with the parsed
// result, so controllers only ever see clean, trimmed, typed data:
//   router.post('/signup', validate(signupSchema), signup);
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(', ');
    throw new ApiError(400, message);
  }

  req.body = result.data;
  next();
};

export default validate;
