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
    phone: "9053393294",
    password: "testtest",
    business_name: "Oakville Windows & Doors",
    confirm_password: "testtest",
};

const invalidInputs = {
    password: "test1234",
    confirm_password: "test4567",
};

const errors = {
    empty_password: "password cannot be empty",
    empty_confirm_password: "confirm password cannot be empty",
    no_match: "passwords do not match",
};

const RegisterAttributes = {
    formLabels,
    validInputs,
    invalidInputs,
    errors,
};

export default RegisterAttributes;
