import Stream from "stream";
import unzip from "unzip-stream";
import MemoryStream from "memorystream";
import { XMLParser } from "fast-xml-parser";

export class FileUtil {
  // Don't allow extending or instantiating.
  private constructor() {}

  static async readTextStream(stream: Stream): Promise<string> {
    const chunks: Buffer<any>[] = [];

    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
  }

  static async readJsonStream(stream: Stream): Promise<any> {
    return this.readTextStream(stream).then((str) => JSON.parse(str));
  }

  static async streamFromZip(
    stream: Stream,
    paths: Record<string, Stream>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      stream
        .pipe(unzip.Parse())
        .on("entry", (entry) => {
          if (paths[entry.path] !== undefined) {
            entry.pipe(paths[entry.path]);
          } else {
            entry.autodrain();
          }
        })
        .on("finish", () => resolve())
        .on("error", (err) => reject(err));
    });
  }

  static async extractFromZip(
    stream: Stream,
    paths: string[],
  ): Promise<Stream[]> {
    let map: Record<string, Stream> = {};
    for (const path of paths) {
      map[path] = new MemoryStream();
    }
    return this.streamFromZip(stream, map).then(() => Object.values(map));
  }

  static async readXmlStream(file: Stream) {
    const alwaysArray = [
      "project.circuit",
      "project.circuit.wire",
      "project.circuit.comp",
      "project.circuit.comp.a",
    ];
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "",
      isArray: (name: any, jpath: string, isLeafNode: any, isAttribute: any) => alwaysArray.indexOf(jpath) !== -1,
    };
  
    const parser = new XMLParser(options);
    const xmlData = await FileUtil.readTextStream(file);
    const data = parser.parse(xmlData);
    return data;
  }
}
