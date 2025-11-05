export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateDomain = (domain: string): boolean => {
  const re = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  return re.test(domain);
};

export const validatePassword = (password: string): { valid: boolean; strength: string } => {
  if (password.length < 6) return { valid: false, strength: 'weak' };
  if (password.length < 10) return { valid: true, strength: 'medium' };
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) {
    return { valid: true, strength: 'strong' };
  }
  return { valid: true, strength: 'medium' };
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price < 10000000;
};
