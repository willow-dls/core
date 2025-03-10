import { loadProject } from "../src/CircuitLoader";
import { CircuitVerseLoader } from "../src/CircuitLoader/CircuitVerseLoader";

test('CircuitProject fail to get circuit by name', async () => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/Simple.cv');
    
    expect(() => project.getCircuitByName('blah-blah')).toThrow('No circuit in this project');
});

test('CircuitProject fail to get circuit by ID', async () => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/Simple.cv');
    
    expect(() => project.getCircuitById('blah-blah')).toThrow('No circuit in this project');
});

test('CircuitProject.getCircuits()', async () => {
    let project = await loadProject(CircuitVerseLoader, 'tests/cv/Simple.cv');
    expect(project.getCircuits().length).toBe(3);

    project = await loadProject(CircuitVerseLoader, 'tests/cv/InfiniteLoop.cv');
    expect(project.getCircuits().length).toBe(1);
});