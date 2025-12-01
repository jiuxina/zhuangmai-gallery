
export const useAuth = () => {
  // 全局状态
  const currentUser = useState<any>('user', () => null)
  
  // 初始化：依然检查本地是否有登录态（保持登录状态）
  const initAuth = () => {
    if (process.client) {
      const stored = localStorage.getItem('current_session')
      if (stored) {
        currentUser.value = JSON.parse(stored)
      }
    }
  }

  // 注册逻辑 (升级为调用 API)
  const register = async (username: string, pass: string) => {
    try {
      const data = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { username, password: pass }
      })
      return data
    } catch (e: any) {
      // 抛出错误信息给前端页面显示
      throw new Error(e.data?.message || '注册失败')
    }
  }

  // 登录逻辑 (升级为调用 API)
  const login = async (username: string, pass: string) => {
    try {
      const data: any = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password: pass }
      })

      if (data.success && data.user) {
        // 更新全局状态
        currentUser.value = data.user
        // 本地存储 Session (仅用于保持刷新后不掉线)
        if (process.client) {
          localStorage.setItem('current_session', JSON.stringify(data.user))
        }
        return true
      }
    } catch (e: any) {
      throw new Error(e.data?.message || '登录失败')
    }
  }

  // 退出登录
  const logout = () => {
    currentUser.value = null
    if (process.client) {
      localStorage.removeItem('current_session')
    }
    navigateTo('/login')
  }

  return {
    currentUser,
    initAuth,
    register,
    login,
    logout
  }
}