const jwt = require('jsonwebtoken');

function Authenticated(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.secretKey);
    res.locals = { ...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email };
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
}

module.exports = {
  Authenticated,
};