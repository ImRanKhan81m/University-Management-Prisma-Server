import { SemesterRegistration } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.create({
    data: data,
  });
  return result;
};

export const semesterRegistrationService = {
  insertIntoDb,
};
