import { PhoneNumberUtil } from "google-libphonenumber";
import validator from "validator";

export const emailValidator = (val: string) =>
    validator.isEmail(val) || "invalid email";

export const phoneValidator = (val: string) => {
    const phoneUtil = new PhoneNumberUtil();
    try {
        const phone = phoneUtil.parseAndKeepRawInput(val, "CA");
        if (phoneUtil.isValidNumber(phone)) return true;
    } catch (_) {}
    return "invalid phone number";
};

export const passwordValidator = (watchPassword: any) => (val: string) =>
    val === watchPassword || "passwords do not match";
