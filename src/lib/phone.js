export const formatUSPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const parseUSPhoneForInput = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  const national =
    digits.startsWith('1') && digits.length >= 11 ? digits.slice(1, 11) : digits.slice(-10);
  return formatUSPhone(national);
};

export const toE164US = (formattedPhone) => {
  const digits = formattedPhone.replace(/\D/g, '');
  return digits.length === 10 ? `+1${digits}` : formattedPhone.trim();
};

export const formatPhoneDisplay = (phone) => {
  if (!phone) return null;
  const parsed = parseUSPhoneForInput(phone);
  return parsed ? `+1 ${parsed}` : phone;
};
