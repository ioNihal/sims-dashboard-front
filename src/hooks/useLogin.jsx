import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/validators";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLogging(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter email and password");
      setIsLogging(false);
      return;
    }

    // Validate the email format using the error message from the validator.
    const emailError = validateEmail(trimmedEmail);
    if (emailError) {
      setError(emailError);
      setIsLogging(false);
      return;
    }

    // Password should be at least 6 characters.
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLogging(false);
      return;
    }

    setIsLogging(true);

    try {
      const response = await fetch("https://suims.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setIsLogging(false);
        return;
      }

      const { token, tokenType, expiresIn, user } = data;
      const expiryTimestamp = Date.now() + expiresIn * 1000;
      localStorage.setItem("token", token);
      localStorage.setItem("tokenType", tokenType);
      localStorage.setItem("tokenExpiry", expiryTimestamp.toString());
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(user));
      if (user.isAdmin) localStorage.setItem("adminEmail", user.email);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLogging(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLogging,
    handleLogin,
  };
};

export default useLogin;
