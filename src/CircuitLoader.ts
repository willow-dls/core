import { Stream } from "node:stream";
import fs from "node:fs";
import { CircuitProject } from "./CircuitProject";
import { CircuitLoggable, CircuitLogger } from "./CircuitLogger";

async function readStream(stream: Stream): Promise<string> {
  const chunks: Buffer<any>[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

async function loadFileOrStream(file: string | Stream): Promise<object> {
  let stream;

  if (file instanceof Stream) {
    stream = file;
  } else {
    stream = fs.createReadStream(file);
  }

  return readStream(stream).then((data) => JSON.parse(data));
}

/**
 * A circuit loader implementation translates vendor-specific data (either from a file,
 * network stream, database, or other location) and translates it into the internal circuit
 * representation to be ran with this engine. This class is the primary mechanism for
 * loading circuits from third-party circuit simulators, and is extended by the circuit
 * loaders supported by this package (see below.)
 *
 * Custom implementations can load circuits from anywhere, even remote resources, as long as
 * they return a standard {@link CircuitProject} with properly behaving {@link Circuit}s which
 * accurately represent the original data file. To support a custom data source, simply implement
 * the {@link load} function and then pass your implementation into {@link loadProject}.
 */
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
   * @param data The arbitrary data to transform into a circuit project.
   * @throws Any error if the data is malformed or invalid in any way.
   * @returns A valid circuit project, which contains circuits that may or may not
   * be related via {@link SubCircuit}.
   */
  abstract load(data: any): CircuitProject;
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
  const stream = loadFileOrStream(data);
  const circuitLoader = new loader();
  if (logger) {
    circuitLoader.attachLogger(logger);
  }
  return stream.then((json) => circuitLoader.load(json));
}
