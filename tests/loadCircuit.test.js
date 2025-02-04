import {CvCircuit} from '../dist/CvCircuit';

test('Load a CircuitVerse file', async () => {
    await expect(async () => {
        const circuit = await CvCircuit.load('tests/Untitled.cv');
    }).not.toThrowError();

    // console.log('Circuit Loaded!');
    //expect(circuit).notToBe(null);
});