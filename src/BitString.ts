type Bit = "0" | "1";
type BinaryString = string & { __binaryString: true };

function isBinaryString(str: string): str is BinaryString {
  return /^[01]+$/.test(str);
}

function isHexString(str: string): boolean {
  return /^0x[abcdef0123456789]+$/.test(str.toLowerCase());
}

function hexToBinary(str: string): BinaryString {
  const hexMap: Record<string, string> = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    a: "1010",
    b: "1011",
    c: "1100",
    d: "1101",
    e: "1110",
    f: "1111",
  };

  let result = str
    .slice(2)
    .toLowerCase()
    .split("")
    .map((c) => hexMap[c])
    .join("")
    .replace(/^0+/, "");

  if (result == "") {
    result = "0";
  }

  return result as BinaryString;
}

function forBit(
  str: string,
  func: (b: string, i: number) => string,
): BinaryString {
  const result = str.split("").map(func).join("");

  if (isBinaryString(result)) {
    return result;
  } else {
    throw new Error(`Not a binary string: '${str}'`);
  }
}

export class BitString {
  static high(width: number = 1) {
    return new BitString("1".repeat(width));
  }

  static low(width: number = 1) {
    return new BitString("0".repeat(width));
  }

  static rand(width: number = 1) {
    return new BitString(
      "0"
        .repeat(width)
        .split("")
        .map((c) => (Math.random() < 0.5 ? "1" : "0"))
        .join(""),
    );
  }

  #str: BinaryString;

  constructor(str: string, width: number = 0) {
    if (isBinaryString(str)) {
      this.#str = str;
    } else if (isHexString(str)) {
      this.#str = hexToBinary(str);
    } else {
      throw new Error(`Not a hex or binary string: '${str}'`);
    }

    // If a fixed width was provided, we ensure that the bit width
    // is exactly that wide  by padding or truncating the bit
    // string.
    if (width) {
      if (this.getWidth() > width) {
        this.#str = this.truncate(width).#str;
      } else if (this.getWidth() < width) {
        this.#str = this.pad(width).#str;
      }
    }
  }

  not(): BitString {
    return new BitString(forBit(this.#str, (c) => (c === "0" ? "1" : "0")));
  }

  add(str: BitString | string): BitString {
    if (typeof str === "string") {
      str = new BitString(str);
    }

    if (str.getWidth() != this.getWidth()) {
      throw new Error(
        `Cannot ADD bit strings: width mismatch: ${str.getWidth()} != ${this.getWidth()}`,
      );
    }

    let carry: Bit = "0";
    let result = [...this.#str];

    const map: Record<string, Bit[]> = {
      // Add: [result, carry]
      "000": ["0", "0"],
      "001": ["1", "0"],
      "010": ["1", "0"],
      "011": ["0", "1"],
      "100": ["1", "0"],
      "101": ["0", "1"],
      "110": ["0", "1"],
      "111": ["1", "1"],
    };

    for (let i = result.length - 1; i >= 0; i--) {
      const key: string = `${this.#str[i]}${str.#str[i]}${carry}`;
      const r: Bit[] = map[key];

      result[i] = r[0];
      carry = r[1];
    }

    return new BitString(result.join(""));
  }

  and(str: BitString | string): BitString {
    if (typeof str === "string") {
      str = new BitString(str);
    }

    if (str.getWidth() != this.getWidth()) {
      throw new Error(
        `Cannot AND bit strings: width mismatch: ${str.getWidth()} != ${this.getWidth()}`,
      );
    }

    return new BitString(
      forBit(str.toString(), (_, i) =>
        str.#str[i] == "1" && this.#str[i] == "1" ? "1" : "0",
      ),
    );
  }

  or(str: BitString | string): BitString {
    if (typeof str === "string") {
      str = new BitString(str);
    }

    if (str.getWidth() != this.getWidth()) {
      throw new Error(
        `Cannot OR bit strings: width mismatch: ${str.getWidth()} != ${this.getWidth()}`,
      );
    }

    return new BitString(
      forBit(str.toString(), (_, i) =>
        str.#str[i] == "1" || this.#str[i] == "1" ? "1" : "0",
      ),
    );
  }

  twosCompliment(): BitString {
    // Twos compliment is implemented by flipping all the bits
    // then adding one.
    return this.not().add(new BitString("1", this.getWidth()));
  }

  sub(str: BitString | string): BitString {
    if (typeof str === "string") {
      str = new BitString(str);
    }

    return this.add(str.twosCompliment());
  }

  getWidth(): number {
    return this.#str.length;
  }

  toString(radix: number = 2): string {
    if (radix == 2) {
      return this.#str;
    } else if (radix == 16) {
      let result = "";
      // Make the length of the binary string a multiple of 4 by padding at the start
      let paddedStr = this.#str as string;
      const paddingLength = 4 - (this.#str.length % 4);
      if (paddingLength !== 4) {
        paddedStr = "0".repeat(paddingLength) + this.#str;
      }

      // Process every 4 bits and convert to hexadecimal
      for (let i = 0; i < paddedStr.length; i += 4) {
        let slice = paddedStr.slice(i, i + 4);
        result += parseInt(slice, 2).toString(16).toUpperCase();
      }

      return "0x" + result;
    } else {
      // TODO: Support arbitrary radices.
      throw new Error(
        `Unsupported radix: ${radix}. Only 2 and 16 are supported.`,
      );
    }
  }

  toJSON(): string {
    return this.toString();
  }

  toSigned(): number {
    const negative = this.#str[0] === "1";

    if (negative) {
      return -this.twosCompliment().toUnsigned();
    } else {
      return this.toUnsigned();
    }
  }

  toUnsigned(): number {
    return parseInt(this.#str, 2);
  }

  equals(str: BitString | string | null): boolean {
    if (!str) {
      return false;
    }

    if (typeof str === "string") {
      str = new BitString(str);
    }
    return str.#str == this.#str;
  }

  greaterThan(str: BitString | string | null): boolean {
    if (!str) {
      return false;
    }

    if (typeof str === "string") {
      str = new BitString(str);
    }

    return this.sub(str).msb(1).equals("0");
  }

  lessThan(str: BitString | string): boolean {
    if (typeof str === "string") {
      str = new BitString(str);
    }

    return this.sub(str).msb(1).equals("1");
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

    return new BitString(slice);
  }

  pad(width: number): BitString {
    if (width <= this.getWidth()) {
      return this;
    }

    return new BitString(this.#str.toString().padStart(width, "0"));
  }

  substring(start: number, end?: number): BitString {
    return new BitString(this.#str.substring(start, end));
  }

  msb(n: number): BitString {
    return this.substring(0, n);
  }

  lsb(n: number): BitString {
    return this.substring(this.getWidth() - n);
  }
}
