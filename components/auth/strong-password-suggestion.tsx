
export function generateStrongPassword(): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "@$!%*?&#";
  const allChars = lowercase + uppercase + numbers + special;

  let password = "";
  const getRandomIndex = (max: number): number => {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] % max;
  };
  
  password += lowercase[getRandomIndex(lowercase.length)];
  password += uppercase[getRandomIndex(uppercase.length)];
  password += numbers[getRandomIndex(numbers.length)];
  password += special[getRandomIndex(special.length)];
 

  

  
  const length = getRandomIndex(5) + 12;
  for (let i = password.length; i < length; i++) {
    password += allChars[getRandomIndex(allChars.length)];
  }

  
  // Fisher-Yates shuffle 
  const chars = password.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    const j = randomBuffer[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}
