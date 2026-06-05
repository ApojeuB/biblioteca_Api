const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token de autenticacao nao informado.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'biblioteca-dev-secret');
    req.user = {
      id: payload.sub,
      email: payload.email
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token de autenticacao invalido ou expirado.' });
  }
}

module.exports = requireAuth;
