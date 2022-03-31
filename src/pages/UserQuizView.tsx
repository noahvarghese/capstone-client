import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Answer } from "./QuizQuestionView";
import { Question, Section } from "./QuizSectionView";
import { Quiz } from "./QuizzesList";

type CompleteQuiz = Quiz & {
    sections: (Section & { questions: (Question & { answers: Answer[] })[] })[];
};

const UserQuizView = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<CompleteQuiz | undefined>();

    // Get full document
    useEffect(() => {
        const controller = new AbortController();
        const fetchOptions: RequestInit = {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        };

        fetch(server(`/quizzes/${id}`), fetchOptions)
            .then((res) => res.json())
            .then((quiz: Quiz) =>
                fetch(server(`/quizzes/${id}/sections`), fetchOptions)
                    .then((res) => res.json())
                    .then((sections: Section[]) =>
                        Promise.all(
                            sections.map((s: Section) =>
                                fetch(
                                    server(
                                        `/quizzes/sections/${s.id}/questions`
                                    ),
                                    fetchOptions
                                )
                                    .then((res) => res.json())
                                    .then((questions: Question[]) =>
                                        Promise.all(
                                            questions.map((q) =>
                                                fetch(
                                                    server(
                                                        `/quizzes/sections/questions/${q.id}/answers`
                                                    ),
                                                    fetchOptions
                                                )
                                                    .then((res) => res.json())
                                                    .then(
                                                        (
                                                            answers: Answer[]
                                                        ) => ({ ...q, answers })
                                                    )
                                            )
                                        )
                                    )
                                    .then(
                                        (
                                            questions: (Question & {
                                                answers: Answer[];
                                            })[]
                                        ) => ({ ...s, questions })
                                    )
                            )
                        )
                    )
                    .then(
                        (
                            sections: (Section & {
                                questions: (Question & { answers: Answer[] })[];
                            })[]
                        ) => ({ ...quiz, sections })
                    )
            )
            .then(setQuiz);

        return () => {
            controller.abort();
        };
    }, [id]);

    if (!quiz) return <Loading />;

    console.log(quiz);

    return <div>UserQuizView</div>;
};

export default UserQuizView;
