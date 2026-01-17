'use client'

import React from 'react'
import { items } from '@/app/items'
import Section from './section'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [activeId, setActiveId] = React.useState<string>()
  const ref = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  function onClick(id: string) {
    if (!ref.current) return

    const el = ref.current.querySelector(`h2[data-id="${id}"]`)

    if (!el) return

    setTimeout(() => {
      scrollIntoView(el, {
        scrollMode: 'if-needed',
        block: 'center',
        inline: 'center',
      })
    }, 100)
  }

  function onActiveIdChange(id: string) {
    setActiveId(id)
  }

  React.useEffect(() => {
    const newActiveId = window.location.hash.replace('#', '')
    if (newActiveId) {
      onClick(newActiveId)
    } else {
      const firstId = items[0]?.id
      if (firstId) {
        onClick(firstId)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex space-x-4">
      <ul className="sticky left-0 top-0 h-fit menu space-y-4">
        {items.map((item) => (
          <li key={item.id} className="w-[100px]">
            <a
              data-target={item.id}
              className={
                item.id === activeId
                  ? 'active cursor-pointer'
                  : 'cursor-pointer'
              }
              onClick={() => {
                onClick(item.id)
                router.replace(`#${item.id}`, { scroll: false })
              }}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div ref={ref}>
        {items.map((item) => (
          <Section
            key={item.id}
            item={item}
            onActiveIdChange={onActiveIdChange}
          />
        ))}
      </div>
    </div>
  )
}
