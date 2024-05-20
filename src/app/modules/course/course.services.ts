import prisma from '../../../shared/prisma';
import { Course } from '@prisma/client';

const createCourse = async (data: Course): Promise<Course> => {
  const response = await prisma.course.create({
    data,
  });
  return response;
};

export const CourseService = {
  createCourse,
};
