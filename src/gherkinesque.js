import { test } from "playwright/test";
import { humanizeFunctionName, humanizeStepArgs } from "./format-for-humans.js";

/**
 * @typedef {<Fn extends ((...args: any[]) => any)>(fn: Fn, ...args: Parameters<Fn>) => ReturnType<Fn>} ForwardingFn
 * @template Fn
 */
/**
 * @typedef {F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never} OmitFirstArg
 * @template F
 */

/**
 * A gherkin-like lexicon for writing acceptance tests in playwright.
 *
 * Usage:
 * ```ts
 *   const { given, and, when, then } = new Gherkinesque({...});
 *
 *   await given(an_admin_user);
 *   await and(a_restricted_user, { email: 'elle@elle.dev' });
 *   await when(the_admin_logs_in);
 *   await and(the_admin_shares_a_thing_with_the_restricted_user);
 *   await then(an_email_is_sent_to, 'elle@elle.dev');
 *
 *   // elsewhere:
 *   async function an_admin_user(this: OptionalContextType) {
 *     this.data['admin'] = userFactory.create('admin')
 *     return await db.insert(this.data['admin']);
 *   }
 * ```
 *
 * All methods in Gherkinesque bind their `this` to the context allowing it
 * to be available across test steps. (Similar to cucumber which allows context
 * to be passed between steps.)
 *
 * @template {{}} ContextType
 */
export class Gherkinesque {
  /**
   * Global config which affects all Gherkinesque instances
   */
  static config = Object.seal({
    /**
     * A playwright-conforming step function, defaults to test.step
     */
    stepFunction: test.step,
    /**
     * Logging function, defaults to `console.log`
     */
    log: (...args) => console.log(...args),
  });

  /**
   * @type {import("playwright").Page}
   */
  page;

  /**
   * To pass data between steps.
   * @type {ContextType}
   */
  // @ts-ignore
  data = {};

  /**
   * @param {ContextType} context
   */
  // @ts-ignore
  constructor(context = {}) {
    Object.assign(this, context);
  }

  // given = async function _given<Fn extends FunctionConstructor>(fn: Fn, ...args: Parameters<Fn>) {
  //   return given(fn.bind(this), ...args);
  // }.bind(this);

  /**
   * @type {ForwardingFn<T>}
   * @template T
   */
  given = (fn, ...args) => given(fn.bind(this), ...args);

  /**
   * @type {ForwardingFn<T>}
   * @template T
   */
  and = (fn, ...args) => and(fn.bind(this), ...args);

  /**
   * @type {ForwardingFn<T>}
   * @template T
   */
  then = (fn, ...args) => then(fn.bind(this), ...args);

  /**
   * @type {ForwardingFn<T>}
   * @template T
   */
  when = (fn, ...args) => when(fn.bind(this), ...args);

  /**
   * @param {Function} fn
   * @param {string} name
   */
  #using = async (fn, name, data) => {
    this.data[name] = data;
    return fn(name, data);
  };

  /** @type {OmitFirstArg<typeof this.#using>} */
  using_these = this.#using.bind(this, using_these);

  /** @type {OmitFirstArg<typeof this.#using>} */
  and_these = this.#using.bind(this, and_these);

  /** @type {OmitFirstArg<typeof this.#using>} */
  using_this = this.#using.bind(this, using_this);

  /** @type {OmitFirstArg<typeof this.#using>} */
  and_this = this.#using.bind(this, and_this);
}

// helpers:

/**
 * @param {string} prefix
 * @param {() => unknown} fn
 * @param  {...any} args
 * @returns
 */
async function stepWhichRunsFunction(prefix, fn, ...args) {
  const stepName = `${prefix} ${humanizeFunctionName(fn)}`;
  const humanName = stepName + humanizeStepArgs(args);
  Gherkinesque.config.log(`${humanName}`);
  return Gherkinesque.config.stepFunction(humanName, fn);
}
export const given = stepWhichRunsFunction.bind(null, "given");
export const and = stepWhichRunsFunction.bind(null, "and");
export const when = stepWhichRunsFunction.bind(null, "when");
export const then = stepWhichRunsFunction.bind(null, "then");

/**
 * @param {string} prefix
 * @param {string} name
 * @param {*} data
 * @returns
 */
export async function stepWhichOnlyPrints(prefix, name, data) {
  name = `${prefix} ${name}`;
  const humanName = `${name} ${JSON.stringify(data)}`;
  Gherkinesque.config.log(humanName);
  return Gherkinesque.config.stepFunction(humanName, () => {});
}

/** @type {OmitFirstArg<typeof stepWhichOnlyPrints>} */
const using_these = stepWhichOnlyPrints.bind(null, "using these");

/** @type {OmitFirstArg<typeof stepWhichOnlyPrints>} */
const and_these = stepWhichOnlyPrints.bind(null, "and these");

/** @type {OmitFirstArg<typeof stepWhichOnlyPrints>} */
const using_this = stepWhichOnlyPrints.bind(null, "using this");

/** @type {OmitFirstArg<typeof stepWhichOnlyPrints>} */
const and_this = stepWhichOnlyPrints.bind(null, "and this");
