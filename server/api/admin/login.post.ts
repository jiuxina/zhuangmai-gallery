
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { password } = body;

  if (password === 'zhuangmai2024') {
    // 设置管理员 Cookie，有效期 1 天
    setCookie(event, 'admin_token', 'valid_session', {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: '/'
    });
    return { success: true };
  } else {
    throw createError({ statusCode: 401, message: "密码错误" });
  }
});
