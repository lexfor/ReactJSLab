function photoMiddleware(req) {
  if (req.file) {
    req.body.photo = `/${req.file.path.replace(/\\/g, '/')}`;
  }
}

export { photoMiddleware };
