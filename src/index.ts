import { CircuitProject } from "./CircuitProject";
import { Circuit } from "./Circuit";
import { loadProject } from "./CircuitLoader";
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

import { CircuitLogger as Abstract_CircuitLogger } from "./CircuitLogger";
import { CircuitLoader as Abstract_CircuitLoader } from "./CircuitLoader";

export const CiruitElement = {
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
  XorGate
};

export const CircuitLoader = {
  Base: Abstract_CircuitLoader,
  loadProject,
  CircuitVerseLoader,
  JLSLoader,
};

export const CircuitLogger = {
  Base: Abstract_CircuitLogger,
  ConsoleLogger,
  FileLogger
};

export default {
  BitString,
  Circuit,
  CircuitBus,
  CircuitElement,
  CircuitProject
};
