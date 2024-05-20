import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { RoomService } from './room.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { RoomFilterableFields } from './room.constant';

const createRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.createRoom(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Room created successfully',
    data: result,
  });
});

const getAllRooms = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, RoomFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']); 

  const result = await RoomService.getAllRooms(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rooms fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getRoomsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await RoomService.getRoomsById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room fetched successfully',
    data: result,
  });
});

const updateRoom = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await RoomService.updateRoom(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room updated successfully',
    data: result,
  });
});

const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await RoomService.deleteRoom(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully',
    data: result,
  });
});

export const RoomController = {
  createRoom,
  getAllRooms,
  getRoomsById,
  updateRoom,
  deleteRoom,
};
