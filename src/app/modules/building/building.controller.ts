import { Request, Response } from 'express';
import { BuildingService } from './building.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { buildingFilterableFields } from './building.constants';
import pick from '../../../shared/pick';

const createBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.createBuilding(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building created successfully',
    data: result,
  });
});

const getAllBuildings = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await BuildingService.getAllBuildings(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getBuildingById = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.getBuildingById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building fetched successfully',
    data: result,
  });
} );

const updateBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.updateBuilding(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building updated successfully',
    data: result,
  });
});

const deleteBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.deleteBuilding(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building deleted successfully',
    data: result,
  });
});

export const BuildingController = {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  
};
