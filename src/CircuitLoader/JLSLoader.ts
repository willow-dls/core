import { CircuitLoader } from "../CircuitLoader";
import { CircuitProject } from "../CircuitProject";

export class JLSCircuitLoader extends CircuitLoader {
  constructor() {
    super("JLSCircuitLoader");
  }

  load(data: any): CircuitProject {
    throw new Error("Method not implemented.");
  }
}
