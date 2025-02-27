// TODO: Properly test BitString
import { BitString } from "../src/BitString"

test('high(1)', () => {
    const str = BitString.high(1);

    expect(str.getWidth()).toBe(1);
    expect(str.toString()).toBe('1');
});

test('high(4)', () => {
    const str = BitString.high(4);

    expect(str.getWidth()).toBe(4);
    expect(str.toString()).toBe('1111');
});

test('high(8)', () => {
    const str = BitString.high(8);

    expect(str.getWidth()).toBe(8);
    expect(str.toString()).toBe('11111111');
});

test('0000.not()', () => {
    const str = new BitString('0', 4).not();

    expect(str.toString()).toBe('1111');
});

test('1111.not()', () => {
    const str = new BitString('1111').not();

    expect(str.toString()).toBe('0000');
});

test('1010.not()', () => {
    const str = new BitString('1010').not();

    expect(str.toString()).toBe('0101');
});

test('0101.not()', () => {
    const str = new BitString('0101').not();

    expect(str.toString()).toBe('1010');
});

test('not() double negation', () => {
    const str = new BitString('10110100101001001010101');
    const two = str.not();

    expect(two.not().toString()).toBe(str.toString());
});

test('1 AND 1', () => {
    const one = new BitString('1');
    const two = new BitString('1');

    expect(one.and(two).toString()).toBe('1');
})

test('0 AND 1', () => {
    const one = new BitString('0');
    const two = new BitString('1');

    expect(one.and(two).toString()).toBe('0');
})

test('1 AND 0', () => {
    const one = new BitString('1');
    const two = new BitString('0');

    expect(one.and(two).toString()).toBe('0');
})

test('00 AND 01', () => {
    const one = new BitString('00');
    const two = new BitString('01');

    expect(one.and(two).toString()).toBe('00');
});

test('11 AND 11', () => {
    const one = new BitString('11');
    const two = new BitString('11');

    expect(one.and(two).toString()).toBe('11');
})

test('01 AND 10', () => {
    const one = new BitString('01');
    const two = new BitString('10');

    expect(one.and(two).toString()).toBe('00');
})

test('10 AND 01', () => {
    const one = new BitString('10');
    const two = new BitString('01');

    expect(one.and(two).toString()).toBe('00');
})

test('00 AND 00', () => {
    const one = new BitString('00');
    const two = new BitString('00');

    expect(one.and(two).toString()).toBe('00');
});

test('1 OR 1', () => {
    const one = new BitString('1');
    const two = new BitString('1');

    expect(one.or(two).toString()).toBe('1');
})

test('0 OR 1', () => {
    const one = new BitString('0');
    const two = new BitString('1');

    expect(one.or(two).toString()).toBe('1');
})

test('1 OR 0', () => {
    const one = new BitString('1');
    const two = new BitString('0');

    expect(one.or(two).toString()).toBe('1');
})

test('00 OR 01', () => {
    const one = new BitString('00');
    const two = new BitString('01');

    expect(one.or(two).toString()).toBe('01');
});

test('11 OR 11', () => {
    const one = new BitString('11');
    const two = new BitString('11');

    expect(one.or(two).toString()).toBe('11');
})

test('01 OR 10', () => {
    const one = new BitString('01');
    const two = new BitString('10');

    expect(one.or(two).toString()).toBe('11');
})

test('10 OR 01', () => {
    const one = new BitString('10');
    const two = new BitString('01');

    expect(one.or(two).toString()).toBe('11');
})

test('00 OR 00', () => {
    const one = new BitString('00');
    const two = new BitString('00');

    expect(one.or(two).toString()).toBe('00');
});

// Converts from hex strings to binary internally, then back.
test('toString(16)', () => {
    // Whatever hex we create the string with, we should be able
    // to get it out.
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    for (let i = 1; i < 16; i++) {
        let hex = '0x' + genRanHex(i).toUpperCase().replace(/^0+/, '');
        if (hex == '0x') {
            hex += '0';
        }

        expect(new BitString(hex).toString(16)).toBe(hex);
    }
});

test('toJSON()', () => {
    const str = new BitString('00');

    expect(str.toJSON()).toBe(str.toString());
});