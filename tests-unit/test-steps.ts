export function an_admin_user() {
  this.users ??= [];
  this.users.push({ email: "admin@example.com", admin: true });
}

export function a_restricted_user(overrides) {
  this.users ??= [];
  this.users.push({
    email: "restricted@example.com",
    admin: false,
    ...overrides,
  });
}

export async function the_admin_logs_in() {
  return new Promise((resolve) => {
    setTimeout(resolve, 2);
  });
}

export function the_admin_shares_a_thing_with_the_restricted_user() {
  // no implementation needed for these tests
}

export function an_email_is_sent_to(recipientEmail) {
  // assertion would go here.
}
