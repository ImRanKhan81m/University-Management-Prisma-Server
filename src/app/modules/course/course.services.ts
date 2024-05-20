import prisma from '../../../shared/prisma';
import { Course } from '@prisma/client';

const createCourse = async (data: any): Promise<any> => {
  const { preRequisiteCourse, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const response = await transactionClient.course.create({
      data: courseData,
    });

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
};

export const CourseService = {
  createCourse,
};
