import { Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.services';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemester } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick'; 
import { AcademicSemesterFilterAbleFileds } from './academicSemester.constant';

const AcademicSemesterCreate = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AcademicSemesterService.createAcademicSemester(
      req.body
    );

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester created successfully',
      data: result,
    });
  }
);

const getAllAcademicSemesters = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, AcademicSemesterFilterAbleFileds);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    console.log(filters, options);

    const result = await AcademicSemesterService.getAllAcademicSemesters(
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semesters fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAcademicSemesterById = catchAsync(
  async (req: Request, res: Response) => {
    const academicSemester =
      await AcademicSemesterService.getAcademicSemesterById(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester fetched successfully',
      data: academicSemester,
    });
  }
);

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AcademicSemesterService.updateOneInDB(id, req.body);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semster updated successfully',
      data: result
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AcademicSemesterService.deleteByIdFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semster delete successfully',
      data: result
  });
});

export const AcademicSemesterController = {
  AcademicSemesterCreate,
  getAllAcademicSemesters,
  getAcademicSemesterById,
  updateOneInDB,
  deleteByIdFromDB,
};
