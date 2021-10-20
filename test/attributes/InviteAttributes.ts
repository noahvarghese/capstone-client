const formLabels = {
    first_name: /first name/i,
    last_name: /last name/i,
    email: /email/i,
    phone: /phone/i,
};

const validInputs = {
    first_name: "Josh",
    last_name: "Varghese",
    email: "vjosh76@gmail.com",
    phone: "6478124453",
};

const invalidInputs = {
    email: "test123",
};

const InviteAttributes = { validInputs, formLabels, invalidInputs };

export default InviteAttributes;
