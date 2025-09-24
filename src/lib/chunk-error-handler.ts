// Обработчик ошибок загрузки чанков
export function setupChunkErrorHandler() {
  if (typeof window === 'undefined') return

  // Обработчик для ошибок загрузки чанков
  window.addEventListener('error', (event) => {
    const error = event.error
    if (error && (
      error.name === 'ChunkLoadError' || 
      error.message?.includes('Loading chunk') ||
      error.message?.includes('ChunkLoadError')
    )) {
      console.warn('Chunk loading error detected, will reload page:', error)
      
      // Показываем уведомление пользователю
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f59e0b;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      `
      notification.textContent = 'Обновление приложения...'
      document.body.appendChild(notification)

      // Перезагружаем страницу через 2 секунды
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  })

  // Обработчик для unhandled promise rejections (часто содержат ChunkLoadError)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason
    if (error && (
      error.name === 'ChunkLoadError' || 
      error.message?.includes('Loading chunk') ||
      error.message?.includes('ChunkLoadError')
    )) {
      console.warn('Chunk loading error in promise rejection, will reload page:', error)
      
      // Показываем уведомление пользователю
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f59e0b;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      `
      notification.textContent = 'Обновление приложения...'
      document.body.appendChild(notification)

      // Перезагружаем страницу через 2 секунды
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  })
}

// Функция для принудительной очистки кэша и перезагрузки
export function forceReload() {
  if (typeof window === 'undefined') return
  
  // Очищаем localStorage от старых данных
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.includes('chunk') || key.includes('webpack'))) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
  
  // Перезагружаем страницу с очисткой кэша
  window.location.reload()
}
