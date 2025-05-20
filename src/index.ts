/*
 * Copyright (c) 2025 Jordan Bancino <jordan@bancino.net>
 * Copyright (c) 2025 Austin Hargis <hargisa@mail.gvsu.edu>
 * Copyright (c) 2025 Aaron MacDougall <macdouaa@mail.gvsu.edu>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { CircuitProject } from "./CircuitProject.js";
import { Circuit, CircuitRunType, CircuitRunResult } from "./Circuit.js";
import { loadProject, loadCircuit } from "./CircuitLoader.js";
import { CircuitVerseLoader } from "./CircuitLoader/CircuitVerseLoader.js";

import { Adder } from "./CircuitElement/Adder.js";
import { AndGate } from "./CircuitElement/AndGate.js";
import { BitSelector } from "./CircuitElement/BitSelector.js";
import { BufferGate } from "./CircuitElement/BufferGate.js";
import { CircuitVerseALU } from "./CircuitElement/CircuitVerseALU.js";
import { Clock } from "./CircuitElement/Clock.js";
import { Constant } from "./CircuitElement/Constant.js";
import { ControlledInverter } from "./CircuitElement/ControlledInverter.js";
import { Counter } from "./CircuitElement/Counter.js";
import { Decoder } from "./CircuitElement/Decoder.js";
import { Demultiplexer } from "./CircuitElement/Demultiplexer.js";
import { DFlipFlop } from "./CircuitElement/DFlipFlop.js";
import { DLatch } from "./CircuitElement/DLatch.js";
import { Gate } from "./CircuitElement/Gate.js";
import { Ground } from "./CircuitElement/Ground.js";
import { Input } from "./CircuitElement/Input.js";
import { JKFlipFlop } from "./CircuitElement/JKFlipFlop.js";
import { LSB } from "./CircuitElement/LSB.js";
import { MSB } from "./CircuitElement/MSB.js";
import { Multiplexer } from "./CircuitElement/Multiplexer.js";
import { NandGate } from "./CircuitElement/NandGate.js";
import { NorGate } from "./CircuitElement/NorGate.js";
import { OrGate } from "./CircuitElement/OrGate.js";
import { Output } from "./CircuitElement/Output.js";
import { Power } from "./CircuitElement/Power.js";
import { PriorityEncoder } from "./CircuitElement/PriorityEncoder.js";
import { Random } from "./CircuitElement/Random.js";
import { SequentialElement } from "./CircuitElement/SequentialElement.js";
import { Splitter } from "./CircuitElement/Splitter.js";
import { SRFlipFlop } from "./CircuitElement/SRFlipFlop.js";
import { SubCircuit } from "./CircuitElement/SubCircuit.js";
import { TFlipFlop } from "./CircuitElement/TFlipFlop.js";
import { TriState } from "./CircuitElement/TriState.js";
import { TwosCompliment } from "./CircuitElement/TwosCompliment.js";
import { XnorGate } from "./CircuitElement/XnorGate.js";
import { XorGate } from "./CircuitElement/XorGate.js";
import { NotGate } from "./CircuitElement/NotGate.js";
import { JLSLoader } from "./CircuitLoader/JLSLoader.js";
import { ConsoleLogger } from "./CircuitLogger/ConsoleLogger.js";
import { FileLogger } from "./CircuitLogger/FileLogger.js";
import { BitString } from "./BitString.js";
import { CircuitBus } from "./CircuitBus.js";
import { CircuitElement } from "./CircuitElement.js";

import { CircuitLogger, LogLevel, CircuitLoggable } from "./CircuitLogger.js";
import { CircuitLoader } from "./CircuitLoader.js";

export {
  // Elements
  Adder,
  AndGate,
  BitSelector,
  BufferGate,
  CircuitVerseALU,
  Clock,
  Constant,
  ControlledInverter,
  Counter,
  Decoder,
  Demultiplexer,
  DFlipFlop,
  DLatch,
  Gate,
  Ground,
  Input,
  JKFlipFlop,
  LSB,
  MSB,
  Multiplexer,
  NandGate,
  NorGate,
  NotGate,
  OrGate,
  Output,
  Power,
  PriorityEncoder,
  Random,
  SequentialElement,
  Splitter,
  SRFlipFlop,
  SubCircuit,
  TFlipFlop,
  TriState,
  TwosCompliment,
  XnorGate,
  XorGate,

  // Logger
  CircuitLogger,
  CircuitLoggable,
  ConsoleLogger,
  FileLogger,
  LogLevel,

  // Loader
  CircuitLoader,
  loadProject,
  loadCircuit,
  CircuitVerseLoader,
  JLSLoader,

  // Base
  BitString,
  Circuit,
  CircuitBus,
  CircuitElement,
  CircuitProject,
};

export type { CircuitRunType, CircuitRunResult };
