import {expect, beforeAll, test} from '@jest/globals';

import { loadProject } from "../src/CircuitLoader";
import { CircuitVerseLoader } from "../src/CircuitLoader/CircuitVerseLoader";
import fs from "node:fs";

test("Load CircuitVerse file by name", async () => {
  const project = await loadProject(CircuitVerseLoader, "tests/cv/Simple.cv");
  expect(project).not.toBe(null);
});

test("Load CircuitVerse file by stream", async () => {
  const project = await loadProject(
    CircuitVerseLoader,
    fs.createReadStream("tests/cv/Simple.cv"),
  );
  expect(project).not.toBe(null);
});
