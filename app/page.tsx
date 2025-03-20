'use client'

import React from 'react'
import { items } from './items'
import { throttle } from 'lodash-es'

export default function Page() {
  const menuItems = React.useRef<HTMLAnchorElement[]>([])
  const sections = React.useRef<HTMLElement[]>([])

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    sections.current.forEach((section, index) => {
      const prevSection = sections.current[index - 1]
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      // 判断标题是否在视口中
      if (sectionTop <= scrollTop && scrollTop < sectionTop + sectionHeight) {
        // 找到对应的菜单项并高亮
        const menuItem = document.querySelector(`[data-target="${section.id}"]`)
        if (menuItem) {
          menuItems.current.forEach((item) => item.classList.remove('active'))
          menuItem.classList.add('active')
        }
        return
      }
      if (
        prevSection &&
        prevSection.offsetTop + prevSection.offsetHeight <= scrollTop &&
        scrollTop < sectionTop
      ) {
        // 找到对应的菜单项并高亮
        const menuItem = document.querySelector(`[data-target="${section.id}"]`)
        if (menuItem) {
          menuItems.current.forEach((item) => item.classList.remove('active'))
          menuItem.classList.add('active')
        }
      }
    })
  }

  React.useEffect(() => {
    menuItems.current = Array.from(document.querySelectorAll('[data-target]'))
    sections.current = Array.from(document.querySelectorAll('section'))

    handleScroll()

    const onScroll = throttle(handleScroll, 100)

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
              href={`#${item.id}`}
              data-target={item.id}
              onClick={(e) => {
                e.preventDefault()
                const target = document.querySelector(
                  `#${(e.target as HTMLAnchorElement).dataset.target}`
                )
                target?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="space-y-[100px]">
        {items.map((item) => (
          <section key={item.id} id={item.id} className="section">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            {item.content}
          </section>
        ))}
      </div>
    </div>
  )
}
