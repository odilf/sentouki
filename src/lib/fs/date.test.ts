import { expect, test } from 'vitest'
import { displayDateRange } from './date'

const d2 = new Date("Oct 5 2001")

test('different years', () => {
	expect(displayDateRange({ first: d2, last: new Date("2169") })).toBe("2001-2169")
})

test('different years with <10 delta', () => {
	expect(displayDateRange({ first: d2, last: new Date("Aug 8 2004") })).toBe("2001-04")
})

test('same year different month', () => {
	expect(displayDateRange({ first: d2, last: new Date("Dec 2001") })).toBe("Oct-Dec 2001")
})

test('same month different day', () => {
	expect(displayDateRange({ first: d2, last: new Date("Oct 12 2001") })).toBe("Oct 05-12, 2001")
})

test('single date', () => {
	expect(displayDateRange({ first: d2, last: d2 })).toBe("Oct 05, 2001")
})
