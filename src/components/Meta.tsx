import { useEffect } from 'react'
import type { MetaProps } from '../types/meta-props'

export default function Meta({
  title,
  description,
  image,
  structuredData,
}: MetaProps) {
  useEffect(() => {
    document.title = title

    const canonicalUrl = window.location.href

    // Description meta
    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)

    // Canonical link
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    const setMeta = (selector: string, attr: string, value: string) => {
      let m = document.querySelector(selector) as HTMLMetaElement | null
      if (!m) {
        m = document.createElement('meta')
        if (selector.startsWith('meta[')) {
          const match = selector.match(/\[(.*?)=['"](.*?)['"]\]/)
          if (match) {
            m.setAttribute(match[1], match[2])
          }
        }
        document.head.appendChild(m)
      }
      m.setAttribute(attr, value)
    }

    // Open Graph tags
    setMeta('meta[property="og:type"]', 'content', 'website')
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', canonicalUrl)
    if (image) {
      setMeta('meta[property="og:image"]', 'content', image)
    }

    // Twitter tags
    setMeta(
      'meta[name="twitter:card"]',
      'content',
      image ? 'summary_large_image' : 'summary'
    )
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    if (image) {
      setMeta('meta[name="twitter:image"]', 'content', image)
    }

    // Structured data
    if (structuredData) {
      const scriptId = 'structured-data'
      let script = document.getElementById(scriptId) as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = scriptId
        document.head.appendChild(script)
      }
      const data = { url: canonicalUrl, ...structuredData }
      script.textContent = JSON.stringify(data)
    }
  }, [title, description, image, structuredData])

  return null
}
