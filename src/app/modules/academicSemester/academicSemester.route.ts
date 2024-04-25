import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';

import express from 'express';
import { AcademicSemesterValidation } from './academicSemester.validation';
const router = express.Router();

router.get('/', AcademicSemesterController.getAllAcademicSemesters);
router.post(
  '/',
  validateRequest(AcademicSemesterValidation.create),
  AcademicSemesterController.AcademicSemesterCreate
);
router.get('/:id', AcademicSemesterController.getAcademicSemesterById);


export const AcademicSemesterRouter = router;
