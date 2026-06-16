import { describe, it, expect } from 'vitest'
import { parseGuestNames, isPlaceholderName } from './guestNames'

describe('parseGuestNames', () => {
  it('splits a two-guest party on " & "', () => {
    expect(parseGuestNames('Bingzhu Zhang & Douglass Henry', 2)).toEqual([
      'Bingzhu Zhang',
      'Douglass Henry',
    ])
  })

  it('splits on ", " and " and "', () => {
    expect(parseGuestNames('Ann Lee, Bob Fox and Cara Vue', 3)).toEqual([
      'Ann Lee',
      'Bob Fox',
      'Cara Vue',
    ])
  })

  it('returns one name for a single guest', () => {
    expect(parseGuestNames('Jane Smith', 1)).toEqual(['Jane Smith'])
  })

  it('pads with empty slots when fewer names than party size', () => {
    expect(parseGuestNames('Jane Smith', 2)).toEqual(['Jane Smith', ''])
  })

  it('truncates extra names to the party size', () => {
    expect(parseGuestNames('A & B & C', 2)).toEqual(['A', 'B'])
  })

  it('matches the count to Total Party even when empty', () => {
    expect(parseGuestNames('', 2)).toEqual(['', ''])
  })
})

describe('isPlaceholderName', () => {
  it('treats empty and generic tokens as placeholders', () => {
    expect(isPlaceholderName('')).toBe(true)
    expect(isPlaceholderName('Guest')).toBe(true)
    expect(isPlaceholderName('& Guest')).toBe(true)
    expect(isPlaceholderName('Guest 2')).toBe(true)
  })

  it('treats real names as known', () => {
    expect(isPlaceholderName('Bingzhu Zhang')).toBe(false)
    expect(isPlaceholderName('Douglass Henry')).toBe(false)
  })
})
