# Willow Digital Logic Simulator

**Willow DLS** is a digital logic simulator framework written in TypeScript with support for executing circuits for educational logic simulators such as [CircuitVerse](https://circuitverse.org), [JLS](#) and [LogiSim](#). It is platform- and simulator-agnostic, and is primarily intended to be used for headless testing of circuits via a unit testing framework such as [Jest](#). Willow was created as an undergraduate project at Grand Valley State University but is now published as an open-source package independently.

> [!NOTE] Willow is a _headless_ DLS _framework_. It does not implement a GUI and has no intentions to do so. The intended use cases are:
>
> - Software developers who want to write a DLS GUI in TypeScript using Willow as the actual logic engine.
> - Students and other users who design circuits in a well-known GUI platform (see above) and want to test them with a unit testing library for more thorough and precise automated testing than what those simulators provide by default.
>   Willow was initially designed with this latter use case in mind, and thus may not be optimal or ideal for the former.

> [!WARNING] Willow targets the NodeJS execution environment. It currently will not run client-side in the browser due to dependencies on the NodeJS standard library. This limitation exists primarily in the circuit loading logic; theoretically we just have to decouple the loading logic into a separate package to enable client-side browser execution, but that is currently beyond the scope of this project.

## Features

- **Extensible:** Willow makes no assumptions about where your circuit came from or what elements it contains. While we ship a default set of base elements and circuit loaders, Willow is designed to allow custom circuit elements and circuit loaders to be implemented with ease.
- **Simple:** Willow uses a simple event loop to evaluate circuits. It doesn't use overly complex algorithms or performance optimizations, make it it trivial to understand and modify, particularly for students. The relative simplicity compared to other circuit simulators is intended to lower the barrier to entry and allow students to not only simulate their own circuits, but also understand how circuit simulators can be implemented.
- **Robust Logging:** The custom logging facility is as extensible as the rest of the engine. It allows users and developers to inspect just about any part of the engine as a circuit runs, which can be helpful in debugging either the engine itself or circuits running it it. Logs are extremely granular, with log levels and subsystem tags, providing the ability to drill down and see logs for only a certain part of the system, or capture everything all at once.
- **Well-Documented TypeScript:** Willow is written fully in TypeScript, making it easier to use because the type system can catch common errors and mistakes. Furthermore, Willow is extremely well-documented, publishing full API documentation and sample code.

## Getting Started

To start using Willow, simply set up a new NPM package as you do and then install Willow as a dependency. If this is your first NodeJS project, make sure you have Node and NPM installed on your machine. Instructions can be found [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). You will also have to set up a new NPM package where your own code will live. You can do so by creating an empty directory and running `npm init`.

> [!NOTE] You don't have to publish your package. This can just as easily be a private repository for testing your circuits locally. NPM simply requires you to have a `package.json` file into which the Willow DLS dependencies can be installed.

Install Willow into your project with the following command:

```
$ npm install @willow-dls/core
```

This will install the package, including all of the required dependencies. You can then install your unit testing framework of choice to test your circuits, or implement whatever other functionality you wish. Willow doesn't prescribe a certain use case; whatever you can make it do, you can use it for. Consult the API documentation for details on how to load projects and circuits as well as execute them in the simulator.

## Example: Unit Testing CircuitVerse Circuits With Jest & TypeScript

The most common use case for Willow will probably be to unit test circuits generated by CircuitVerse (or another circuit simulator&mdash;apply the relevant instructions accordingly) using a unit testing framework such as Jest. This example walks through the entire setup of a testing repository where you can test CircuitVerse circuits using Jest and TypeScript.

### Automated Template

> [!WARNING] This functionality actually hasn't been implemented yet. Please use the manual install procedure documented below until this notice disappears.

Willow provides an installer package just for this example. If you want to use Jest and TypeScript with Willow, you can simply run the following command to initialize a project for you:

```
$ npx @willow-dls/jest-ts
```

This will automatically install the necessary dependencies and sets up Jest and TypeScript for you so you can start writing tests right away.

### Manual Install

If you prefer to manually install and configure Jest and TypeScript, you are more than welcome to do so however you see fit. Beginners might wish to start with these instructions, however, to get a working setup as quickly as possible without having to know all of the theory behind what you're doing&mdash;though you should learn the theory at some point.

#### Step 0: Install Dependencies

If you don't already have NodeJS and NPM installed, go ahead and make sure those are installed and available in your shell's `PATH`.

#### Step 1: Initialize Workspace

Start by creating a folder for your circuits to live and installing the simulator as well as the unit testing framework.

```
$ mkdir my-circuits
$ cd my-circuits
$ npm init
$ npm install --save-dev jest typescript @types/node @types/jest @jest/globals @babel/preset-env @babel/preset-typescript
$ npm install @willow-dls/core
```

Next, configure TypeScript by creating a `tsconfig.json` in the root of your project directory. We have this in ours; you should be able to copy and paste it without any modifications.

```json
{
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*"],
  "compilerOptions": {
    "moduleResolution": "node",
    "isolatedModules": true,
    "lib": ["esnext", "dom"],
    "declaration": true,
    "allowJs": true,

    "target": "esnext" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    "module": "esnext" /* Specify what module code is generated. */,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    "strict": true /* Enable all strict type-checking options. */
  }
}
```

Then, create a Babel config (Jest uses Babel). Babel requires `babel.config.cjs` in the root of the project directory. We have this in our repository, and again, you should have no difficulties copying and pasting this:

```js
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
};
```

> [!NOTE] We are using the CommonJS module syntax for our Babel configuration for compatibility with Windows&mdash;for some reason our Windows developer could not get the ESM syntax to work. However, Willow uses the ESM module syntax for all of the code and is published as an ESM module.

#### Step 2: Export Your Circuits

In this example, we are using CircuitVerse. If you are using a different circuit simulator, please refer to the documentation for your simulator to export circuits as data files.

> [!NOTE] Your circuit must assign a unique label to all inputs and outputs. This is because the simulator needs a way to uniquely identify all of the circuit's IO for testing. If you don't assign labels, you will get a "duplicate label" error as all elements have a blank string as their label by default.

From the CircuitVerse simulator with your project open, at the top of the window, click 'Project' and navigate down to 'Export as File'. A window will pop up with a prompt to provide the name of the circuit and a save button.

![alt text](image.png)

Once you've named your file, save the project. Depending on your browser settings, it will either provide a prompt on where to save it or it will automatically save to your downloads folder on your local computer. In any case, the result should be a `.cv` file.

Place your `.cv` file in your project directory.

#### Step 3: Setting Up Tests

Jest will automatically scan and execute all files ending in `.test.js` or `.test.ts`, no further setup required. Create a new file, for example, `MyCircuit.test.ts`, and populate it with the following contents, editing and replacing the necessary code to fit your use case:

```js
import { expect, beforeAll, test } from "@jest/globals";
import { loadProject, CircuitVerseLoader } from "@willow-dls/core";

let circuit;

// Before running any tests, load your circuit using the CircuitVerse
// loader and Willow's loadProject() function.
beforeAll(async () => {
  // Set the file path of your .cv file here.
  const cvFile = "MyCircuit.cv";

  // If you renamed your circuit in CircuitVerse, set the name
  // here. CircuitVerse defaults to Main, so if you didn't change
  // your circuit's name, you should be able to leave this
  // as-is.
  const circuitName = "Main";

  const project = await loadProject(CircuitVerseLoader, cvFile);
  circuit = project.getCircuitByName(circuitName);
});

// This is a sample test that shows you how to declare inputs and
// outputs as well as run the simulation for basic circuits without
// clocks. You'll have to adjust most of this code to adequately
// test your circuit. You can add more of these test() calls below
// to add distinct tests.
test("Sample Test", () => {
  // Declare circuit inputs by label. This object is keyed by the
  // labels you assigned to your circuit in Step 2.
  const inputs = {
    inp1: "01",
    inp2: "10",
  };

  // Declare expected outputs by label. This object is keyed by
  // the labels you assigned to your circuit in Step 2.
  const expectedOutputs = {
    out1: "11",
  };

  // Execute the circuit, returning the results.
  const result = circuit.run(inputs);

  // This line is just for demonstration, most likely you won't
  //  care about the propagation delay.
  // expect(result.propagationDelay).toBe(10);

  // Compare the actual results to the expected results.
  expect(result.outputs).toStrictEqual(exectedOutputs);
});
```

> [!Note]
> This file will not work out of the box. You will have to modify it substantially to work with your circuit.

You can add as many test cases to a file as you want, and you can even generate them programmatically as well. Furthermore, you can add as many test files as you want, and Jest will automatically pick them up.

#### Step 4: Run Tests

Running your tests is the easiest part! On the command line, simply enter the command

```
$ npm test
```

Jest will then run through all the test files in your tests folder and check your circuits against your tests. It will then output to your CLI whether your tests have passed or failed. If your tests failed, it will provide the output it received compared to the output it expected.

## Example: Building From Source

Sometimes, you may not want to install Willow from NPM, but rather build it from source, most likely for development and testing, or peace of mind. Here's how you do that in your local environment:

1. Clone the Git repository:
   ```
   $ git clone https://github.com/willow-dls/core.git willow-dls-core
   ```
1. Install all dependencies and build the package:
   ```
   $ cd willow-dls-core
   $ npm install
   $ npm run build
   ```
1. Go to your NPM package into which you wish to install Willow from source.
1. There, run the following command, adjusting the path to the Willow repository:
   ```
   $ npm install '../path/to/willow-dls-core'`
   ```

You should now be able to run your package using the local source code. Note that any time you make modifications to Willow, you will have to re-run the `npm run build` step to regenerate the JavaScript code.

## What Next?

Now that you can run basic tests and have a general understanding of how Willow works, check out the API documentation, taking special note of the following classes, which are the main user-facing classes and functions:

- `loadProject`: Used for loading circuit projects. See the subclasses of `CircuitLoader` for implementations of available loaders, which can take in simulator-specific data and translate it into Willow internal data structures.
- `CircuitProject`: Used for storing a collection of circuits. This is what will be returned by a circuit loader.
- `BitString`: Used for passing values into circuits and getting values out of circuits.
- `Circuit`: Used for actually executing a circuit simulation.

Most of the other classes are used mostly internally. Though they may surface occasionally, you likely won't have to do much with them unless you are implementing your own circuit loader or doing processing/optimization on your circuits once they are loaded into Willow's data structures. If you _do_ want to implement your own loader or your own circuit elements, the following additional classes will also be helpful to you:

- `CircuitElement`: The base class for all circuit elements.
- `CircuitBus`: The way that bit values are communicated between elements.
- `CircuitLoader`: The base class for all custom circuit loaders.

### Contributing

Contributing to this project is as straightforward as most others these days. Just open up a Pull Request on GitHub. However, before submitting your pull request, do remember to do the following:

1. Write tests for your new code and make sure they pass by running `npm run test`.
1. Make sure all the existing tests pass by running `npm run test`.
1. Format all code by running `npm run format`

Then you can commit and push your changes.

## Change Log

### v0.4.0

- Added complete API documentation.
- Implemented the JLS project loader.
- Implemented the Logisim project loader.

### v0.3.0

Initial public release after re-branding the internal project.
