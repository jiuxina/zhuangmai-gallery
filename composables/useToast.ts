export const useToast = () => {
  // 定义全局状态
  const toastState = useState('toast_state', () => ({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  }))

  let timer: NodeJS.Timeout | null = null

  // 显示提示的方法
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    // 如果有正在显示的，先清除定时器
    if (timer) clearTimeout(timer)

    toastState.value = {
      show: true,
      message,
      type
    }

    // 2秒后自动消失 (配合 x1.5 倍速，缩短展示时间)
    timer = setTimeout(() => {
      toastState.value.show = false
    }, 2000)
  }

  return {
    toastState,
    showToast
  }
}