// TODO: Properly test BitString
import { BitString } from "../src/BitString"

test('AND', () => {
    const one = BitString.from('1');
    const two = BitString.from('1');

    expect(one.and(two).toString()).toBe('1');
})

test('AND', () => {
    const one = BitString.from('0');
    const two = BitString.from('1');

    expect(one.and(two).toString()).toBe('0');
})

test('AND', () => {
    const one = BitString.from('1');
    const two = BitString.from('0');

    expect(one.and(two).toString()).toBe('0');
})

test('AND', () => {
    const one = BitString.from('0');
    const two = BitString.from('0');

    expect(one.and(two).toString()).toBe('0');
})