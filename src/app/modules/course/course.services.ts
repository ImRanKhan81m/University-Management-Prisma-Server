/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import {
  ICourseCreateData,
  ICourseFilterRequest,
  IPrerequisiteCourseRequest,
} from './course.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { Course, CourseFaculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { CourseSearchableFields } from './course.constant';
import { asyncForEach } from '../../../shared/utils';

const createCourse = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourse, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const response = await transactionClient.course.create({
      data: courseData,
    });

    if (!response) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }

    if (preRequisiteCourse && preRequisiteCourse.length > 0) {
      await asyncForEach(
        preRequisiteCourse,
        async (preRequisiteCourses: IPrerequisiteCourseRequest) => {
          const createPreRequisite =
            await transactionClient.courseToPrerequisite.create({
              data: {
                courseId: response.id,
                preRequisiteId: preRequisiteCourses.courseId,
              },
            });
          console.log(createPreRequisite);
        }
      );
    }
    return response;
  });

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequiste: {
          include: {
            preRequisite: true,
          },
        },
        preRequisteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
};

const getAllCourses = async (
  filters: ICourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: CourseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.course.findMany({
    include: {
      preRequiste: {
        include: {
          preRequisite: true,
        },
      },
      preRequisteFor: {
        include: {
          course: true,
        },
      },
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.academicSemester.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getCourseById = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    include: {
      preRequiste: {
        include: {
          preRequisite: true,
        },
      },
      preRequisteFor: {
        include: {
          course: true,
        },
      },
    },
    where: {
      id,
    },
  });

  return result;
};

const updateCourseById = async (
  id: string,
  data: ICourseCreateData
): Promise<Course | null> => {
  const { preRequisiteCourse, ...courseData } = data;

  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.update({
      where: {
        id,
      },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');
    }

    if (preRequisiteCourse && preRequisiteCourse.length > 0) {
      const deletePreRequisite = preRequisiteCourse.filter(
        coursePreRequisite =>
          coursePreRequisite.courseId && coursePreRequisite.isDeleted
      );

      const newPreRequisite = preRequisiteCourse.filter(
        coursePreRequisite =>
          coursePreRequisite.courseId && !coursePreRequisite.isDeleted
      );

      await asyncForEach(
        deletePreRequisite,
        async (deletePreCourse: IPrerequisiteCourseRequest) => {
          await transactionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  preRequisiteId: deletePreCourse.courseId,
                },
              ],
            },
          });
        }
      );

      await asyncForEach(
        newPreRequisite,
        async (insertPreRequisite: IPrerequisiteCourseRequest) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: id,
              preRequisiteId: insertPreRequisite.courseId,
            },
          });
        }
      );
    }

    return result;
  });

  const responseData = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequiste: {
        include: {
          preRequisite: true,
        },
      },
      preRequisteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  return responseData;
};

const deleteCourseById = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.delete({
    where: {
      id,
    },
  });

  return result;
};

const assignFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(facultyId => ({
      courseId: id,
      facultyId,
    })),
  });

  const assignFacultyData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultyData;
};

const removeFaculty = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: payload,
      },
    },
  });

  const assignFacultyData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultyData;
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourseById,
  updateCourseById,
  assignFaculties,
  removeFaculty,
};
