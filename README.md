# Gherkinesque-playwright

BDD and acceptance testing for Javascript and Typescript.

Why? The gherkin syntax is often overkill.  Matching the strings with the step
definitions, organizing those step definitions and step-definition files, and
writing reusable functions for the step definitions is... more than a bit
awkward.

With Gherkinesque we can write tests that are almost as readable with less work
and less awkward code.

For example,

```ts
await given(player_1_started_a_game_with_the_word, "xylem");
await when(player_2_joins_the_game);
await then(player_2_must_guess_a_word_of_length, 5);
```

is simpler to maintain and reads well enough without needing to go all the way
to this:

```gherkin
Given player 1 started a game with the word "xylem"
When player 2 joins the game
Then player 2 must guess a word with 5 characters
```

(Yeah, those "await" keywords are unfortunate, but that's what happens when C#
programmers influence the direction of an otherwise tolerable but quirky
language.)

This doesn't replace gherkin syntax for all situations, and this isn't trying
to.  This can, however, replace gherkin syntax for many situations and make for
easier-to-write and easier-to-maintain tests.

## Getting started

```sh
npm install --save-dev gherkinesque-playwright
```

Gherkinesque works with any test runner and framework that supports playwright.

```ts
// In a test file:

test("player 2 joins a game after a word was already chosen", async ({ page }) => {
  const { given, and, when, then } = new Gherkinesque({ page });

  await given(player_1_started_a_game_with_the_word, "xylem");
  await when(player_2_joins_the_game);
  await then(player_2_must_guess_a_word_of_length, 5);
});
```
```ts
// elsewhere:

export function player_1_started_a_game_with_the_word(this: Gherkinesque, word: string) {
  await this.page.goto('https://example.com/my-game');
  // ...
}

export function player_2_joins_the_game(this: Gherkinesque) {
  // ...
}

export function player_2_must_guess_a_word_of_length(this: Gherkinesque, length: number) {
  // ...
}
```

## The snake_case elephant in the room

"So... what's with the snake_case? convention in both Javascript and Typescript
is camelCase."

I recommend that all "steps" be snake_case, and _everything else_ be camelCase
as the javascript wizards intended.  It strikes a nice balance which (A) makes
the gherkinesque code easier to read, and (B) makes it clear when a step is
accidentally calling another step.  (Aside: when steps call other steps it
implies the code is being grouped into steps arbitrarily instead of thoughtfully
with specific layers for specific abstractions).

## Contributing

```sh
bun install
bun run test
# or
npm install
npm run test
```

Big thanks to all the people who've submitted PRs.  Open source depends on you.
(We're screwed.)