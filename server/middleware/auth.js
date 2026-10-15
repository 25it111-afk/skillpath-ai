
import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');

  try {
    req.uid = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
