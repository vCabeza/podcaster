import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'a',
  'ul',
  'ol',
  'li',
]

const ALLOWED_ATTR = ['href', 'title', 'target', 'rel']

/**
 * Sanitizes HTML from external episode descriptions before rendering.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })
}
