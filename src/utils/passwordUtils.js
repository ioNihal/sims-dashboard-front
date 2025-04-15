export const generatePassword = () => {
    // Determine the length between 8 and 12.
    const length = Math.floor(Math.random() * 5) + 8;
  
    // Separate character sets for clarity.
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "#@*$!";
    const allChars = letters + numbers + specials;
  
    // Ensure at least one character from each required category.
    let passwordChars = [
      letters.charAt(Math.floor(Math.random() * letters.length)),
      numbers.charAt(Math.floor(Math.random() * numbers.length)),
      specials.charAt(Math.floor(Math.random() * specials.length))
    ];
  
    // Fill the remaining characters from the combined set.
    for (let i = 3; i < length; i++) {
      passwordChars.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
    }
  
    // Shuffle the array to avoid fixed positions for required characters.
    for (let i = passwordChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }
  
    // Join and return the password.
    return passwordChars.join('');
  };
  