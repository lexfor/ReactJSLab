import {SITE_ROOT_PATH} from "../../../constants";

function photoMiddleware(req) {
  if (req.file) {
    req.body.photo = `/${req.file.path.replace(/\\/g, '/')}`;
    req.body.photo = `${SITE_ROOT_PATH}${req.body.photo}`;
  }
}

export { photoMiddleware };
