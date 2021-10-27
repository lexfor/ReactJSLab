function getArrayFromFormMiddleware(req) {
  req.body.occupations = req.body.occupations.replace(/\s|'|"/g, '');
  const occupations = req.body.occupations.split(',');
  req.body.occupations = occupations;
}

export { getArrayFromFormMiddleware };
