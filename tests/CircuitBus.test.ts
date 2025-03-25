import { expect, beforeAll, test } from "@jest/globals";

import { CircuitBus } from "../src/CircuitBus";
import { OrGate } from "../src/CircuitElement/OrGate";

// test('Bit width error', () => {
//     expect(loadProject(CircuitVerseLoader, 'tests/cv/BitWidthError.cv')).rejects.toBe('error');
// });

test("Connections", () => {
  const bus1 = new CircuitBus(4);
  const bus2 = new CircuitBus(4, bus1);

  const bus3 = new CircuitBus(4);

  const gate = new OrGate([], []);

  bus2.connectElement(gate);

  expect(() => bus2.connect(bus3)).toThrow("Cannot connect");

  expect(bus1.getConnections().length).toBe(0);
  expect(bus2.getConnections().length).toBe(1);
  expect(bus3.getConnections().length).toBe(0);
});
