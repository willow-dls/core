type Bit = '0' | '1';
type BinaryString = string & { __binaryString: true };

function isBinaryString(str: string): str is BinaryString {
    return /^[01]*$/.test(str);
}

function forBit(str: string, func: (b: string, i: number) => string): BinaryString {
    const result = str
        .split('')
        .map(func)
        .join('');

    if (isBinaryString(result)) {
        return result;
    } else {
        throw new Error(`Not a binary string: '${str}'`);
    }
}

export class BitString {
    static from(str: string, pad: number = 0) {
        return new BitString(str.padStart(pad, '0'));
    }

    static high(width: number = 1) {
        return new BitString('1'.repeat(width));
    }

    static low(width: number = 1) {
        return new BitString('0'.repeat(width));
    }

    #str: BinaryString;

    constructor(str: string) {
        if (!isBinaryString(str)) {
            throw new Error(`Not a binary string: '${str}'`);
        }

        this.#str = str;
    }

    not(): BitString {
        return BitString.from(forBit(this.#str, c => c === '0' ? '1' : '0'));
    }

    add(str: BitString): BitString {
        if (str.getWidth() != this.getWidth()) {
            throw new Error(`Cannot ADD bit strings: width mismatch: ${str.getWidth()} != ${this.getWidth()}`);
        }

        let carry: Bit = '0';
        let result = [...this.#str];

        const map: Record<string, Bit[]> = {
            // Add: [result, carry]
            '000': ['0', '0'],
            '001': ['1', '0'],
            '010': ['1', '0'],
            '011': ['0', '1'],
            '100': ['1', '0'],
            '101': ['0', '1'],
            '110': ['0', '1'],
            '111': ['1', '1'],
        };

        for (let i = 0; i < result.length; i++) {
            const key: string = `${carry}${this.#str[i]}${str.#str[i]}`;
            const r:  Bit[] = map[key];

            result[i] = r[0];
            carry = r[1];
        }

        return BitString.from(result.join(''));
    }

    and(str: BitString): BitString {
        if (str.getWidth() != this.getWidth()) {
            throw new Error(`Cannot AND bit strings: width mismatch: ${str.getWidth()} != ${this.getWidth()}`);
        }

        return BitString.from(forBit(str.toString(), (_, i) => str.#str[i] == '1' && this.#str[i] == '1' ? '1' : '0'));
    }

    or(str: BitString): BitString {
        if (str.getWidth() != this.getWidth()) {
            throw new Error(`Cannot OR bit strings: width mismatch: ${str.getWidth()} != ${this.getWidth()}`);
        }

        return BitString.from(forBit(str.toString(), (_, i) => str.#str[i] == '1' || this.#str[i] == '1' ? '1' : '0'));
    }

    twosCompliment(): BitString {
        // Twos compliment is implemented by flipping all the bits
        // then adding one.
        return this.not().add(BitString.from('1', this.getWidth()));
    }

    sub(str: BitString): BitString {
        return this.add(str.twosCompliment());
    }

    getWidth(): number {
        return this.#str.length;
    }

    toString(): string {
        return this.#str;
    }

    toJSON(): string {
        return this.toString();
    }

    toSigned(): number {
        const negative = this.#str[0] === '1';

        if (negative) {
            return -this.twosCompliment().toUnsigned();
        } else {
            return this.toUnsigned();
        }
    }

    toUnsigned(): number {
        return parseInt(this.#str, 2);
    }

    equals(str: BitString) {
        return str.#str == this.#str;
    }

    truncate(length: number, upper: boolean = false): BitString {
        if (length >= this.getWidth()) {
            return this;
        }

        let slice: string;
        if (upper) {
            slice = this.#str.substring(0, length);
        } else {
            slice = this.#str.substring(this.getWidth() - length);
        }

        return BitString.from(slice);
    }

    pad(width: number): BitString {
        if (width <= this.getWidth()) {
            return this;
        }
        
        return BitString.from(this.#str.toString(), width);
    }
}
