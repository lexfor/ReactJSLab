import {
  AuthenticationRepository,
  AuthenticationService,
  AuthenticationController,
  JwtService,
} from './api/authentication';
import { PatientController, PatientRepository, PatientService } from './api/patient';
import { ResolutionService, ResolutionRepository, ResolutionController } from './api/resolutions';
import {DoctorController, DoctorRepository, DoctorService, DoctorSpecializationRepository} from './api/doctor';
import { SpecializationsRepository, SpecializationsService, SpecializationsController } from './api/specializations';
import { connection } from './api/helpers/DBconnection';
import { initializeDB } from './api/helpers/DBInitializator';
import {AppointmentsController, AppointmentsRepository, AppointmentsService} from "./api/appointments";
import {StatusesController, StatusesRepository, StatusesService} from "./api/statuses";
import {AdminsRepository, AdminsService} from "./api/admins";

class Injector {
  constructor() {
    console.log('using SQL');
    initializeDB(connection).then(console.log('Database initialized'));
    this.patientRepository = new PatientRepository(connection);
    this.resolutionRepository = new ResolutionRepository(connection);
    this.authenticationRepository = new AuthenticationRepository(connection);
    this.doctorRepository = new DoctorRepository(connection);
    this.specializationsRepository = new SpecializationsRepository(connection);
    this.doctorSpecializationRepository = new DoctorSpecializationRepository(connection);
    this.appointmentsRepository = new AppointmentsRepository(connection);
    this.statusesRepository = new StatusesRepository(connection);
    this.adminsRepository = new AdminsRepository(connection);

    this.patientService = new PatientService(this.patientRepository);
    this.jwtService = new JwtService();
    this.authenticationService = new AuthenticationService(this.authenticationRepository);
    this.resolutionService = new ResolutionService(this.resolutionRepository);
    this.doctorService = new DoctorService(this.doctorRepository, this.doctorSpecializationRepository);
    this.specializationsService = new SpecializationsService(this.specializationsRepository);
    this.appointmentsService = new AppointmentsService(this.appointmentsRepository);
    this.statusesService = new StatusesService(this.statusesRepository);
    this.adminsService = new AdminsService(this.adminsRepository);

    this.authenticationController = new AuthenticationController(
      this.authenticationService,
      this.patientService,
      this.jwtService,
      this.doctorService,
      this.adminsService,
    );

    this.patientController = new PatientController(
      this.patientService,
      this.authenticationService,
    );

    this.resolutionController = new ResolutionController(
      this.resolutionService,
      this.patientService,
      this.doctorService,
    );

    this.doctorController = new DoctorController(
      this.doctorService,
      this.authenticationService,
    );

    this.specializationsController = new SpecializationsController(this.specializationsService);

    this.appointmentsController = new AppointmentsController(
        this.appointmentsService,
        this.patientService,
        this.doctorService
    );

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
