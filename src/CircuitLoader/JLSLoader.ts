import { CircuitLoader } from "../CircuitLoader";
import { CircuitProject } from "../CircuitProject";

/**
 * A circuit loaded that loads JLS `.jls` circuit files.
 */
export class JLSLoader extends CircuitLoader {
  constructor() {
    super("JLSCircuitLoader");
  }

  load(data: any): CircuitProject {
    throw new Error("Method not implemented.");
  }
}
