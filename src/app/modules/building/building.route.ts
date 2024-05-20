import express from 'express';
import auth from '../../middlewares/auth';
import { BuildingController } from './building.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingValidation } from './building.validation';
const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(BuildingValidation.create),
  BuildingController.createBuilding
);
router.get(
  '/',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BuildingController.getAllBuildings
);
router.get(
  '/:id',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BuildingController.getBuildingById
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(BuildingValidation.update),
  BuildingController.updateBuilding
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BuildingController.deleteBuilding
);


export const BuildingRoutes = router;
