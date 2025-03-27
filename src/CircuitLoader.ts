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

async function loadFileOrStream(file: string | Stream): Promise<string> {
  let stream;

  if (file instanceof Stream) {
    stream = file;
  } else {
    stream = fs.createReadStream(file);
  }

  return readStream(stream);
}

export abstract class CircuitLoader extends CircuitLoggable {
  constructor(subsystem: string = "Loader") {
    super(subsystem);
  }

  abstract load(data: any): CircuitProject;
}

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
