import express from 'express';
import cors from 'cors';
import patientRouter from './api/patient/patient.routes';
import resolutionRouter from './api/resolutions/resolution.routes';
import authenticationRouter from './api/authentication/authentication.routes';
import doctorRouter from './api/doctor/doctor.routes';
import appointmentRouter from './api/appointments/appointments.route';
import specializationsRouter from './api/specializations/specializations.route';
import statusesRouter from './api/statuses/statuses.route';
import { envConfig } from './config';
import { ROUTES } from './constants';

const corsOptions = {
  origin: '*',
};

const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/patient/login');
});

try {
  app.use(ROUTES.IMAGES, express.static(`.${ROUTES.IMAGES}`));

  app.use(ROUTES.PATIENTS, patientRouter);
  app.use(ROUTES.RESOLUTIONS, resolutionRouter);
  app.use(ROUTES.AUTH, authenticationRouter);
  app.use(ROUTES.DOCTORS, doctorRouter);
  app.use(ROUTES.APPOINTMENTS, appointmentRouter);
  app.use(ROUTES.SPECIALIZATIONS, specializationsRouter);
  app.use(ROUTES.STATUSES, statusesRouter);
} catch (error) {
  console.log(error);
}

app.listen(envConfig.app.port, () => {
  console.log(`Express web app available at http://localhost:${envConfig.app.port}`);
});
