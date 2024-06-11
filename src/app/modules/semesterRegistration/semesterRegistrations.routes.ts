import express from 'express';
import { semesterRegistrationController } from './semesterRegistrations.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validations';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/get-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.getMyRegistration
);
router.get(
  '/get-my-semester-courses',
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.getMySemesterRegCouses
);
router.get('/', semesterRegistrationController.getAllFromDB);
router.get('/:id', semesterRegistrationController.getByIdFromDB);

router.post('/', semesterRegistrationController.insertIntoDb);
router.post(
  '/start-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.startMyRegistration
);
router.post(
  '/enroll-into-course',
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.enrollIntoCourse
);

router.post(
  '/withdraw-from-course',
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.withdrawFromCourse
);
router.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.confirmMyRegistration
);
router.post(
  '/:id/start-new-semester',
  auth(ENUM_USER_ROLE.ADMIN),
  semesterRegistrationController.startNewSemester
);
router.patch(
  '/:id',
  validateRequest(SemesterRegistrationValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  semesterRegistrationController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  semesterRegistrationController.deleteByIdFromDB
);

export const semesterRegistrationRoutes = router;
