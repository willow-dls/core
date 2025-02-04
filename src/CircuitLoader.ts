import { Stream } from "node:stream";
import fs from "node:fs";

import { CircuitElement } from "./CircuitElement";
import { Circuit } from "./Circuit";

async function readStream(stream: Stream): Promise<string> {
    const chunks: Buffer<any>[] = [];

    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}

async function loadFileOrStream(file: string | Stream): Promise<object> {
    let stream;

    if (file instanceof Stream) {
        stream = file;
    } else {
        stream = fs.createReadStream(file);
    }

    return readStream(stream).then((data) => JSON.parse(data))
}

export type CircuitProject = Record<string, Circuit> | Circuit;

export interface CircuitLoader {
    load(data: object): CircuitProject;
}

export async function loadProject(loader: new () => CircuitLoader, data: Stream | string): Promise<CircuitProject> {
    const stream = loadFileOrStream(data);
    const circuitLoader = new loader();
    return stream.then((json) => circuitLoader.load(json));
}

