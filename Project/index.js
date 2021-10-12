import express from 'express';
import patientRouter from './api/patient/routes/patient.routes';
import patientLoginRouter from './routes/patientLogin';
import doctorLoginRouter from './routes/doctorLogin';
import registrationRouter from './routes/registration';
import queuePageRouter from './routes/queue';
import doctorPageRouter from './routes/doctor';
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
  app.use('/queue/', express.static('./Project/public/queue'));
  app.use('/queue', queuePageRouter);

  app.use('/doctor/', express.static('./Project/public/doctor/'));
  app.use('/doctor', doctorPageRouter);

  app.use('/patient/login', express.static('./Project/public/patient-login/'));
  app.use('/patient/login', patientLoginRouter);

  app.use('/doctor/login', express.static('./Project/public/doctor-login/'));
  app.use('/doctor/login', doctorLoginRouter);

  app.use('/registration', express.static('./Project/public/registration'));
  app.use('/registration', registrationRouter);

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
