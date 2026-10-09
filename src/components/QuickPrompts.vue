<script setup>
// 场景快捷 Prompt 按钮组：降低首用门槛，引导用户快速体验 Agent 能力
const prompts = [
  { key: 'cheer', label: '🧡 应援文案', text: '帮我写一段给 ITZY 的回归应援文案，语气活泼韩系，结尾带 3 个 hashtag。' },
  { key: 'translate', label: '💬 韩娱翻译', text: '请把下面这段韩语翻译成自然、口语化的中文（保留粉丝语境）：' },
  { key: 'qa', label: '✨ 偶像问答', text: '用简洁的方式介绍一下 ITZY 的成员和近期回归情况。' }
]

const props = defineProps({
  onSelect: { type: Function, required: true }
})

function handleClick(p) {
  props.onSelect(p.text)
}
</script>

<template>
  <div class="quick-prompts" role="group" aria-label="快捷场景">
    <button
      v-for="p in prompts"
      :key="p.key"
      class="chip"
      type="button"
      @click="handleClick(p)"
    >
      {{ p.label }}
    </button>
  </div>
</template>

<style scoped>
.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0 10px;
}
.chip {
  border: 1px solid var(--line);
  background: #fff;
  color: #6f4b6f;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  transition: all .18s ease;
}
.chip:hover {
  background: var(--primary-soft);
  border-color: var(--primary-soft);
  color: #fff;
  transform: translateY(-1px);
}
</style>
