import { CircuitLoader, CircuitProject } from "../CircuitLoader";

export class JLSCircuitLoader implements CircuitLoader {
    load(data: JSON): CircuitProject {
        throw new Error("Method not implemented.");
    }
}
