import { describe, it, expect } from 'vitest'
import { MENU_COURSES } from './weddingMenu'

describe('wedding menu', () => {
  it('lists every course with a name', () => {
    expect(MENU_COURSES.length).toBeGreaterThan(0)
    for (const course of MENU_COURSES) {
      expect(course.trim()).not.toBe('')
    }
  })

  it('does not repeat a course', () => {
    expect(new Set(MENU_COURSES).size).toBe(MENU_COURSES.length)
  })
})
