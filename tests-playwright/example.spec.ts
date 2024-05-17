import { test, expect } from '@playwright/test';
import { Gherkinesque } from '../src/index.js';

test("it works with all the type checking and playwright page", async ({ page }) => {
  const { given, then } = new Gherkinesque({ page });

  await given(async function page_is_defined_on_this(this: Gherkinesque<{}>) {
    expect(this.page).toBeDefined()
    await this.page.goto('about:config');
  });
  await then(async function all_is_good() {});
});
