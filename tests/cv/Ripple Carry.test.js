import { BitString } from "../../src/BitString";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";
import { LogLevel } from "../../src/CircuitLogger";
import { FileLogger } from "../../src/CircuitLogger/FileLogger";
import { ConsoleLogger } from "../../src/CircuitLogger/ConsoleLogger";


let adder;

beforeAll(async () => {
    // const logger = new FileLogger('ripple-carry.log');
    // //const logger = new ConsoleLogger();
    // logger.setLevel(LogLevel.TRACE)//.setSubsystems(/^.*Loader$/);

    const project = await loadProject(CircuitVerseLoader, 'tests/cv/Ripple Carry.cv');
    adder = project.getCircuitByName('4-Bit Ripple-Carry Adder');

    //adder = null;
});

// Truth table for 4-bit ripple carry adder
const table = [
    [['0000', '0000', '0'], ['0000', '0']],
    [['0001', '0000', '0'], ['0001', '0']],
    [['0001', '0001', '0'], ['0010', '0']]
];

for (const entry of table) {
    const inputs = {
        A: new BitString(entry[0][0]),
        B: new BitString(entry[0][1]),
        CarryIn: new BitString(entry[0][2])
    };

    const outputs = {
        Output: new BitString(entry[1][0]),
        CarryOut: new BitString(entry[1][1])
    };

    test(`4-bit Ripple Carry Adder Truth Table: A = ${inputs.A}, B = ${inputs.B}, CarryIn = ${inputs.CarryIn} => Output = ${outputs.Output}, CarryOut = ${outputs.CarryOut}`, () => {

        const results = adder.run(inputs);

        expect(results.outputs).toStrictEqual(outputs);
    });
}
