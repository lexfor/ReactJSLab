function getArrayFromFormMiddleware(req) {
  req.body.occupationID = req.body.occupationID.replace(/\s|'|"/g, '');
  const occupationID = req.body.occupationID.split(',');
  req.body.occupationID = occupationID;
}

export { getArrayFromFormMiddleware };
