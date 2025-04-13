import { Stream } from "node:stream";
import fs from "node:fs";
import { CircuitProject } from "./CircuitProject";
import { CircuitLoggable, CircuitLogger } from "./CircuitLogger";
//Error when using this as an import for some reason?
//import { XMLParser } from "fast-xml-parser";
const { XMLParser } = require("fast-xml-parser");

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
    const circuitLoader = new loader();
    if (logger) {
        circuitLoader.attachLogger(logger);
    }
    if (typeof data === "string" && data.split('.').pop() === 'circ') {
        return circuitLoader.load(loadXML(data))
    }
    const stream = loadFileOrStream(data);
    return stream.then((json) => circuitLoader.load(json));

}

function loadXML(file: string) {
    let xmlData = fs.readFileSync(file, 'utf8')
    const alwaysArray = [
        "project.circuit",
        "project.circuit.wire",
        "project.circuit.comp",
        "project.circuit.comp.a"
    ]
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "",
        isArray: (name: any, jpath: string, isLeafNode: any, isAttribute: any) => {
            if (alwaysArray.indexOf(jpath) !== -1) return true;
        }
    }

    const parser = new XMLParser(options)
    const data = parser.parse(xmlData)
    return data
}