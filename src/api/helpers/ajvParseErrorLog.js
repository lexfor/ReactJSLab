export function ajvParseErrorLog(error) {
  console.log(error);

  if (error.dataPath === '') {
    return `${error.message}`;
  }

  return `field '${error.dataPath.replace('.', '')}' ${error.message}`;
}
