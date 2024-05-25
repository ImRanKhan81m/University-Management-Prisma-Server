import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CourseService } from './course.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { CourseFilterableFields } from './course.constant';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CourseFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await CourseService.getAllCourses(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CourseService.getCourseById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully',
    data: result,
  });
});

const updateCourseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await CourseService.updateCourseById(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CourseService.deleteCourseById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully',
    data: result,
  });
});

const assignFaculties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body.faculties;
console.log(data);
  const result = await CourseService.assignFaculties(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties assigned successfully',
    data: result,
  });
});

const removeFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body.faculties;

  const result = await CourseService.removeFaculty(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties removed successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourseById,
  assignFaculties,
  removeFaculty,
};
