import { describe, it, expect } from 'vitest'
import { DIETARY_TAGS, MENU_COURSES } from './weddingMenu'

describe('wedding menu', () => {
  it('gives every course a name, a description, and at least one dietary tag', () => {
    for (const course of MENU_COURSES) {
      expect(course.name.trim()).not.toBe('')
      expect(course.description.trim()).not.toBe('')
      expect(course.tags.length).toBeGreaterThan(0)
    }
  })

  it('uses only tags from the documented set', () => {
    const documented = Object.keys(DIETARY_TAGS)
    for (const course of MENU_COURSES) {
      for (const tag of course.tags) {
        expect(documented).toContain(tag)
      }
    }
  })

  it('does not repeat a tag within a course', () => {
    for (const course of MENU_COURSES) {
      expect(new Set(course.tags).size).toBe(course.tags.length)
    }
  })
})
