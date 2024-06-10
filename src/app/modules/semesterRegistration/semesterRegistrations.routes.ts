import express from 'express';
import { semesterRegistrationController } from './semesterRegistrations.controller';

const router = express.Router();

router.post('/', semesterRegistrationController.insertIntoDb);

export const semesterRegistrationRoutes = router;
