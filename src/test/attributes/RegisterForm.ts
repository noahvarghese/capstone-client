const formLabels = {
    password: /^\* password$/i,
    confirm_password: /confirm password/i,
};

const validInputs = {
    first_name: "Test",
    last_name: "Test",
    email: "test@test.com",
    address: "123 Anywhere St",
    city: "WhoKnows",
    postal_code: "L6L 1Z3",
    province: "ON",
    birthday: new Date(1996, 8, 7),
    phone: 9053393294,
    business_code: "3are123asdf",
    password: "testtest",
    confirm_password: "testtest",
};

const invalidInputs = {
    password: "testttt",
    confirm_password: "testtest",
};

const errors = {
    empty_password: /^password cannot be empty$/i,
    empty_confirm_password: /^confirm password cannot be empty$/i,
    no_match: "passwords do not match",
};

const RegisterAttributes = {
    formLabels,
    validInputs,
    invalidInputs,
    errors,
};

export default RegisterAttributes;
