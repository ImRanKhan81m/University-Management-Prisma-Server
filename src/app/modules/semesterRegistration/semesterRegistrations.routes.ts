import express from 'express';
import { semesterRegistrationController } from './semesterRegistrations.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validations';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', semesterRegistrationController.getAllFromDB);
router.get('/:id', semesterRegistrationController.getByIdFromDB);
router.post('/', semesterRegistrationController.insertIntoDb);
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
