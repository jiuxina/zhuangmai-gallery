export default defineNuxtRouteMiddleware((to, from) => {
  const { currentUser, initAuth } = useAuth()
  const { showToast } = useToast()

  // 【关键修复】如果是在客户端环境，且状态为空，立即执行初始化逻辑恢复状态
  if (process.client && !currentUser.value) {
    initAuth()
  }

  // 如果经过尝试恢复后，用户依然未登录
  if (!currentUser.value) {
    if (process.client) {
      showToast('请先登录雅舍 (Qingj Denglu)', 'error')
    }
    // 带上 redirect 参数，方便登录后跳回原页面
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})