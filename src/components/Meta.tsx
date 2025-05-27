import { useEffect } from 'react'

interface MetaProps {
  title: string
  description: string
}

export default function Meta({ title, description }: MetaProps) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }, [title, description])

  return null
}
