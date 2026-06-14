// Minimal Lexical (Payload richText) → HTML serializer.
// Handles paragraphs, headings, lists, quotes, links, and inline formatting.

const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const renderText = (node: any): string => {
  let text = escapeHtml(String(node.text ?? ''))
  const format = typeof node.format === 'number' ? node.format : 0
  if (format & IS_CODE) text = `<code>${text}</code>`
  if (format & IS_BOLD) text = `<strong>${text}</strong>`
  if (format & IS_ITALIC) text = `<em>${text}</em>`
  if (format & IS_UNDERLINE) text = `<u>${text}</u>`
  if (format & IS_STRIKETHROUGH) text = `<s>${text}</s>`
  return text
}

const renderChildren = (children: any[] | undefined): string =>
  (children ?? []).map(renderNode).join('')

const renderNode = (node: any): string => {
  if (!node) return ''
  switch (node.type) {
    case 'text':
      return renderText(node)
    case 'linebreak':
      return '<br />'
    case 'paragraph': {
      const inner = renderChildren(node.children)
      return inner ? `<p>${inner}</p>` : ''
    }
    case 'heading': {
      const tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag)
        ? node.tag
        : 'h3'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }
    case 'quote':
      return `<blockquote>${renderChildren(node.children)}</blockquote>`
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }
    case 'listitem':
      return `<li>${renderChildren(node.children)}</li>`
    case 'link': {
      const url = escapeHtml(String(node.fields?.url ?? node.url ?? '#'))
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${url}"${target}>${renderChildren(node.children)}</a>`
    }
    default:
      return renderChildren(node.children)
  }
}

export const renderRichText = (value: unknown): string => {
  const root = (value as any)?.root
  if (!root?.children) return ''
  return renderChildren(root.children)
}

export const richTextToPlain = (value: unknown, max = 200): string => {
  const root = (value as any)?.root
  if (!root) return ''
  const walk = (node: any): string => {
    if (node?.type === 'text') return String(node.text ?? '')
    return (node?.children ?? []).map(walk).join(' ')
  }
  const text = walk(root).replace(/\s+/g, ' ').trim()
  return text.length > max ? `${text.slice(0, max).trim()}…` : text
}
