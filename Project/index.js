import express from 'express';
import patientRouter from './api/patient/routes/patient.routes';
import resolutionRouter from './api/resolutions/routes/resolution.routes';
import authenticationRouter from './api/authentication/routes/authentication.routes';
import doctorRouter from './api/doctor/routes/doctor.routes';
import appointmentRouter from './api/appointments/route/appointments.route';
import specializationsRouter from './api/specializations/route/specializations.route';
import statusesRouter from './api/statuses/route/statuses.route';
import { envConfig } from './config';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/patient/login');
});

try {
  app.use('/Project/public/users/images', express.static('./Project/public/users/images'));

  app.use('/api/patients', patientRouter);
  app.use('/api/resolutions', resolutionRouter);
  app.use('/api/auth', authenticationRouter);
  app.use('/api/doctors', doctorRouter);
  app.use('/api/appointments', appointmentRouter);
  app.use('/api/specializations', specializationsRouter);
  app.use('/api/statuses', statusesRouter);
} catch (error) {
  console.log(error);
}

app.listen(envConfig.app.port, () => {
  console.log(`Express web app available at http://localhost:${envConfig.app.port}`);
});
