import { CircuitLoader } from "../CircuitLoader";
import { CircuitProject } from "../CircuitProject";
import { LogLevel } from "../CircuitLogger";
import { CircuitElement } from "../CircuitElement";

import Stream from "stream";
import { FileUtil } from "../Util/File";

import { Circuit } from "../Circuit";
import { CircuitBus } from "../CircuitBus";
import { AndGate } from "../CircuitElement/AndGate";
import { XorGate } from "../CircuitElement/XorGate";
import { Input } from "../CircuitElement/Input";
import { Output } from "../CircuitElement/Output";

const createElement: Record<string, (data: {type: string; props: Record<string, string[]>;}, inputs: CircuitBus[], outputs: CircuitBus[]) => CircuitElement> = {
  // TODO: Properly set input and output index parameter for use with subcircuits.
  'InputPin': (data, inputs, outputs) => new Input(0, data.props['name'][0] ?? '', outputs),
  'OutputPin': (data, inputs, outputs) => new Output(0, data.props['name'][0] ?? '', inputs[0]),
  'AndGate': (data, inputs, outputs) => new AndGate(inputs, outputs),
  'XorGate': (data, inputs, outputs) => new XorGate(inputs, outputs),
};

/**
 * A circuit loaded that loads JLS `.jls` circuit files.
 */
export class JLSLoader extends CircuitLoader {
  constructor() {
    super("JLSCircuitLoader");
  }

  #expect(toBe: string | RegExp, token?: string, msg?: string): string {
    msg ??= `Parse Error: Got token '${token}', expected ${toBe}.`;

    if (!token || (toBe instanceof RegExp && !toBe.test(token)) || (typeof toBe == 'string' && token != toBe)) {
      this.log(LogLevel.FATAL, msg);
      throw new Error(msg);
    }

