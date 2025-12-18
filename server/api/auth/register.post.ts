
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({ statusCode: 400, message: "用户名和密码不能为空" });
  }

  try {
    // 1. 检查用户名是否存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw createError({ statusCode: 409, message: "该名号已被注册 (Mingz hauh ciuh)" });
    }

    // 2. 创建新用户数据
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // 3. 关联该用户之前已经存在的作品
    await prisma.community_gallery.updateMany({
      where: {
        user_name: username,
        owner_id: null,
      },
      data: {
        owner_id: newUser.id,
      },
    });

    return { success: true, user: { id: newUser.id, username: newUser.username } };

  } catch (error) {
    // @ts-ignore
    if (error.statusCode === 409) {
      throw error;
    }
    console.error(error);
    throw createError({ statusCode: 500, message: "服务器内部错误" });
  } finally {
    await prisma.$disconnect();
  }
});
