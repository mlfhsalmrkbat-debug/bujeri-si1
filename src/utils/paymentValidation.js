export function isDuplicatedCardNumber(digits) {
  if (digits.length !== 16) return false;
  if (/^(\d)\1{15}$/.test(digits)) return true;
  if (/(\d)\1{4,}/.test(digits)) return true;
  if (digits.slice(0, 8) === digits.slice(8)) return true;
  if (/^(\d{4})\1{3}$/.test(digits)) return true;
  if (/^(\d{2})\1{7}$/.test(digits)) return true;
  return false;
}

export function validatePaymentDetails({ cardDigits, expiryDate, cvv, cardName, isAmex }) {
  const isAmexCard = isAmex || cardDigits.startsWith("3");
  const isValidLength = isAmexCard
    ? cardDigits.length === 15 || cardDigits.length === 16
    : cardDigits.length === 16;

  if (!isValidLength) {
    return "errors.cardLength16";
  }
  if (isDuplicatedCardNumber(cardDigits)) {
    return "errors.duplicateCard";
  }
  if (!expiryDate || !expiryDate.includes("/")) {
    return "errors.invalidExpiryFormat";
  }
  const [month, year] = expiryDate.split("/");
  const monthNum = parseInt(month, 10);
  if (!month || !year || monthNum < 1 || monthNum > 12) {
    return "errors.invalidExpiry";
  }
  if (/^(\d)\1+$/.test(month) || /^(\d)\1+$/.test(year)) {
    return "errors.invalidExpiry";
  }
  const isValidCvv = isAmexCard
    ? cvv.length === 3 || cvv.length === 4
    : cvv.length === 3;

  if (!isValidCvv) {
    return "errors.invalidCvv";
  }
  const name = cardName.trim();
  if (name.length < 3) {
    return "errors.invalidHolderName";
  }
  const nameCompact = name.replace(/\s/g, "");
  if (/^(.)\1{4,}$/.test(nameCompact)) {
    return "errors.invalidHolderName";
  }
  return null;
}
