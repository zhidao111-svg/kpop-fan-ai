<script setup>
import { useFavorites } from '../composables/useFavorites'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const { favorites, removeFavorite } = useFavorites()

function copyText(text) {
  navigator.clipboard?.writeText(text)
}
</script>

<template>
  <div v-if="open" class="fav-overlay" @click.self="emit('close')">
    <aside class="fav-panel">
      <div class="fav-head">
        <h3>💜 已收藏</h3>
        <button class="close" @click="emit('close')">×</button>
      </div>

      <div v-if="favorites.length === 0" class="fav-empty">
        还没有收藏。遇到喜欢的文案，点消息旁的 ★ 收藏吧~
      </div>

      <ul class="fav-list">
        <li v-for="f in favorites" :key="f.id" class="fav-item">
          <p class="fav-content">{{ f.content }}</p>
          <div class="fav-actions">
            <button @click="copyText(f.content)">复制</button>
            <button class="del" @click="removeFavorite(f.id)">取消收藏</button>
          </div>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.fav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(46, 42, 51, .25);
  display: flex;
  justify-content: flex-end;
  z-index: 30;
}
.fav-panel {
  width: 340px;
  max-width: 92vw;
  height: 100%;
  background: var(--bg);
  padding: 18px;
  overflow-y: auto;
}
.fav-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.fav-head h3 { margin: 0; font-size: 16px; }
.close {
  border: none;
  background: none;
  font-size: 22px;
  color: var(--ink-2);
  line-height: 1;
}
.fav-empty { color: var(--ink-2); font-size: 14px; margin-top: 24px; text-align: center; }
.fav-list { list-style: none; padding: 0; margin: 0; }
.fav-item {
  background: #fff;
  border-radius: var(--radius);
  padding: 12px;
  margin: 8px 0;
  box-shadow: var(--shadow);
}
.fav-content {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--ink);
  white-space: pre-wrap;
  word-break: break-word;
}
.fav-actions button {
  margin-right: 8px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: #6f4b6f;
  padding: 3px 10px;
  font-size: 12px;
}
.fav-actions .del { color: var(--ink-2); }
</style>
