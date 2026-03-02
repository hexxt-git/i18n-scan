import { z } from "zod";

// Test 1: Object with user-facing strings
const errorMessages = {
  required: "This field is required",
  invalid: "Invalid input provided",
  tooShort: "Must be at least 5 characters",
};

const config = {
  title: "Welcome to our platform",
  description: "Start your journey today",
  buttonText: "Get Started Now",
};

// Test 2: Zod schemas
const userSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, { message: "Password is too long" }),
  username: z.string().describe("Your unique username"),
});

const ageSchema = z.number().min(18, "You must be 18 or older");

// Test 3: Toast/Error calls
function handleSubmit() {
  toast.success("Form submitted successfully!");
  toast.error("Failed to submit form");
  console.error("Something went wrong");
  console.warn("This action cannot be undone");
}

// Test 4: Error throwing
function validateInput(value: string) {
  if (!value) {
    throw new Error("Input cannot be empty");
  }
  if (value.length < 3) {
    throw new Error("Input must be at least 3 characters long");
  }
}

// Test 5: Should NOT extract (technical strings)
const technicalStrings = {
  className: "flex items-center", // Should skip
  apiUrl: "/api/users", // Should skip
  method: "POST", // Should skip
};

// Test 6: Mixed object (should extract some, skip others)
const mixedConfig = {
  endpoint: "/api/submit", // Should skip
  message: "Your data has been saved", // Should extract
  className: "button-primary", // Should skip
  label: "Save Changes", // Should extract
};

export function TestComponent() {
  return (
    <div>
      <h1>Test Component</h1>
      <p>Regular JSX text should still work</p>
    </div>
  );
}
