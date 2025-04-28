// src/utils/validators.js
export const validateName = (name) => {
  const trimmed = name.trim();
  if (!trimmed) return "Name is required.";
  if (!/^[A-Za-z\s]+$/.test(trimmed)) return "Name can only contain letters and spaces.";
  return "";
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required.";
  if (!emailRegex.test(email)) return "Invalid email format.";
  return "";
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6789]\d{9}$/;
  if (!phone.trim()) return "Phone number is required.";
  if (!phoneRegex.test(phone)) return "Enter a valid 10-digit Indian phone number.";
  return "";
};


/**
 * Validate password strength.
 * Requirements:
 *  - at least 8 characters
 *  - at least one uppercase letter
 *  - at least one lowercase letter
 *  - at least one digit
 *  - at least one special character
 * @param {string} pwd
 * @returns {string} error message or empty string if valid
 */
export const validatePassword = (pwd) => {
  if (!pwd || !pwd.trim()) return "Password is required.";
  if (pwd.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(pwd)) return "Password must contain at least one digit.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "Password must contain at least one special character.";
  return "";
};


export const validateObjectId = (id) => {
  if (!id) {
    return "ID Required.";
  }
  return "";
};

export const validateQuantity = (qty) => {
  if (qty === "" || qty === null || qty === undefined) {
    return "Quantity is required.";
  }
  const n = parseInt(qty, 10);
  if (isNaN(n) || n < 0) {
    return "Quantity must be a non‑negative integer.";
  }
  return "";
};

export const validateAddress = (address) => {
  return address.trim() ? "" : "Address is required.";
};

export const validateThreshold = (t) => {
  if (t === "") return "Please enter a threshold.";
  if (!/^\d+$/.test(t) || parseInt(t, 10) < 0)
    return "Threshold must be a non‑negative integer.";
  return "";
};

export const capitalize = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const formatDate = (date, includeTime = true) => {
  const baseOptions = {
    day: "2-digit",
    month: `${includeTime ? "short" : "long"}`,
    year: "numeric",
  };

  const timeOptions = includeTime
    ? {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
    : {};

  return new Date(date).toLocaleString("en-IN", {
    ...baseOptions,
    ...timeOptions,
  });
};


