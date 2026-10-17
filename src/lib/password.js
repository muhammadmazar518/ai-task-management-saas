// Returns { score: 0-4, label } for the strength meter.
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "" };
  if (password.length < 8) return { score: 0, label: "Too short" };

  let score = 1; // 8+ characters
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

// Rules that the server enforces on signup.
export function validatePasswordRules(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}