    return token;
  }

  #parseCircuit(tokens: string[]): Circuit {
    this.#expect('CIRCUIT', tokens.shift());

    const name = this.#expect(/[a-zA-Z0-9]+/, tokens.shift());

    const parsedElements: {type: string, props: Record<string, string[]>}[] = [];
    while (tokens.length && tokens[0] != 'ENDCIRCUIT') {
      parsedElements.push(this.#parseElement(tokens));
    }

    this.#expect('ENDCIRCUIT', tokens.shift());

    const parsedWires = parsedElements.filter(e => e.type == 'WireEnd');
    const noWires = parsedElements.filter(e => e.type != 'WireEnd');

    // This block creates all the wires for the circuit.
    const wires: Record<string, CircuitBus> = {};
    for (const parsedElement of noWires) {
      const id = parsedElement.props['id'][0];
      const width = parsedElement.props['bits'][0];

      const directConnections = parsedWires.filter(w => (w.props['attach'] ?? []).includes(id));
      const connectedWires = this.#getWireDependencies(parsedWires, directConnections);

      for (const connectedWire of connectedWires) {
        if (!wires[connectedWire.props['id'][0]]) {
          wires[connectedWire.props['id'][0]] = new CircuitBus(parseInt(width));
        } else {
          if (wires[connectedWire.props['id'][0]].getWidth() != parseInt(width)) {
            throw new Error(`Wire width mismatch: Element expected wire of width ${width}, but the wire was already created with width ${wires[connectedWire.props['id'][0]].getWidth()}`);
          }
        }
      }
    }

    // Now that we have all the wires, connect them together.

    if (parsedWires.length != Object.values(wires).length) {
      throw new Error(`Sanity check failed: Parsed ${parsedWires.length} wires from the file, but instantiated ${Object.values(wires).length}.`);
    }

    for (const parsedWire of parsedWires) {
      const id = parsedWire.props['id'][0];
      const attach = parsedWire.props['wire'];

      attach.forEach((attachedWire) => {
        wires[id].connect(wires[attachedWire]);
      });
    }

    // All wires are connected, now create the elements and attach them to their
    // buses.
    const elements: CircuitElement[] = [];
    for (const parsedElement of noWires) {
      const id = parsedElement.props['id'][0];
      const delay = parseInt((parsedElement.props['delay'] ?? ['0'])[0]);

      const connectedWires = parsedWires.filter(w => (w.props['attach'] ?? []).includes(id));
      const inputWires = connectedWires.filter(w => w.props['put'][0].startsWith('input'));
      const outputWires = connectedWires.filter(w => w.props['put'][0].startsWith('output'));

      // Sort inputs by their 'put'. JLS increments a number at then end of the put string which corresponds
      // to the index that the input connects to.
      const inputIds = inputWires.sort((a, b) => a.props['put'][0].localeCompare(b.props['put'][0])).map(i => i.props['id'][0]);
      const inputs = inputIds.map(i => wires[i]);

      const outputIds = outputWires.sort((a, b) => a.props['put'][0].localeCompare(b.props['put'][0])).map(i => i.props['id'][0]);
      const outputs = outputIds.map(i => wires[i]);

      if (!createElement[parsedElement.type]) {
        throw new Error(`Unsupported element of type: ${parsedElement.type}`);
      }

      const element = createElement[parsedElement.type](parsedElement, inputs, outputs);

      element
        .setLabel((parsedElement.props['name'] ?? [''])[0])
        .setPropagationDelay(delay);

      inputs.forEach(input => input.connectElement(element));
      outputs.forEach(output => output.connectElement(element));

      elements.push(element);
    }

    // JLS circuits do not have unique IDs, so we just use the name instead.
    return new Circuit(name, name, elements);
  }

  #getWireDependencies(allWires: {type: string, props: Record<string, string[]>}[], wires: {type: string, props: Record<string, string[]>}[]): {type: string, props: Record<string, string[]>}[] {
    const deps: {type: string, props: Record<string, string[]>}[] = [];

    for (const wire of wires) {
      const connected = allWires.filter(w => w.props['wire'].includes(wire.props['id'][0]));
      deps.push(...connected.filter(c => !deps.includes(c) && !wires.includes(c)));
    }

    return deps.length ? this.#getWireDependencies(allWires, [...wires, ...deps]) : wires;
  }

  // TODO: Support subcircuits
  #parseElement(tokens: string[]): {type: string, props: Record<string, string[]>} {
    this.#expect('ELEMENT', tokens.shift());

    const elementType = this.#expect(/[a-zA-Z0-9]*/, tokens.shift());

    const properties: Record<string, string[]> = {};
    while (tokens.length && tokens[0] != 'END') {
      const prop = this.#parseProperty(tokens);
      if (!properties[prop.name]) {
        properties[prop.name] = [];
      }
      properties[prop.name].push(prop.value);
    }

    this.#expect('END', tokens.shift());
    return {
      type: elementType,
      props: properties
    };
  }

  #parseProperty(tokens: string[]): {
    type: string;
    name: string;
    value: string;
} {
    const type = this.#expect(/(int|String|ref)/, tokens.shift());
    const name = this.#expect(/[a-zA-Z0-9]*/, tokens.shift());

    let value = this.#expect(/(("?[a-zA-Z0-9]*"?)|([0-9]+))/, tokens.shift());

    if (type == 'String') {
      value = value.split('"')[1];
    }

    return {
      type: type,
      name: name,
      value: value
    };
  }

  async load(stream: Stream): Promise<CircuitProject> {
    const project: CircuitProject = new CircuitProject();
    this.propagateLoggersTo(project);

    const data = await FileUtil.extractFromZip(stream, ["JLSCircuit"]).then(
      ([stream]) => FileUtil.readTextStream(stream),
    );

    // Tokenize the input stream. JLS circuits have an unfortunate structure, but
    // at the very least, it is whitespace separated, so we can just chop the whole
    // thing into words and then process them one at a time.
    const tokens: string[] = data.split(/[\s+]/).filter((token) => token.length > 0);

    while (tokens.length) {
      project.addCircuit(this.#parseCircuit(tokens));
    }

    return project;
  }
}
