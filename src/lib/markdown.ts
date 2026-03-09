import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.use({
  gfm: true,
  breaks: true,
})

export function renderMarkdown(markdown: string) {
  const html = marked.parse(markdown) as string
  return DOMPurify.sanitize(html)
}
