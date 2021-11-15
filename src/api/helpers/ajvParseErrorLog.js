import ValidationError from "./validationError";

export function ajvParseErrorLog(errors) {
  console.log(errors);
  let messages = '';
  const title = 'Validation error';

  errors.forEach((error) => {
    if (error.dataPath === '') {
      messages += `${error.message}`;
    }

    messages += `field '${error.dataPath.replace('.', '')}' ${error.message}`;
  });

  throw new ValidationError(title, messages);
}
