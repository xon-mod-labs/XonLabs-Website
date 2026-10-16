import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js/lib/common';
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) {
  if (typeof value !== 'string') return '#';
  if (/^\/(?!\/)/.test(value) || /^#[\w-]*$/.test(value)) return value;
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : '#'; } catch { return '#'; }
}
export function markdown(source) {
  return sanitizeHtml(marked.parse(source || ''), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'details', 'summary']),
    allowedAttributes: {a: ['href','title'], img: ['src','alt','title'], code: ['class'], th: ['align'], td: ['align']},
    allowedSchemes: ['https'], allowProtocolRelative: false,
    transformTags: {a: (tag, attrs) => ({tagName:tag, attribs:{...attrs, href:safeUrl(attrs.href)}})},
  }).replace(/<pre><code(?: class="language-([\w-]+)")?>([\s\S]*?)<\/code><\/pre>/g, (all, language, content) => {
    if (!language || !hljs.getLanguage(language)) return all;
    const plain = content.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
    return `<pre><code class="hljs language-${language}">${hljs.highlight(plain, {language}).value}</code></pre>`;
  });
}
export const published = projects => projects.filter(p => p.published);
