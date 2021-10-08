import express from 'express';
import { injector } from '../../../Injector';
import {
    authenticationMiddleware, checkIDMiddleware,
} from '../../helpers/middleware';

const router = express();
const appointmentsController = injector.getAppointmentsController;


router.post('/api/appointments', async (req, res, next) => {
    await authenticationMiddleware(req, res);
    next();
}, async (req, res) => {
    const result = await appointmentsController.createAppointment(req.userID, req.body);
    res.status(result.getStatus).json(result.getValue);
});

router.delete('/api/appointments/:id', async (req, res, next) => {
    await authenticationMiddleware(req, res);
    checkIDMiddleware(req, res, next);
}, async (req, res) => {
    const result = await appointmentsController.deleteAppointment(req.params.id);
    res.status(result.getStatus).json(result.getValue);
});

router.put('/api/appointments/:id', async (req, res, next) => {
    await authenticationMiddleware(req, res);
    checkIDMiddleware(req, res, next);
}, async (req, res) => {
    const result = await appointmentsController.updateAppointment(req.params.id, req.body, req.userID);
    res.status(result.getStatus).json(result.getValue);
});

router.get('/api/appointments/me', async (req, res, next) => {
    await authenticationMiddleware(req, res);
    next();
}, async (req, res) => {
    const result = await appointmentsController.getAppointments(req.userID, req.query.patientInfo);
    res.status(result.getStatus).json(result.getValue);
});

router.get('/api/appointments/patient/me', async (req, res, next) => {
    await authenticationMiddleware(req, res);
    next();
}, async (req, res) => {
    const result = await appointmentsController.getMyAppointments(req.userID);
    res.status(result.getStatus).json(result.getValue);
});

export default router;
