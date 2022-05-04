export const questionTypes = [
    "true or false",
    "multiple correct - multiple choice",
    "single correct - multiple choice",
] as const;

export type QuestionType = typeof questionTypes[number];

export const genItems = (str: string[] | readonly string[]) =>
    str.map((s) => ({
        key: s,
        value: s,
        label: s,
        id: s,
    }));

export const selectQuestionTypeOptions = genItems(questionTypes);
