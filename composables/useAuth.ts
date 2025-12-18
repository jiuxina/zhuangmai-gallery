export const useAuth = () => {
  // 全局状态
  const currentUser = useState<any>('user', () => null)
  
  // 初始化逻辑：从本地存储找回登录态
  const initAuth = () => {
    // 只有在客户端浏览器环境下才能访问 localStorage
    if (process.client) {
      // 如果内存状态已经有了，就不重复操作
      if (currentUser.value) return
      
      const stored = localStorage.getItem('current_session')
      if (stored) {
        try {
          currentUser.value = JSON.parse(stored)
          console.log('✅ 用户状态已从本地存储恢复')
        } catch (e) {
          console.error('❌ 解析本地登录信息失败', e)
          localStorage.removeItem('current_session')
        }
      }
    }
  }

  // 注册逻辑
  const register = async (username: string, pass: string) => {
    try {
      const data = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { username, password: pass }
      })
      return data
    } catch (e: any) {
      throw new Error(e.data?.message || '注册失败')
    }
  }

  // 登录逻辑
  const login = async (username: string, pass: string) => {
    try {
      const data: any = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password: pass }
      })

      if (data.success && data.user) {
        // 更新内存中的全局状态
        currentUser.value = data.user
        // 同步到本地存储，用于下次刷新页面时恢复
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
    // 退出后清空状态并跳转
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