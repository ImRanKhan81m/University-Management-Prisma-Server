import express from 'express';
import auth from '../../middlewares/auth';
import { BuildingController } from './building.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BuildingController.createBuilding
);
router.get(
  '/',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BuildingController.getAllBuildings
);

export const BuildingRoutes = router;
