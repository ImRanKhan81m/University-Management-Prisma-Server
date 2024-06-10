import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { semesterRegistrationService } from './semesterRegistrations.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constants';
import pick from '../../../shared/pick';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await semesterRegistrationService.insertIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Semester Registration created successfully',
    success: true,
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, semesterRegistrationFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await semesterRegistrationService.getAllFromDB(filters, options);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistrations fetched successfully',
      meta: result.meta,
      data: result.data
  });
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await semesterRegistrationService.getByIdFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration fetched successfully',
      data: result
  });
})

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await semesterRegistrationService.updateOneInDB(id, req.body);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration updated successfully',
      data: result
  });
})


const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await semesterRegistrationService.deleteByIdFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration deleted successfully',
      data: result
  });
})

export const semesterRegistrationController = {
  insertIntoDb,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB
};
