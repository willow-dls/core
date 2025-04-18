import { Stream } from "node:stream";
import fs from "node:fs";
import { CircuitProject } from "./CircuitProject";
import { CircuitLoggable, CircuitLogger } from "./CircuitLogger";
import { Circuit } from "./Circuit";

export abstract class CircuitLoader extends CircuitLoggable {
  /**
   * Create a new circuit loader.
   * @param subsystem This class is {@link CircuitLoggable}, so it accepts a subsystem ID for
   * logging.
   */
  constructor(subsystem: string = "Loader") {
    super(subsystem);
  }

  /**
   * Transform arbitrary data loaded from a stream or a file into a proper {@link CircuitProject}
   * containing circuits which can be run with this engine.
   * @param stream The arbitrary data to transform into a circuit project.
   * @throws Any error if the data is malformed or invalid in any way.
   * @returns A valid circuit project, which contains circuits that may or may not
   * be related via {@link SubCircuit}.
   */
  abstract load(stream: Stream): Promise<CircuitProject>;
}

/**
 * Load a circuit project from a file or a stream.
 * @param loader The loader implementation to use to process the data, translating it into a circuit project.
 * @param data A stream or file name to pull the data from.
 * @param logger An optional logger that can be used to log information about the loading process,
 * most likely for debugging purposes. Note that if a logger is provided, it will be propagated to
 * the loaded project and all the circuits the project contains.
 * @returns A Circuit project which circuits can be extracted from to run in the simulation.
 */
export async function loadProject(
  loader: new () => CircuitLoader,
  data: Stream | string,
  logger?: CircuitLogger,
): Promise<CircuitProject> {
  const stream = data instanceof Stream ? data : fs.createReadStream(data);
  const circuitLoader = new loader();
  if (logger) {
    circuitLoader.attachLogger(logger);
  }
  return circuitLoader.load(stream);
}

/**
 * A simple helper method that calls {@link loadProject} and then {@link CircuitProject.getCircuitByName}
 * to immediately retrieve a circuit from a file. This is most useful for single-circuit projects or for
 * projects where only one circuit will be executed and the others are just subcircuits or other circuits
 * which are not immediately useful.
 * @param loader See {@link loadProject}.
 * @param data See {@link loadProject}.
 * @param name The name of the circuit to load from the project.
 * @param logger See {@link loadProject}.
 * @returns A promise of the specified circuit from the data source.
 */
export async function loadCircuit(
  loader: new () => CircuitLoader,
  data: Stream | string,
  name: string,
  logger?: CircuitLogger,
): Promise<Circuit> {
  return loadProject(loader, data, logger).then((project) =>
    project.getCircuitByName(name),
  );
}
