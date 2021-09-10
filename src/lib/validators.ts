export const emptyValidator = (field: string) => (val: string) => {
    let res: { success: boolean; errorMessage: string } = {
        success: true,
        errorMessage: "",
    };

    if (val.trim() === "") {
        res.success = false;
        res.errorMessage = `${field.split("_").join(" ")} cannot be empty`;
        return res;
    }

    return res;
};
