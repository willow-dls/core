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

import { CircuitProject } from "./CircuitProject";
import { Circuit, CircuitRunType, CircuitRunResult } from "./Circuit";
import { loadProject, loadCircuit } from "./CircuitLoader";
import { CircuitVerseLoader } from "./CircuitLoader/CircuitVerseLoader";

import { Adder } from "./CircuitElement/Adder";
import { AndGate } from "./CircuitElement/AndGate";
import { BitSelector } from "./CircuitElement/BitSelector";
import { BufferGate } from "./CircuitElement/BufferGate";
import { CircuitVerseALU } from "./CircuitElement/CircuitVerseALU";
import { Clock } from "./CircuitElement/Clock";
import { Constant } from "./CircuitElement/Constant";
import { ControlledInverter } from "./CircuitElement/ControlledInverter";
import { Counter } from "./CircuitElement/Counter";
import { Decoder } from "./CircuitElement/Decoder";
import { Demultiplexer } from "./CircuitElement/Demultiplexer";
import { DFlipFlop } from "./CircuitElement/DFlipFlop";
import { DLatch } from "./CircuitElement/DLatch";
import { Gate } from "./CircuitElement/Gate";
import { Ground } from "./CircuitElement/Ground";
import { Input } from "./CircuitElement/Input";
import { JKFlipFlop } from "./CircuitElement/JKFlipFlop";
import { LSB } from "./CircuitElement/LSB";
import { MSB } from "./CircuitElement/MSB";
import { Multiplexer } from "./CircuitElement/Multiplexer";
import { NandGate } from "./CircuitElement/NandGate";
import { NorGate } from "./CircuitElement/NorGate";
import { OrGate } from "./CircuitElement/OrGate";
import { Output } from "./CircuitElement/Output";
import { Power } from "./CircuitElement/Power";
import { PriorityEncoder } from "./CircuitElement/PriorityEncoder";
import { Random } from "./CircuitElement/Random";
import { SequentialElement } from "./CircuitElement/SequentialElement";
import { Splitter } from "./CircuitElement/Splitter";
import { SRFlipFlop } from "./CircuitElement/SRFlipFlop";
import { SubCircuit } from "./CircuitElement/SubCircuit";
import { TFlipFlop } from "./CircuitElement/TFlipFlop";
import { TriState } from "./CircuitElement/TriState";
import { TwosCompliment } from "./CircuitElement/TwosCompliment";
import { XnorGate } from "./CircuitElement/XnorGate";
import { XorGate } from "./CircuitElement/XorGate";
import { NotGate } from "./CircuitElement/NotGate";
import { JLSLoader } from "./CircuitLoader/JLSLoader";
import { ConsoleLogger } from "./CircuitLogger/ConsoleLogger";
import { FileLogger } from "./CircuitLogger/FileLogger";
import { BitString } from "./BitString";
import { CircuitBus } from "./CircuitBus";
import { CircuitElement } from "./CircuitElement";

import { CircuitLogger, LogLevel, CircuitLoggable } from "./CircuitLogger";
import { CircuitLoader } from "./CircuitLoader";

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
