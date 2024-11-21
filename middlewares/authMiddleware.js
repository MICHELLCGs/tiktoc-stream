const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === `Bearer ${process.env.AUTH_TOKEN}`) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

module.exports = { verifyToken };
