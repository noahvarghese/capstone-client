import React, { useEffect, useState } from "react";
import "./App.scss";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import UserContext, { Business, Role } from "./context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { server } from "./util/permalink";
import Nav from "./components/Nav";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Logout from "./components/Logout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MembersList from "./pages/MembersList";
import RolesList from "./pages/RolesList";
import DepartmentsList from "./pages/DepartmentsList";
import ManualsList from "./pages/ManualsList";
import QuizzesList from "./pages/QuizzesList";
import Reports from "./pages/Reports";
import ScoresList from "./pages/ScoresList";
import DepartmentView from "./pages/DepartmentView";
import RoleView from "./pages/RoleView";
import MemberView from "./pages/MemberView";
import MemberInvite from "./pages/MemberInvite";
import Landing from "./pages/Landing";
import ManualView from "./pages/ManualView";
import ManualSectionView from "./pages/ManualSectionView";
import Loading from "./components/Loading";
import ContentView from "./pages/ContentView";
import UserManualsList from "./pages/UserManualsList";
import UserManualView from "./pages/UserManualView";
import QuizView from "./pages/QuizView";
import UserQuizList from "./pages/UserQuizList";
import QuizSectionView from "./pages/QuizSectionView";
import QuizQuestionView from "./pages/QuizQuestionView";
import QuizAnswerView from "./pages/QuizAnswerView";

function App() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState<number | undefined>();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        if (userId) {
            const controller = new AbortController();

            const fetchOptions: RequestInit = {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            };

            Promise.all([
                fetch(server("/businesses"), fetchOptions).then((res) =>
                    res.ok ? res.json().then(setBusinesses) : null
                ),
                fetch(server(`/members/${userId}/roles`), fetchOptions).then(
                    (res) => (res.ok ? res.json().then(setRoles) : null)
                ),
            ])
                .then(() => navigate("/"))
                .catch((e) => {
                    const { message } = e as Error;
                    console.error(message);
                });

            return () => controller.abort();
        }
        // do not include navigate otherwise it triggers a refresh everytime the url changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    if (userId && businesses.length === 0) {
        return <Loading />;
    }

    let routes: JSX.Element | null = null;

    // Public routes
    if (!userId && businesses.length === 0 && roles.length === 0) {
        routes = (
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route
                    path="/resetPassword/:token"
                    element={<ResetPassword />}
                />
                <Route
                    path="/members/invite/:token"
                    element={<MemberInvite />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        );
    } else {
        if (
            roles.find(
                (r: Role) => r.access === "ADMIN" || r.access === "MANAGER"
            )
        ) {
            routes = (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/members" element={<MembersList />} />
                    <Route path="/members/:id" element={<MemberView />} />
                    <Route path="/roles" element={<RolesList />} />{" "}
                    <Route path="/roles/:id" element={<RoleView />} />
                    <Route path="/departments" element={<DepartmentsList />} />
                    <Route
                        path="/departments/:id"
                        element={<DepartmentView />}
                    />
                    <Route path="/manuals" element={<ManualsList />} />
                    <Route path="/manuals/:id" element={<ManualView />} />
                    <Route
                        path="/manuals/:manual_id/sections/:id"
                        element={<ManualSectionView />}
                    />
                    <Route
                        path="/manuals/:manual_id/sections/:section_id/contents/:id"
                        element={<ContentView />}
                    />
                    <Route path="/quizzes" element={<QuizzesList />} />
                    <Route path="/quizzes/:id" element={<QuizView />} />
                    <Route
                        path="/quizzes/:quiz_id/sections/:id"
                        element={<QuizSectionView />}
                    />
                    <Route
                        path="/quizzes/:quiz_id/sections/:section_id/questions/:id"
                        element={<QuizQuestionView />}
                    />
                    <Route
                        path="/quizzes/:quiz_id/sections/:section_id/questions/:question_id/answers/:id"
                        element={<QuizAnswerView />}
                    />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            );
        } else {
            routes = (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/manuals" element={<UserManualsList />} />
                    <Route path="/manuals/:id" element={<UserManualView />} />
                    <Route path="/quizzes" element={<UserQuizList />} />
                    <Route path="/scores" element={<ScoresList />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            );
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <UserContext.Provider
                value={{
                    userId,
                    setUserId,
                    businesses,
                    setBusinesses,
                    roles,
                    setRoles,
                    logout: () => {
                        setRoles([]);
                        setBusinesses([]);
                        setUserId(undefined);
                    },
                }}
            >
                <Nav />
                <div className="App">{routes}</div>
            </UserContext.Provider>
        </ThemeProvider>
    );
}

export default App;
