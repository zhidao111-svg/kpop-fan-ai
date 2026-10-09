// 外部大模型调用（OpenAI 兼容接口）
// 产品设计：纯前端 Demo，未配置密钥时自动走 Mock 兜底，
// 保证任何环境（本地 / GitHub Pages 在线）都能演示，且不会泄露密钥。
const BASE = import.meta.env.VITE_LLM_BASE_URL || ''
const KEY = import.meta.env.VITE_LLM_API_KEY || ''
const MODEL = import.meta.env.VITE_LLM_MODEL || 'gpt-4o-mini'

export async function chat(question) {
  // 未配置密钥 → Mock 模式
  if (!BASE || !KEY) {
    return mockReply(question)
  }
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: question }],
        temperature: 0.7
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data?.choices?.[0]?.message?.content || '（模型返回为空）'
  } catch (e) {
    // 提示原因，不中断对话体验
    return `⚠️ 调用失败：${e.message}。\n当前为纯前端 Demo，浏览器直调外部 API 可能受 CORS / 密钥限制。配置密钥后本地体验完整能力，或联系我切换 Mock。`
  }
}

// Mock 兜底：按场景返回示例文案，让 Demo 在任何环境都"可演示"
function mockReply(q) {
  const s = q || ''
  if (/应援|生日|出道|演唱会|祝福/.test(s)) {
    return `🎂 应援文案示例\n\n「在名为 {idol} 的光芒里，我们做你永远的回声。\n从出道到如今，每一次回归都值得被庆祝。\n今天，也一起走花路吧！💜」\n\n#idol #生日应援 #WeLoveYou`
  }
  if (/翻译|韩语|한국어|translate/.test(s)) {
    return '💬 翻译示例\n\n「오늘도 힘내자!」→ 「今天也要加油呀！」\n\n（当前为 Mock 示例，配置 API Key 后即可返回真实韩娱短文本翻译。）'
  }
  if (/偶像|介绍|回归|问答|团体/.test(s)) {
    return '✨ 偶像问答示例\n\n「ITZY 是 JYP 旗下女团，2019 年出道，五人组，代表作《WANNABE》《DALLA DALLA》。当前为 Mock 示例，配置 API Key 后可获取带时效的真实资讯。」'
  }
  return '👋 你好呀，我是 K-Pop Fan AI！\n\n当前为 Mock 模式（未配置 API Key）。试试点击下面的快捷按钮，或配置密钥体验完整能力。'
}
