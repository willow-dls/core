import { Stream } from "node:stream";
import fs from "node:fs";

// @ts-ignore
import {loadScope, Scope} from 'circuitverse';

// import {loadScope} from "cv-frontend-vue/src/simulator/src/data/load";
// import Scope from "cv-frontend-vue/src/simulator/src/circuit";

export class CvCircuit {
    #scope: Scope | null;

    static #readStream(stream: Stream): Promise<string> {
        const chunks: Buffer<any>[] = [];

        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
    }

    static async load(file: string | Stream): Promise<CvCircuit> {
        let stream;

        if (file instanceof Stream) {
            stream = file;
        } else {
            stream = fs.createReadStream(file);
        }

        return CvCircuit.#readStream(stream)
            .then((data) => JSON.parse(data))
            .then((json) => new CvCircuit(json));
    }

    constructor(circuit: JSON, scopeId?: string) {
        //this.#scope = new Scope(scopeId);
        this.#scope = null;
        loadScope(this.#scope, circuit); 
    }

    subcircuit(scopeId: string): CvCircuit {
       throw new Error('Not implemented yet.');
    }

    run(inputs: Record<string, number>): Record<string, number> {
        return {};
    }
}
