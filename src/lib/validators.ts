import { PhoneNumber, PhoneNumberUtil } from "google-libphonenumber";
import validator from "validator";

export const emptyValidator = (field: string) => (val: string) => {
    let res: { success: boolean; errorMessage: string } = {
        success: true,
        errorMessage: "",
    };

    if (val.trim() === "") {
        res.success = false;
        res.errorMessage = `${field} cannot be empty`;
        return res;
    }

    return res;
};

export const postalCodeValidator = (val: string) => {
    let res = emptyValidator("Postal code")(val);

    if (res.success) {
        if (
            !/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
                val
            )
        ) {
            res.success = false;
            res.errorMessage = "Invalid postal code";
        }
        // validator does not work nicely with canadian postal codes
        // if (validator.isPostalCode(val, "any")) {
        // res.success = false;
        // res.errorMessage = "Invalid postal code";
        // }
    }

    return res;
};

export const emailValidator = (val: string) => {
    let res = emptyValidator("Email")(val);

    if (res.success) {
        if (!validator.isEmail(val)) {
            res.success = false;
            res.errorMessage = "Invalid email";
        }
    }

    return res;
};

export const phoneValidator = (val: string) => {
    let res = emptyValidator("Phone")(val);
    let phoneUtil = new PhoneNumberUtil();

    if (res.success) {
        let phone: string | PhoneNumber = val;

        try {
            phone = phoneUtil.parseAndKeepRawInput(phone, "CA");

            if (!phoneUtil.isValidNumber(phone)) {
                res.success = false;
                res.errorMessage = "Invalid phone number";
            }
        } catch (e) {
            res.success = false;
            res.errorMessage = "Invalid phone number";
        }
    }

    return res;
};

export const passwordValidator = (
    password: string,
    confirmPassword: string
) => {
    let res = emptyValidator("Password")(password);

    if (!validator.isLength(password, { min: 8 })) {
        res.success = false;
        res.errorMessage = "Password must be at least 8 characters";
    } else if (password !== confirmPassword) {
        res.success = false;
        res.errorMessage = "Passwords do not match";
    }

    return res;
};
