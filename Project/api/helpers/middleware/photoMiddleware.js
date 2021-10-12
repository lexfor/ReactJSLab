function photoMiddleware(req, res, next) {
  if (req.file) {
    req.body.photo = req.file.path;
  }
  next();
}

export { photoMiddleware };
