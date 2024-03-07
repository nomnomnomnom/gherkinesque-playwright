import { Gherkinesque } from "../src/index.js";
import { expect, logs, steps, test, printSummary } from "./_test_microframework.js";
import {
  a_restricted_user,
  an_admin_user,
  an_email_is_sent_to,
  the_admin_logs_in,
  the_admin_shares_a_thing_with_the_restricted_user,
} from "./test-steps.js";

/**
 * The usual "given X, when Y, then Z" should just work.  
 *
 * It should invoke the functions defined for X, Y, and Z, with all the correct
 * arguments and with a human-friendly step name printed to the logs.  
 *
 * (It also does Typescript type checking for all the arguments.)
 */
await test("given, and, when, and then all work", async () => {
  const { given, and, when, then } = new Gherkinesque();

  await given(an_admin_user);
  await and(a_restricted_user, { email: "elle@example.com" });
  await when(the_admin_logs_in);
  await and(the_admin_shares_a_thing_with_the_restricted_user);
  await then(an_email_is_sent_to, "elle@example.com");

  //-----------------
  expect(steps.length).toBe(5);
  expect(logs[0]).toBe("given an admin user");
  expect(logs[1]).toBe(`and a restricted user {"email":"elle@example.com"}`);
  expect(logs[2]).toBe("when the admin logs in");
  expect(logs[3]).toBe("and the admin shares a thing with the restricted user");
  expect(logs[4]).toBe('then an email is sent to "elle@example.com"');
});

/**
 * We've added a "using_these('things', myThings)" to the gherkin syntax for
 * convenience.  I'm not convinced it's fundamentally much different from
 * "given".
 */
await test("using_these and and_this both work", async () => {
  const { given, when, then, using_these, and_this } = new Gherkinesque();

  await using_these("numbers", [1, 2]);
  await and_this("letter", "A");
  await given(an_admin_user);
  await when(the_admin_logs_in);
  await then(function the_data_is_available() {
    expect(this.data.numbers[0]).toBe(1);
    expect(this.data.numbers[1]).toBe(2);
    expect(this.data.letter).toBe("A");
  });

  //-----------------
  expect(logs[0]).toBe("using these numbers [1,2]");
  expect(logs[1]).toBe(`and this letter "A"`);
  expect(logs[2]).toBe("given an admin user");
  expect(logs[3]).toBe("when the admin logs in");
  expect(logs[4]).toBe("then the data is available");
});

printSummary();