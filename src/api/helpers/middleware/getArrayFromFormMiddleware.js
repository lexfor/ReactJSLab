function getArrayFromFormMiddleware(req) {
  console.log(req.body.occupationID);
  req.body.occupationID = req.body.occupationID.replace(/\s|'|"/g, '');
  const occupationID = req.body.occupationID.split(',');
  req.body.occupationID = occupationID;
}

export { getArrayFromFormMiddleware };
