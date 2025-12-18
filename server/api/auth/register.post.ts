import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({ statusCode: 400, message: "用户名和密码不能为空" });
  }

  const INITIAL_POINTS = 2000; // 注册赠送 2000 积分

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw createError({ statusCode: 409, message: "该名号已被注册" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 事务处理：创建用户 + 写入积分日志
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          points: INITIAL_POINTS,
        },
      });

      await tx.pointLog.create({
        data: {
          user_id: user.id,
          amount: INITIAL_POINTS,
          type: 'income',
          reason: '新用户注册：锦绣基金奖励'
        }
      });

      return user;
    });

    // 关联旧作品
    await prisma.community_gallery.updateMany({
      where: { user_name: username, owner_id: { not: newUser.id } },
      data: { owner_id: newUser.id },
    });

    return { success: true, user: { id: newUser.id, username: newUser.username } };
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || "注册失败" });
  } finally {
    await prisma.$disconnect();
  }
});