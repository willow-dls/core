import { Circuit } from "../Circuit";
import { CircuitElement } from "../CircuitElement";
import { AndGate } from "../CircuitElement/AndGate";
import { Input } from "../CircuitElement/Input";
import { NorGate } from "../CircuitElement/NorGate";
import { Output } from "../CircuitElement/Output";
import { CircuitLoader } from "../CircuitLoader";
import { CircuitNode } from "../CircuitNode";
import { CircuitProject } from "../CircuitProject";
import { NandGate } from "../CircuitElement/NandGate";
import { NotGate } from "../CircuitElement/NotGate";
import { XnorGate } from "../CircuitElement/XnorGate";
import { XorGate } from "../CircuitElement/XorGate";

type CircuitContext = {
  nodes: CircuitNode[];
  data: any;
  project: CircuitProject;
};

const createElement: Record<string, (ctx: CircuitContext) => CircuitElement> = {
  AndGate: ({ nodes, data }) =>
    new AndGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  NorGate: ({ nodes, data }) =>
    new NorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  Input: ({ nodes, data }) =>
    new Input(data.label, [nodes[data.customData.nodes.output1]]),
  Output: ({ nodes, data }) =>
    new Output(data.label, nodes[data.customData.nodes.inp1]),
  NandGate: ({ nodes, data }) =>
    new NandGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  OrGate: ({ nodes, data }) =>
    new NorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  NotGate: ({ nodes, data }) =>
    new NotGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  XnorGate: ({ nodes, data }) =>
    new XnorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  XorGate: ({ nodes, data }) =>
    new XorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
};

export class CircuitVerseLoader implements CircuitLoader {
  load(data: any): CircuitProject {
    const project: CircuitProject = new CircuitProject();

    // Each scope is a circuit
    for (const scopeInd in data.scopes) {
      const scope = data.scopes[scopeInd];

      const nodes: CircuitNode[] = [];

      // First pass over nodes array to create nodes.
      for (let nodeInd = 0; nodeInd < scope.allNodes.length; nodeInd++) {
        const scopeNode = scope.allNodes[nodeInd];
        const node = new CircuitNode(scopeNode.bitWidth);
        nodes.push(node);
      }

      // Second pass over nodes to add connections now that all nodes
      // are instantiated.
      for (let nodeInd = 0; nodeInd < scope.allNodes.length; nodeInd++) {
        const scopeNode = scope.allNodes[nodeInd];

        for (const connectInd in scopeNode.connections) {
          const ind = scopeNode.connections[connectInd];
          nodes[nodeInd].connect(nodes[ind]);
        }
      }

      // CircuitVerse stores elements keyed by their type
      // in the same object as the scope properties. This is... dumb.
      //
      // Since we don't know what types we have in advnance, we create
      // a blacklist of all the keys that we know aren't circuit element
      // arrays, and don't process those.
      const blacklistKeys = [
        "layout",
        "verilogMetadata",
        "allNodes",
        "id",
        "name",
        "restrictedCircuitElementsUsed",
        "nodes",
      ];

      // Collect the circuit elements into an array.
      const elementArray = Object.keys(scope)
        .filter((k) => !blacklistKeys.includes(k))
        .map((k) => scope[k].map((e: any) => ((e.objectType = k), e)))
        .flat();

      const id = scope.id;
      const name = scope.name;
      const elements: CircuitElement[] = [];

      for (const i in elementArray) {
        const elementData = elementArray[i];
        const type = elementData.objectType;

        if (!createElement[type]) {
          console.log(elementData);
          throw new Error(
            `Circuit '${name}' (${id}) uses unsupported element: ${type}.`,
          );
        }

        elements.push(
          createElement[type]({
            project: project,
            nodes: nodes,
            data: elementData,
          }),
        );
      }

      // The final circuit for this scope.
      const circuit = new Circuit(id, name, elements);

      project.addCircuit(circuit);
    }

    return project;
  }
}
