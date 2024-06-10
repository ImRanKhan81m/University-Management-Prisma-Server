import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { semesterRegistrationService } from './semesterRegistrations.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await semesterRegistrationService.insertIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Semester Registration created successfully',
    success: true,
    data: result,
  });
});

export const semesterRegistrationController = {
  insertIntoDb,
};
