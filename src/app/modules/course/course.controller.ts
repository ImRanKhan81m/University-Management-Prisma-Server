import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CourseService } from './course.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
};
