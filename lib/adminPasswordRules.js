// The password rule for the administrator: Option A and the owner reset.
// The server enforces the same rule; this copy gives the reason before a
// request is sent.

export const PASSWORD_RULE_TEXT =
  "At least 12 characters, with an uppercase letter, a lowercase letter, a number and a symbol.";

/** Returns the reason a new password is refused, or an empty string when it is acceptable. */
export const newPasswordProblem = (current, next) => {
  if (next.length < 12) return "The new password must be at least 12 characters.";
  if (!/[A-Z]/.test(next) || !/[a-z]/.test(next) || !/[0-9]/.test(next) || !/[^A-Za-z0-9]/.test(next)) {
    return "The new password needs an uppercase letter, a lowercase letter, a number and a symbol.";
  }
  if (current && current === next) return "The new password must be different from the current password.";
  return "";
};