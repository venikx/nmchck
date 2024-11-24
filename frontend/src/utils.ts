import { CountryCode } from "libphonenumber-js/max";

export function translateCursorPosition(
  rawNumber: string,
  currentCursorPosition: number,
  formattedNumber: string,
) {
  if (currentCursorPosition === 0) {
    return 0;
  }

  const sub = rawNumber.substring(0, currentCursorPosition);
  const numberCountBeforeCursor = sub.replace(/[^0-9]/g, "").length;

  let inputIndex = 0;
  let formattedIndex = 0;
  for (const ch of formattedNumber) {
    if (!Number.isNaN(Number.parseInt(ch))) {
      inputIndex++;
    }

    if (inputIndex === numberCountBeforeCursor) {
      return formattedIndex + 1;
    }

    formattedIndex++;
  }

  return formattedNumber.length;
}

export function countryCodeToUnicodeFlag(countryCode: CountryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
