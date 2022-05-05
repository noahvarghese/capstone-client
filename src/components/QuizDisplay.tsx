import {
    RadioGroupProps,
    Box,
    FormControl,
    FormLabel,
    Typography,
} from "@mui/material";
import Input, { InputProps } from "src/components/Input";
import React, { useMemo } from "react";
import { Control, Controller } from "react-hook-form";
import { CompleteQuiz } from "src/pages/UserQuizView";
import { QuestionType } from "src/util/questionTypes";
import { MultipleCheckboxProps } from "./Input/MultipleCheckbox";
import { FormInputOptions } from "./DynamicForm";

type BaseProps =
    | Omit<MultipleCheckboxProps, "field">
    | Omit<RadioGroupProps, "field">;

const quizAnswerOptions = ["radio", "multipleCheckbox"] as const;

// Force only radio or multiplecheckbox as those are the only displays supported
type InputPropsWithoutField = Partial<{
    [x in typeof quizAnswerOptions[number]]: BaseProps;
}>;

type SectionQuestions = { [sectionId: number]: Array<JSX.Element> };

interface QuizDisplayProps {
    control: Control;
    disabled: boolean;
    quiz?: CompleteQuiz;
}

const joinStringOnSpace = (s: string): string => s.split(" ").join("");

const genAnswerKey = (name: string, answer: string, index: number): string =>
    `question_${name}_answer${joinStringOnSpace(answer)}${index}`;

const genProps = (
    disabled: boolean,
    items: {
        id: number;
        key: string;
        label: string;
        value: string;
    }[],
    name: string,
    questionType: QuestionType
): InputPropsWithoutField => {
    let baseProps: BaseProps = {
        "aria-labelledby": name,
        disabled,
        items,
    };

    switch (questionType) {
        case "true or false":
            return { radio: baseProps };
        case "single correct - multiple choice":
            return { radio: baseProps };
        case "multiple correct - multiple choice":
            return { multipleCheckbox: baseProps };
        default:
            throw new Error("Invalid question type");
    }
};

const useQuizDisplay = ({
    control,
    disabled,
    quiz,
}: QuizDisplayProps): SectionQuestions => {
    const formInputs: SectionQuestions = useMemo(() => {
        // Store inputs in HashMap with the section.id as the key and an array of JSX.Elements as the value
        const sectionsMap: { [sectionId: number]: JSX.Element[] } = {};

        if (!quiz) return sectionsMap;

        const { sections } = quiz;

        // Iterate over all questions
        for (let i = 0; i < sections.length; i++) {
            const { questions } = sections[i];
            sectionsMap[sections[i].id] = [];

            for (let j = 0; j < questions.length; j++) {
                const q = questions[j];
                const questionName = joinStringOnSpace(q.question);

                const items = q.answers.map((a, index) => ({
                    id: a.id,
                    key: genAnswerKey(questionName, a.answer, index),
                    label: a.answer,
                    value: a.id.toString(),
                }));

                const props = genProps(
                    disabled,
                    items,
                    questionName,
                    q.question_type
                );

                sectionsMap[sections[i].id].push(
                    <Box
                        key={questionName}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            margin: "1rem",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                            }}
                        >
                            <FormControl component="fieldset">
                                <FormLabel id={questionName} component="legend">
                                    <Typography
                                        variant="h5"
                                        variantMapping={{
                                            h5: "h4",
                                        }}
                                        sx={{
                                            textAlign: "left",
                                        }}
                                    >
                                        {q.question}
                                    </Typography>
                                </FormLabel>
                                <Controller
                                    control={control}
                                    name={q.id.toString()}
                                    render={({ field }) => {
                                        const inputProps: Partial<
                                            Record<
                                                keyof FormInputOptions,
                                                unknown
                                            >
                                        > = {
                                            ...props,
                                        };

                                        const keys = Object.keys(props);

                                        // Expect inputProps to only contain one key
                                        inputProps[
                                            keys[0] as typeof quizAnswerOptions[number]
                                        ] = {
                                            ...props[
                                                keys[0] as typeof quizAnswerOptions[number]
                                            ],
                                            field,
                                        };

                                        return (
                                            <Input
                                                {...(inputProps as InputProps)}
                                            />
                                        );
                                    }}
                                />
                            </FormControl>
                        </Box>
                        {j !== sections[i].questions.length - 1 ? (
                            <hr
                                style={{
                                    width: "100%",
                                }}
                            />
                        ) : null}
                    </Box>
                );
            }
        }

        return sectionsMap;
    }, [control, disabled, quiz]);

    return formInputs;
};

export default useQuizDisplay;
