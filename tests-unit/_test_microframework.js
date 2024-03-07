import { Gherkinesque } from "../src/index.js";

export function expect(arg) {
  return {
    toBe(value) {
      if (arg !== value) {
        throw new Error(`Expected "${arg}" to be "${value}"`);
      }
    },
  };
}

export const steps = [];
export const logs = [];

let passes = 0;
let fails = 0;

export async function test(name, cb) {
  process.stdout.write("⇢ " + name + "... running");

  steps.length = 0;
  logs.length = 0;

  Gherkinesque.config.stepFunction = async function (name, cb) {
    steps.push(name);
    return cb();
  };
  Gherkinesque.config.log = (arg) => {
    logs.push(arg);
  };

  let error;
  try {
    await cb();
  } catch (e) {
    error = e;
  }

  process.stdout.write("\r\x1b[K"); // clear line
  if (!error) {
    passes++;
    process.stdout.write("✅ " + name + "\n");
  } else {
    fails++;
    process.stdout.write("❌ " + name + "\n");
    console.log(error);
  }
}

export function printSummary() {
  console.log()
  if (fails > 0) {
    console.log('\x1b[31m%s\x1b[0m, \x1b[36m%s\x1b[0m', `${fails} failed`, `${passes} passed`);
  } else {
    console.log('\x1b[36m%s\x1b[0m', `All ${passes} passed`);
  }
}