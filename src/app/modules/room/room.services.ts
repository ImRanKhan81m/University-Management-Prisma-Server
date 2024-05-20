/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Room } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IRoomFilterRequest } from './room.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { RoomSearchableFields } from './room.constant';

const createRoom = async (data: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data,
    include: { building: true },
  });

  return result;
};

const getAllRooms = async (
  filters: IRoomFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: RoomSearchableFields.map(field => ({
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

  const whereConditions: Prisma.RoomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.room.findMany({
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

const getRoomsById = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: {
      id,
    },
    include: { building: true },
  });

  return result;
};

const updateRoom = async (id: string, data: Room): Promise<Room> => {
  const result = await prisma.room.update({
    where: {
      id,
    },
    data,
    include: { building: true },
  });

  return result;
};

const deleteRoom = async (id: string): Promise<Room> => {
  const result = await prisma.room.delete({
    where: {
      id,
    },
  });

  return result;
};

export const RoomService = {
  createRoom,
  getAllRooms,
  getRoomsById,
  updateRoom,
  deleteRoom,
};
