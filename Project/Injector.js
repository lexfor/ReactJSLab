import {
  AuthenticationController,
  JwtService,
} from './api/authentication';
import { PatientController } from './api/patient';
import { ResolutionService, ResolutionRepository, ResolutionController } from './api/resolutions';
import {
  DoctorController, DoctorService, DoctorSpecializationRepository,
} from './api/doctor';
import { SpecializationsRepository, SpecializationsService, SpecializationsController } from './api/specializations';
import { connection } from './api/helpers/DBconnection';
import { initializeDB } from './api/helpers/DBInitializator';
import { AppointmentsController, AppointmentsRepository, AppointmentsService } from './api/appointments';
import { StatusesController, StatusesRepository, StatusesService } from './api/statuses';
import { UsersRepository, UsersService } from './api/users';

class Injector {
  constructor() {
    console.log('using SQL');
    initializeDB(connection).then(console.log('Database initialized'));
    this.resolutionRepository = new ResolutionRepository(connection);
    this.specializationsRepository = new SpecializationsRepository(connection);
    this.doctorSpecializationRepository = new DoctorSpecializationRepository(connection);
    this.appointmentsRepository = new AppointmentsRepository(connection);
    this.statusesRepository = new StatusesRepository(connection);
    this.usersRepository = new UsersRepository(connection);

    this.jwtService = new JwtService();
    this.resolutionService = new ResolutionService(this.resolutionRepository);
    this.doctorService = new DoctorService(this.doctorSpecializationRepository);
    this.specializationsService = new SpecializationsService(this.specializationsRepository);
    this.appointmentsService = new AppointmentsService(this.appointmentsRepository);
    this.statusesService = new StatusesService(this.statusesRepository);
    this.usersService = new UsersService(this.usersRepository);

    this.authenticationController = new AuthenticationController(
      this.usersService,
      this.jwtService,
    );
    this.patientController = new PatientController(this.usersService, this.resolutionService);
    this.resolutionController = new ResolutionController(this.resolutionService);
    this.doctorController = new DoctorController(this.doctorService, this.usersService);
    this.specializationsController = new SpecializationsController(this.specializationsService);
    this.appointmentsController = new AppointmentsController(this.appointmentsService);
    this.statusesController = new StatusesController(this.statusesService);
  }

  get getPatientController() {
    return this.patientController;
  }

  get getResolutionController() {
    return this.resolutionController;
  }

  get getAuthenticationController() {
    return this.authenticationController;
  }

  get getDoctorController() {
    return this.doctorController;
  }

  get getSpecializationsController() {
    return this.specializationsController;
  }

  get getAppointmentsController() {
    return this.appointmentsController;
  }

  get getStatusesController() {
    return this.statusesController;
  }
}

const injector = new Injector();
export { injector };
