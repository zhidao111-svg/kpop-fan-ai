<script setup>
import { ref, nextTick } from 'vue'
import QuickPrompts from './components/QuickPrompts.vue'
import FavoritesPanel from './components/FavoritesPanel.vue'
import { chat } from './api/llm'
import { useFavorites } from './composables/useFavorites'

const input = ref('')
const loading = ref(false)
const messages = ref([])
const favOpen = ref(false)
const chatBody = ref(null)
const { favorites, isFavorite, toggleFavorite } = useFavorites()

// 快捷按钮：把 prompt 填入输入框，用户可改再发
function onQuickSelect(text) {
  input.value = text
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''

  const uid = Date.now()
  messages.value.push({ id: 'u' + uid, role: 'user', content: text })
  scrollBottom()

  loading.value = true
  try {
    const reply = await chat(text)
    messages.value.push({ id: 'a' + uid, role: 'assistant', content: reply })
    scrollBottom()
  } finally {
    loading.value = false
  }
}

function scrollBottom() {
  nextTick(() => {
    if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
  })
}
</script>

<template>
  <div class="app">
    <!-- 顶栏 -->
    <header class="head">
      <strong class="logo">🎧 K-Pop Fan AI Helper</strong>
      <button class="fav-entry" @click="favOpen = true">
        收藏<span class="badge">{{ favorites.length }}</span>
      </button>
    </header>

    <main class="chat">
      <!-- 空状态引导 -->
      <div v-if="messages.length === 0" class="empty">
        <div class="empty-icon">💜</div>
        <p>今天想为谁应援？</p>
        <span>点下面的快捷按钮，或直接输入问题</span>
      </div>

      <!-- 消息列表 -->
      <div ref="chatBody" class="chat-body">
        <div
          v-for="m in messages"
          :key="m.id"
          class="row"
          :class="m.role === 'user' ? 'is-user' : 'is-ai'"
        >
          <div class="bubble">{{ m.content }}</div>
          <button
            v-if="m.role === 'assistant'"
            class="fav-btn"
            :class="{ on: isFavorite(m.id) }"
            title="收藏/取消收藏"
            @click="toggleFavorite(m)"
          >{{ isFavorite(m.id) ? '★' : '☆' }}</button>
        </div>

        <div v-if="loading" class="row is-ai">
          <div class="bubble typing"><span>●</span><span>●</span><span>●</span></div>
        </div>
      </div>

      <!-- 底部输入区 -->
      <div class="composer">
        <QuickPrompts :on-select="onQuickSelect" />
        <div class="input-bar">
          <input
            v-model="input"
            placeholder="输入你想问的…（Enter 发送）"
            @keyup.enter="send"
          />
          <button class="send" :disabled="loading || !input.trim()" @click="send">发送</button>
        </div>
      </div>
    </main>

    <!-- 已收藏面板 -->
    <FavoritesPanel :open="favOpen" @close="favOpen = false" />
  </div>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 12px;
  border-bottom: 1px solid var(--line);
}
.logo { font-size: 17px; letter-spacing: .5px; }
.fav-entry {
  border: 1px solid var(--line);
  background: #fff;
  color: #6f4b6f;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.badge {
  background: var(--primary-soft);
  color: #fff;
  border-radius: 999px;
  min-width: 18px;
  text-align: center;
  font-size: 11px;
  padding: 0 4px;
}

.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--ink-2);
  text-align: center;
}
.empty-icon { font-size: 40px; }
.empty p { margin: 4px 0 0; font-size: 16px; color: var(--ink); }
.empty span { font-size: 13px; }

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.row { display: flex; align-items: flex-end; gap: 6px; }
.row.is-user { justify-content: flex-end; }
.row.is-ai { justify-content: flex-start; }

.bubble {
  max-width: 82%;
  padding: 10px 14px;
  border-radius: var(--radius);
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: var(--shadow);
}
.is-user .bubble {
  background: var(--primary-soft);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.is-ai .bubble {
  background: #fff;
  border-bottom-left-radius: 4px;
}

.fav-btn {
  border: none;
  background: none;
  color: #c9b8cd;
  font-size: 18px;
  line-height: 1;
  padding: 2px;
  transition: transform .18s ease;
}
.fav-btn:hover { transform: scale(1.2); }
.fav-btn.on { color: var(--mint); }

.typing { display: inline-flex; gap: 4px; }
.typing span {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--primary);
  animation: blink 1.2s infinite;
}
.typing span:nth-child(2) { animation-delay: .2s; }
.typing span:nth-child(3) { animation-delay: .4s; }
@keyframes blink { 0%,80%,100% { opacity: .2; } 40% { opacity: 1; } }

.composer { padding: 8px 0 16px; }
.input-bar {
  display: flex;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 6px 6px 18px;
}
.input-bar input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 15px;
  color: var(--ink);
}
.send {
  border: none;
  background: var(--primary);
  color: #fff;
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 14px;
  transition: opacity .18s ease;
}
.send:disabled { opacity: .5; cursor: not-allowed; }
</style>
