export default defineNuxtRouteMiddleware((to, from) => {
  const { currentUser } = useAuth()
  const { showToast } = useToast() // 引入提示

  // 如果用户未登录
  if (!currentUser.value) {
    if (process.client) {
        showToast('请先登录雅舍 (Qingj Denglu)', 'error')
    }
    // 【核心】带上 redirect 参数
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})