function photoMiddleware(req, res, next) {
  if (req.file) {
    req.body.photo = `/${req.file.path.replace(/\\/g, '/')}`;
  }
  next();
}

export { photoMiddleware };
