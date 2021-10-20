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
import { AppointmentsController, AppointmentsRepository, AppointmentsService } from './api/appointments';
import { StatusesController } from './api/statuses';
import { UsersRepository, UsersService } from './api/users';

class Injector {
  constructor() {
    /*    initializeDB(connection).then(console.log('Database initialized')); */
    this.resolutionRepository = new ResolutionRepository();
    this.specializationsRepository = new SpecializationsRepository();
    this.doctorSpecializationRepository = new DoctorSpecializationRepository();
    this.appointmentsRepository = new AppointmentsRepository();
    this.usersRepository = new UsersRepository();

    this.jwtService = new JwtService();
    this.resolutionService = new ResolutionService(this.resolutionRepository);
    this.doctorService = new DoctorService(this.doctorSpecializationRepository);
    this.specializationsService = new SpecializationsService(this.specializationsRepository);
    this.appointmentsService = new AppointmentsService(this.appointmentsRepository);
    this.usersService = new UsersService(this.usersRepository);

    this.authenticationController = new AuthenticationController(
      this.usersService,
      this.jwtService,
    );
    this.patientController = new PatientController(this.usersService);
    this.resolutionController = new ResolutionController(
      this.resolutionService,
      this.appointmentsService,
      this.usersService,
    );
    this.doctorController = new DoctorController(
      this.doctorService,
      this.usersService,
    );
    this.specializationsController = new SpecializationsController(this.specializationsService);
    this.appointmentsController = new AppointmentsController(
      this.appointmentsService,
      this.usersService,
    );
    this.statusesController = new StatusesController();
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
