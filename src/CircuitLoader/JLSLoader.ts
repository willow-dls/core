import { CircuitLoader } from "../CircuitLoader";
import { CircuitProject } from "../CircuitProject";
import { LogLevel } from "../CircuitLogger";
import { CircuitElement } from "../CircuitElement";
import { AndGate } from "../CircuitElement/AndGate";
import { CircuitBus } from "../CircuitBus";
import { XorGate } from "../CircuitElement/XorGate";

type CircuitContext = {
  nodes: CircuitBus[];
  data: any;
  project: CircuitProject;
};

const createElement: Record<string, (ctx: CircuitContext) => CircuitElement> = {
  AndGate: ({ nodes, data }) =>
    new AndGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  XorGate: ({ nodes, data }) =>
    new XorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
};

export class JLSCircuitLoader extends CircuitLoader {
  constructor() {
    super("JLSCircuitLoader");
  }

  /*
      TODO: This current solution requires the user to
        unzip a .jls file and extract the JLSCircuit from inside.
        *Ideal* end goal would be to handle the unzipping internally for
        the purposes of testing
     */
  load(data: any): CircuitProject {
    const project: CircuitProject = new CircuitProject();
    this.propagateLoggersTo(project);

    this.log(LogLevel.INFO, `Loading circuit from data ${data}`);

    // Get all circuit parts
    const lines: string[] = data.split("\n");

    // Blacklist elements without nodes or that are visual only
    const blacklistKeys = ["WireEnd"];

    let elementsList: string[] = [];
    for (let line of lines) {
      line = line.replace(/[\n\r]+/g, "");

      // Identify new element
      if (line.startsWith("ELEMENT")) {
        const lineParts = line.split(" ");
        if (!blacklistKeys.includes(lineParts[1])) {
          elementsList.push(lineParts[1]);
        }
      }
    }

    console.log(elementsList);

    return project;
  }
}
