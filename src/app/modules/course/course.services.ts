/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma'; 
import { ICourseCreateData } from './course.interface';

const createCourse = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourse, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const response = await transactionClient.course.create({
      data: courseData,
    });

    if(!response){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }

    if (preRequisiteCourse && preRequisiteCourse.length > 0) {
      for (let index = 0; index < preRequisiteCourse.length; index++) {
        const createPreRequisite =
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: response.id,
              preRequisiteId: preRequisiteCourse[index].courseId,
            },
          });
        console.log(createPreRequisite);
      }
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

export const CourseService = {
  createCourse,
};
