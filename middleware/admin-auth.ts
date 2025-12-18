
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const adminToken = useCookie('admin_token');
    
    if (to.path.startsWith('/admin')) {
      if (adminToken.value !== 'zhuangmai2024') {
        const password = prompt('请输入管理员密码:');
        if (password === 'zhuangmai2024') {
          adminToken.value = password;
        } else {
          alert('密码错误！');
          return navigateTo('/');
        }
      }
    }
  }
});
