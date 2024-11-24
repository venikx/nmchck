import { createSignal, For, JSX } from "solid-js";
import {
  getCountries,
  CountryCode,
  formatIncompletePhoneNumber,
  parseIncompletePhoneNumber,
  parsePhoneNumber,
  getCountryCallingCode,
} from "libphonenumber-js/max";
import { translateCursorPosition, countryCodeToUnicodeFlag } from "../utils";

const regionInEnglish = new Intl.DisplayNames(["en"], { type: "region" });
const countries = getCountries().map((c) => ({
  code: c,
  name: regionInEnglish.of(c),
  flag: countryCodeToUnicodeFlag(c),
}));

export function PhoneInput() {
  const [selectedCountry, setSelectedCountry] = createSignal<
    CountryCode | "ZZ"
  >("ZZ");
  const [phoneNumber, setPhoneNumber] = createSignal("");
  const formattedNumber = () => {
    const countryCode = selectedCountry();

    return formatIncompletePhoneNumber(
      phoneNumber(),
      countryCode !== "ZZ" ? countryCode : undefined,
    );
  };

  const handleOnSelect: JSX.ChangeEventHandlerUnion<
    HTMLSelectElement,
    Event
  > = (e) => {
    const countryCode = e.currentTarget.value as CountryCode | "ZZ";
    setSelectedCountry(countryCode);

    if (countryCode != "ZZ" && phoneNumber().startsWith("+")) {
      const countryCallingCode = getCountryCallingCode(countryCode);

      try {
        const parsedNumber = parsePhoneNumber(phoneNumber());
        const newRawNumber = `+${countryCallingCode}${parsedNumber.nationalNumber}`;

        setPhoneNumber(parseIncompletePhoneNumber(newRawNumber));
      } catch (_) {}
    }
  };

  const handleOnInput: JSX.ChangeEventHandler<HTMLInputElement, InputEvent> = (
    e,
  ) => {
    const rawValue = e.currentTarget.value;
    const cursorPosition = e.currentTarget.selectionStart || 0;

    try {
      const countryCode = selectedCountry();
      const parsedNumber = parsePhoneNumber(
        rawValue,
        countryCode !== "ZZ" ? countryCode : undefined,
      );
      setPhoneNumber(parsedNumber.number);

      if (countryCode != "ZZ" && phoneNumber().startsWith("+")) {
        setSelectedCountry(parsedNumber.country || "ZZ");
      }
    } catch (e) {
      setPhoneNumber(parseIncompletePhoneNumber(rawValue));
    }

    const newCursor = translateCursorPosition(
      rawValue,
      cursorPosition,
      formattedNumber(),
    );
    e.currentTarget.setSelectionRange(newCursor, newCursor);
  };

  return (
    <div>
      <label for="country-select">Country:</label>
      <select
        id="country-select"
        onChange={handleOnSelect}
        value={selectedCountry()}
      >
        <option value="ZZ">International Format</option>
        <For each={countries}>
          {(country) => (
            <option value={country.code}>
              {country.name} {country.flag}
            </option>
          )}
        </For>
      </select>
      <label for="phone-input">Phone Number:</label>
      <input
        id="phone-input"
        type="tel"
        value={formattedNumber()}
        onInput={handleOnInput}
        placeholder="Enter your phone number"
      />
    </div>
  );
}
