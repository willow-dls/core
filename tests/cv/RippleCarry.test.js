import { BitString } from "../../src/BitString";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";
import { LogLevel } from "../../src/CircuitLogger";
import { FileLogger } from "../../src/CircuitLogger/FileLogger";
import { ConsoleLogger } from "../../src/CircuitLogger/ConsoleLogger";


//const logger = new FileLogger('ripple-carry.log');
let adder;

beforeAll(async () => {
    //const logger = new ConsoleLogger();
    //logger.setLevel(LogLevel.TRACE).setSubsystems(/^Circuit$/);

    const project = await loadProject(CircuitVerseLoader, 'tests/cv/RippleCarry.cv');
    adder = project.getCircuitByName('4-Bit Ripple-Carry Adder');

    //adder = null;
});

// afterAll(async() => {
//     logger.close();
// });

// Truth table for 4-bit ripple carry adder
const table = [
    [['0000', '0000', '0'], ['0000', '0']],
    [['0001', '0000', '0'], ['0001', '0']],
    [['0001', '0001', '0'], ['0010', '0']],
    [['1100', '0100', '0'], ['0000', '1']],
    [['1100', '0100', '1'], ['0001', '1']],
    [['1100', '0101', '1'], ['0010', '1']],
    [['0110', '0001', '1'], ['1000', '0']],
    [['0110', '1001', '0'], ['1111', '0']],
    [['0110', '1001', '1'], ['0000', '1']],
];

// for (const entry of table) {
//     const inputs = {
//         A: new BitString(entry[0][0]),
//         B: new BitString(entry[0][1]),
//         CarryIn: new BitString(entry[0][2])
//     };

//     const outputs = {
//         Output: new BitString(entry[1][0]),
//         CarryOut: new BitString(entry[1][1])
//     };

//     test(`Adder Truth Table: A = ${inputs.A}, B = ${inputs.B}, CarryIn = ${inputs.CarryIn} => Output = ${outputs.Output}, CarryOut = ${outputs.CarryOut}`, () => {

//         const results = adder.run(inputs);

//         expect(results.outputs).toStrictEqual(outputs);
//     });
// }

function genTest(a, b, sum) {
    return () => {

        const inputs = {
            A0: a.toString()[3],
            A1: a.toString()[2],
            A2: a.toString()[1],
            A3: a.toString()[0],

            B0: b.toString()[3],
            B1: b.toString()[2],
            B2: b.toString()[1],
            B3: b.toString()[0],

            CarryIn: '0'
        };

        const r = adder.run(inputs).outputs;




        expect(`${r.Sum3}${r.Sum2}${r.Sum1}${r.Sum0}`).toBe(sum.toString());
    };
}

let a = BitString.low(4);
let b = BitString.low(4);
while (true) {
    while (true) {

        // if (a.equals('1111') && b.equals('0010')) {
            const sum = a.add(b);

        test(`Exhaustive: ${a} + ${b} => ${sum}`, genTest(a, b, sum));

        // }

        
        b = b.add('0001');

        if (b.equals('0000')) {
            break;
        }
    }
    a = a.add('0001');

    if (a.equals('0000')) {
        break;
    }
}
