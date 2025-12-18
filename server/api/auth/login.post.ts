
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
    // 1. 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw createError({ statusCode: 401, message: "用户不存在 (Boux mbouj miz)" });
    }

    // 2. 比对密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError({ statusCode: 401, message: "密码错误 (Miemaj mbouj doengz)" });
    }

    // 3. 登录成功，更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { last_sign_in: new Date() },
    });
    
    // 4. 登录成功，返回用户信息（不含密码）
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        points: user.points,
        balance: user.balance,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      }
    };

  } catch (error) {
    // @ts-ignore
    if (error.statusCode === 401 || error.statusCode === 400) {
      throw error;
    }
    console.error(error);
    throw createError({ statusCode: 500, message: "服务器内部错误" });
  } finally {
    await prisma.$disconnect();
  }
});
