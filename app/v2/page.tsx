'use client'

import React from 'react'
import { items } from '@/app/items'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [activeId, setActiveId] = React.useState<string>()
  const observerRef = React.useRef<IntersectionObserver>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  const appNavbarHeight = 0

  function onScrollToSection(id: string) {
    const element = containerRef.current?.querySelector(
      `section[data-id="${id}"]`,
    )
    if (element) {
      scrollIntoView(element, {
        scrollMode: 'if-needed',
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      })
    }

    router.push(`#${id}`, { scroll: false })
  }

  React.useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newActiveId = entry.target.getAttribute('data-id') || ''
            setActiveId(newActiveId)
          }
        })
      },
      {
        rootMargin: `-${appNavbarHeight}px 0px -50% 0px`,
        threshold: 0.1,
      },
    )

    items.forEach((item) => {
      const element = containerRef.current?.querySelector(
        `section[data-id="${item.id}"]`,
      )
      if (element) {
        observer.observe(element)
      }
    })

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  React.useEffect(() => {
    const newActiveId = window.location.hash.replace('#', '')
    if (newActiveId) {
      onScrollToSection(newActiveId)
    } else {
      router.refresh()
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
              onClick={() => onScrollToSection(item.id)}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div ref={containerRef}>
        {items.map((item) => (
          <section key={item.id} data-id={item.id} className="py-[50px]">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            {item.content}
          </section>
        ))}
      </div>
    </div>
  )
}
