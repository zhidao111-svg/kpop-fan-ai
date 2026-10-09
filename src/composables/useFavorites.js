// 对话本地收藏：存入 localStorage，刷新不丢失，多个组件共享同一份状态
import { ref, watch } from 'vue'

const STORAGE_KEY = 'kpop-fan-ai:favorites'

const favorites = ref(load())

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

watch(favorites, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useFavorites() {
  const isFavorite = (id) => favorites.value.some((f) => f.id === id)

  function toggleFavorite(msg) {
    const idx = favorites.value.findIndex((f) => f.id === msg.id)
    if (idx >= 0) {
      favorites.value.splice(idx, 1) // 取消收藏
    } else {
      favorites.value.unshift({      // 新收藏插到最前
        id: msg.id,
        role: msg.role,
        content: msg.content,
        time: msg.time || Date.now()
      })
    }
  }

  function removeFavorite(id) {
    const idx = favorites.value.findIndex((f) => f.id === id)
    if (idx >= 0) favorites.value.splice(idx, 1)
  }

  return { favorites, isFavorite, toggleFavorite, removeFavorite }
}
