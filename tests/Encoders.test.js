import { BitString } from "../src/BitString";
import { loadProject } from "../src/CircuitLoader";
import { CircuitVerseLoader } from "../src/CircuitLoader/CircuitVerseLoader";




let circuit_Encoder;
let circuit_Decoder;

beforeAll(async () => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/Encoders.cv');
    circuit_Encoder = project.getCircuitByName('Encoder');
    circuit_Decoder = project.getCircuitByName('Decoder');

});


const table1_in = [
    ['0', '0', '0', '0'],
    ['0', '0', '0', '1'],
    ['0', '0', '1', '0']
    ['0', '0', '1', '1'],
    ['0', '1', '0', '0'],
    ['0', '1', '0', '1'],
    ['0', '1', '1', '0'],
    ['0', '1', '1', '1'],
    ['1', '0', '0', '0'],
    ['1', '0', '0', '1'],
    ['1', '0', '1', '0'],
    ['1', '0', '1', '1'],
    ['1', '1', '0', '0'],
    ['1', '1', '0', '1'],
    ['1', '1', '1', '0'],
    ['1', '1', '1', '1'],
];

const table1_out = [
    ['0', '0'],
    ['0', '0'],
    ['0', '1'],
    ['0', '1'],
    ['1', '0'],
    ['1', '0'],
    ['1', '0'],
    ['1', '0'],
    ['1', '1'],
    ['1', '1'],
    ['1', '1'],
    ['1', '1'],
    ['1', '1'],
    ['1', '1'],
    ['1', '1'],
    ['1', '1'],
]

const table2_in = [
    ['00'],
    ['01'],
    ['10'],
    ['11'],
]
const table2_out = [
    ['0', '0', '0', '1'],
    ['0', '0', '1', '0'],
    ['0', '1', '0', '0'],
    ['1', '0', '0', '0'],
]



for (let i = 0; i < table1_in.length; i++) {
    test(`Priority Encoder ${i}`, async() => {
    
        const inputs = {
            inp0: new BitString(table1_in[i][3]),
            inp1: new BitString(table1_in[i][2]),
            inp2: new BitString(table1_in[i][1]),
            inp3: new BitString(table1_in[i][0]),
            enable: new BitString(BitString.high())
        };
    
        const outputs = {
            out0: new BitString(table1_out[i][1]),
            out1: new BitString(table1_out[i][0])
        }
        
        
        const results = circuit_Encoder.run(inputs)

        expect(results.outputs).toStrictEqual(outputs);
    });
}

for (let i = 0; i < table2_in.length; i++) {
    test(`Decoder test ${i}`, () => {
    
        const inputs = {
            inp1: new BitString(table2_in[i]),
        };
    
        const outputs = {
            out0: new BitString(table2_out[i][3]),
            out1: new BitString(table2_out[i][2]),
            out2: new BitString(table2_out[i][1]),
            out3: new BitString(table2_out[i][0]),
        }
        
        
        const results = circuit_Decoder.run(inputs)

        expect(results.outputs).toStrictEqual(outputs);
    });
}

