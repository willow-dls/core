import { CircuitLoader } from "../CircuitLoader";
import { CircuitProject } from "../CircuitProject";

export class JLSCircuitLoader implements CircuitLoader {
    load(data: any): CircuitProject {
        throw new Error("Method not implemented.");
    }
}
