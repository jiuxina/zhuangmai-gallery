export const useAuth = () => {
  // 全局状态：当前用户
  const currentUser = useState<any>('user', () => null)
  
  // 初始化：应用启动时检查是否有本地缓存的登录态
  const initAuth = () => {
    if (process.client) {
      const stored = localStorage.getItem('current_session')
      if (stored) {
        currentUser.value = JSON.parse(stored)
      }
    }
  }

  // 注册逻辑 (模拟)
  const register = (username: string, pass: string) => {
    if (!process.client) return
    
    // 获取已有用户列表
    const users = JSON.parse(localStorage.getItem('users_db') || '[]')
    
    // 检查重名
    if (users.find((u: any) => u.username === username)) {
      throw new Error('该用户名已被使用 (Gai mingz hauh ciuh)')
    }

    // 保存新用户
    const newUser = { id: Date.now(), username, pass } // 仅演示，实际不要存明文密码
    users.push(newUser)
    localStorage.setItem('users_db', JSON.stringify(users))
    return true
  }

  // 登录逻辑 (模拟)
  const login = (username: string, pass: string) => {
    if (!process.client) return

    const users = JSON.parse(localStorage.getItem('users_db') || '[]')
    const user = users.find((u: any) => u.username === username && u.pass === pass)

    if (user) {
      // 登录成功，保存会话
      // 去掉密码再存入会话状态
      const { pass, ...safeUser } = user
      currentUser.value = safeUser
      localStorage.setItem('current_session', JSON.stringify(safeUser))
      return true
    } else {
      throw new Error('用户名或密码错误 (Cwnghhoh loh)')
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