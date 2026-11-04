/** Convert Arabic-Indic (٠-٩) and Eastern Arabic (۰-۹) digits to 0-9. */
export function toWesternDigits(value) {
  return String(value ?? "")
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

export function normalizeSaudiNationalId(value) {
  return toWesternDigits(value).replace(/\D/g, "");
}

/**
 * MOI / NIC check digit for the 10-digit Saudi National ID / Iqama.
 * Positions 1,3,5,7,9 (0-based even) are doubled; if the product is two
 * digits those digits are added. The total must be a multiple of 10.
 */
export function passesSaudiIdChecksum(id) {
  if (!/^[12]\d{9}$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const digit = Number(id[i]);
    if (i % 2 === 0) {
      const doubled = digit * 2;
      sum += Math.floor(doubled / 10) + (doubled % 10);
    } else {
      sum += digit;
    }
  }
  return sum % 10 === 0;
}

export function isValidSaudiNationalId(value) {
  const id = normalizeSaudiNationalId(value);
  return id.length === 10 && passesSaudiIdChecksum(id);
}

/**
 * @returns {string|null} locale key under errors.*, or null if valid.
 */
export function validateSaudiNationalId(value, { requireComplete = true } = {}) {
  const id = normalizeSaudiNationalId(value);

  if (!id) return requireComplete ? "errors.nationalIdInvalid" : null;

  if (id[0] !== "1" && id[0] !== "2") {
    return "errors.nationalIdPrefix";
  }

  if (id.length < 10) {
    return requireComplete ? "errors.nationalIdLength" : null;
  }

  if (id.length > 10 || !passesSaudiIdChecksum(id.slice(0, 10))) {
    return "errors.nationalIdChecksum";
  }

  return null;
}
