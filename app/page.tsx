'use client'

import React from 'react'
import { items } from './items'
import { debounce } from 'lodash-es'

export default function Page() {
  const sections = React.useRef<HTMLElement[]>([])
  const [activeId, setActiveId] = React.useState<string>()

  function handleScroll() {
    const scrollPosition = window.scrollY

    let currentActiveId: string | undefined

    sections.current.forEach((section) => {
      if (
        section.offsetTop <= scrollPosition &&
        scrollPosition < section.offsetTop + section.offsetHeight
      ) {
        currentActiveId = section.id
      }
    })

    if (currentActiveId !== activeId) {
      setActiveId(currentActiveId)
    }
  }

  const onClick = debounce((e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(
      `#${(e.target as HTMLAnchorElement).dataset.target}`
    )

    target?.scrollIntoView({ behavior: 'smooth' })
  }, 10)

  React.useEffect(() => {
    sections.current = Array.from(document.querySelectorAll('section'))

    handleScroll()

    const onScroll = debounce(handleScroll, 10)

    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
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
              onClick={onClick}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div>
        {items.map((item) => (
          <section key={item.id} id={item.id} className="py-[50px] section">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            {item.content}
          </section>
        ))}
      </div>
    </div>
  )
}
