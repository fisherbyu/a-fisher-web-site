import 'server-only';
import { PrismaClient } from '@prisma/client';
import { isProd } from '@/lib';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (!isProd) globalForPrisma.prisma = prisma;
