import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW 注册成功:', registration.scope)
      })
      .catch((error) => {
        console.warn('⚠️ SW 注册失败（不影响使用）:', error)
      })
  })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker 已更新，页面即将刷新...')
    window.location.reload()
  })
}

if (window.localStorage) {
  const keys = ['sports-favorites', 'sports-recent', 'sports-timer-history', 'sports-schedule', 'sports-usage-stats']
  keys.forEach(key => {
    try {
      if (!localStorage.getItem(key)) {
        console.log(`📦 初始化存储: ${key}`)
      }
    } catch (e) {
      console.warn(`⚠️ localStorage 不可用:`, e)
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
