// TODO: Properly test BitString
import { BitString } from "../src/BitString"

test('AND', () => {
    const one = new BitString('1');
    const two = new BitString('1');

    expect(one.and(two).toString()).toBe('1');
})

test('AND', () => {
    const one = new BitString('0');
    const two = new BitString('1');

    expect(one.and(two).toString()).toBe('0');
})

test('AND', () => {
    const one = new BitString('1');
    const two = new BitString('0');

    expect(one.and(two).toString()).toBe('0');
})

test('AND', () => {
    const one = new BitString('0');
    const two = new BitString('0');

    expect(one.and(two).toString()).toBe('0');
})