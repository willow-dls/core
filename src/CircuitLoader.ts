import { Stream } from "node:stream";
import fs from "node:fs";
import { CircuitProject } from "./CircuitProject";
import { CircuitLoggable, CircuitLogger } from "./CircuitLogger";

export abstract class CircuitLoader extends CircuitLoggable {
  constructor(subsystem: string = "Loader") {
    super(subsystem);
  }

  abstract load(stream: Stream): Promise<CircuitProject>;
}

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
