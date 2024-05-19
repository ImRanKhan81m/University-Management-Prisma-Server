import { Building, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IBuildingFilterRequest } from './building.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingSearchableFields } from './building.constants';
import { IGenericResponse } from '../../../interfaces/common';

const createBuilding = async (data: Building) => {
  return await prisma.building.create({ data });
};

const getAllBuildings = async (
  filters: IBuildingFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: buildingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.building.findMany({
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

  const total = await prisma.building.count();

  return {
    meta: {
      page,
      total,
      limit,
    },
    data: result,
  };
};

export const BuildingService = {
  createBuilding,
  getAllBuildings,
};
