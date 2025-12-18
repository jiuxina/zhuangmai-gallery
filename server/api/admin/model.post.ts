
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { model, action, data, id, page = 1, pageSize = 20 } = body;
  const adminPassword = getCookie(event, 'admin_token');

  // 简单的安全检查
  if (adminPassword !== 'zhuangmai2024') {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // @ts-ignore
  const dbModel = prisma[model];

  if (!dbModel) {
    throw createError({ statusCode: 400, message: `Model ${model} not found` });
  }

  try {
    if (action === 'list') {
      const [total, items] = await Promise.all([
        dbModel.count(),
        dbModel.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { id: 'desc' }
        })
      ]);
      return { total, items };
    } 
    
    else if (action === 'update') {
      // 过滤掉不能更新的字段（如 id）
      const { id: _, ...updateData } = data;
      return await dbModel.update({
        where: { id },
        data: updateData
      });
    } 
    
    else if (action === 'delete') {
      return await dbModel.delete({
        where: { id }
      });
    }
    
    else if (action === 'create') {
      return await dbModel.create({
        data: data
      });
    }

  } catch (error: any) {
    console.error(error);
    throw createError({ statusCode: 500, message: error.message });
  } finally {
    await prisma.$disconnect();
  }
});
