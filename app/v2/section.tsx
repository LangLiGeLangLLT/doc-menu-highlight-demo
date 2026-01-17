'use client'

import React from 'react'
import { Item } from '@/app/items'

export default function Section({
  item,
  onActiveIdChange,
}: {
  item: Item
  onActiveIdChange: (id: string) => void
}) {
  const ref = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (!ref.current) return

    const appNavbarHeight = 0
    const observer: IntersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((entry) => entry.isIntersecting)
        if (entry) {
          const id = entry.target.getAttribute('data-id')
          if (id) {
            onActiveIdChange(id)
          }
        }
      },
      { rootMargin: `-${appNavbarHeight}px 0px 0px` },
    )
    const el = ref.current
    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="py-[50px]">
      <h2 ref={ref} data-id={item.id} className="text-2xl font-bold">
        {item.name}
      </h2>
      {item.content}
    </section>
  )
}
