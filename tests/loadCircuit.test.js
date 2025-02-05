import {loadProject} from '../src/CircuitLoader';
import {CircuitVerseLoader} from '../src/CircuitLoader/CircuitVerseLoader';

test('Load a CircuitVerse file', async () => {
    const circuit = await loadProject(CircuitVerseLoader, 'tests/cv/Simple.cv');
    
    expect(circuit).not.toBe(null);
});