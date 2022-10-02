export default {
  validEmailMessage: "Please enter a valid email address",
  passwordMinLength: "Password is too short - min length is 10 characters",
  passwordMaxLength: "Password is too long - max length is 30 characters",
  vagueLoginMessage: "Invalid username or password", //keep vague so user doesn't try to spam endpoint to see who has an account
  forgotPasswordMessage:
    "If a user with that email is registered you will receive a password reset email", //so users don't keep spamming this endpoint to see which emails are registered or not
};
