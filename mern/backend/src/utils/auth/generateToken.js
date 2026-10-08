import jwt from 'jsonwebtoken';
import env from '../../config/env.js';

// Signs a JWT carrying the user's id
const generateToken = (userId) =>
  jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export default generateToken;
