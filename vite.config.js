import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages 部署：base 必须设置为 '/<仓库名>/'（前后带斜杠）
// 你的仓库名若是 kpop-fan-ai，这里就是 '/kpop-fan-ai/'
export default defineConfig({
  plugins: [vue()],
  base: '/kpop-fan-ai/'
})
