import { expect, beforeAll, test } from "@jest/globals";
import { BitString } from "../../src/BitString";
import { loadProject } from "../../src/CircuitLoader";
import { LogisimLoader } from "../../src/CircuitLoader/LogisimLoader";
import { FileLogger } from "../../src/CircuitLogger/FileLogger";
import { LogLevel } from "../../src/CircuitLogger";

let mainCircuit;
let nandCircuit;
let norCircuit;
let xnorCircuit;
let notCircuit;
let bufferCircuit;
const logger = new FileLogger('gate2.log');
const logger2 = new FileLogger('gate2x.log');

beforeAll(async () => {

    logger.setLevel(LogLevel.TRACE);
    logger2.setLevel(LogLevel.TRACE)
    const project = await loadProject(LogisimLoader, "tests/Logisim/Gates2.circ");
    mainCircuit = project.getCircuitByName("main");
    nandCircuit = project.getCircuitByName("NANDGate")
    norCircuit = project.getCircuitByName("NORGate")
    xnorCircuit = project.getCircuitByName("XNORGate")
    notCircuit = project.getCircuitByName("NOTGate")
    bufferCircuit = project.getCircuitByName("BufferGate")
    logger.attachTo(project)
    logger2.attachTo(notCircuit)

});


afterAll(async () => {
    logger.close();
    logger2.close();
});

const maintable = [
    //I1 I2 O1
    "000",
    "101",
    "010",
    "110",
];

const nandtable = [
    //I1 I2 O1
    "001",
    "101",
    "011",
    "110",
];

const nortable = [
    //I1 I2 O1
    "001",
    "100",
    "010",
    "110",
]

const xnortable = [
    //I1 I2 O1
    "001",
    "100",
    "010",
    "111",
]

for (const entry of maintable) {
    test("MAIN/Subcircuit", async () => {
        const inputs = {
            Input1: new BitString(entry[0]),
            Input2: new BitString(entry[1]),
        };
        const outputs = {
            Output1: new BitString(entry[2])
        }
        const results = mainCircuit.run(inputs)
        expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
    });
}

for (const entry of nandtable) {
    test("NAND Gate", async () => {
        const inputs = {
            Input1: new BitString(entry[0]),
            Input2: new BitString(entry[1]),
        };
        const outputs = {
            Output1: new BitString(entry[2])
        }
        const results = nandCircuit.run(inputs)
        expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
    });
}


for (const entry of nortable) {
    test("NOR Gate", async () => {
        const inputs = {
            Input1: new BitString(entry[0]),
            Input2: new BitString(entry[1]),
        };
        const outputs = {
            Output1: new BitString(entry[2])
        }
        const results = norCircuit.run(inputs)
        expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
    });
}

for (const entry of xnortable) {
    test("XNOR Gate", async () => {
        const inputs = {
            Input1: new BitString(entry[0]),
            Input2: new BitString(entry[1]),
        };
        const outputs = {
            Output1: new BitString(entry[2])
        }

        const results = xnorCircuit.run(inputs)
        expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
    });
}

test("NOT Gate IN 0", async () => {
    const inputs = {
        Input1: new BitString("0"),
    };
    const outputs = {
        Output1: new BitString("1")
    }

    const results = notCircuit.run(inputs)
    expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
});

test("NOT Gate IN 1", async () => {
    const inputs = {
        Input1: new BitString("1"),
    };
    const outputs = {
        Output1: new BitString("0")
    }

    const results = notCircuit.run(inputs)
    expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
});

test("Buffer Gate IN 0", async () => {
    const inputs = {
        Input1: new BitString("0"),
    };
    const outputs = {
        Output1: new BitString("0")
    }

    const results = bufferCircuit.run(inputs)
    expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
});

test("Buffer Gate IN 1", async () => {
    const inputs = {
        Input1: new BitString("1"),
    };
    const outputs = {
        Output1: new BitString("1")
    }

    const results = bufferCircuit.run(inputs)
    expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
});