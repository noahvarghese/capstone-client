import { useEffect, useState } from "react";
import "./App.scss";
import UserContext, { Business, Role } from "./context";
import { Route, Switch, useHistory } from "react-router-dom";
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
import UserQuizView from "./pages/UserQuizView";

function App() {
    const history = useHistory();

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
                .then(() => history.push("/"))
                .catch((e) => {
                    const { message } = e as Error;
                    console.error(message);
                });

            return () => controller.abort();
        }
        // do not include navigate otherwise it triggers a refresh everytime the url changes
    }, [history, userId]);

    if (userId && businesses.length === 0) {
        return <Loading />;
    }

    let routes: JSX.Element | null = null;

    // Public routes
    if (!userId && businesses.length === 0 && roles.length === 0) {
        routes = (
            <Switch>
                <Route exact path="/" component={Landing} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route
                    exact
                    path="/forgotPassword"
                    component={ForgotPassword}
                />
                <Route
                    exact
                    path="/resetPassword/:token"
                    component={ResetPassword}
                />
                <Route
                    exact
                    path="/members/invite/:token"
                    component={MemberInvite}
                />
                <Route path="*" component={NotFound} />
            </Switch>
        );
    } else {
        if (
            roles.find(
                (r: Role) => r.access === "ADMIN" || r.access === "MANAGER"
            )
        ) {
            routes = (
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/members" component={MembersList} />
                    <Route exact path="/members/:id" component={MemberView} />
                    <Route exact path="/roles" component={RolesList} />
                    <Route exact path="/roles/:id" component={RoleView} />
                    <Route
                        exact
                        path="/departments"
                        component={DepartmentsList}
                    />
                    <Route
                        exact
                        path="/departments/:id"
                        component={DepartmentView}
                    />
                    <Route exact path="/manuals" component={ManualsList} />
                    <Route exact path="/manuals/:id" component={ManualView} />
                    <Route
                        exact
                        path="/manuals/:manual_id/sections/:id"
                        component={ManualSectionView}
                    />
                    <Route
                        exact
                        path="/manuals/:manual_id/sections/:section_id/contents/:id"
                        component={ContentView}
                    />
                    <Route exact path="/quizzes" component={QuizzesList} />
                    <Route exact path="/quizzes/:id" component={QuizView} />
                    <Route
                        exact
                        path="/quizzes/:quiz_id/sections/:id"
                        component={QuizSectionView}
                    />
                    <Route
                        exact
                        path="/quizzes/:quiz_id/sections/:section_id/questions/:id"
                        component={QuizQuestionView}
                    />
                    <Route
                        exact
                        path="/quizzes/:quiz_id/sections/:section_id/questions/:question_id/answers/:id"
                        component={QuizAnswerView}
                    />
                    <Route exact path="/reports" component={Reports} />
                    <Route exact path="/logout" component={Logout} />
                    <Route path="*" component={NotFound} />
                </Switch>
            );
        } else {
            routes = (
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/manuals" component={UserManualsList} />
                    <Route
                        exact
                        path="/manuals/:id"
                        component={UserManualView}
                    />
                    <Route exact path="/quizzes" component={UserQuizList} />
                    <Route exact path="/quizzes/:id" component={UserQuizView} />
                    <Route exact path="/scores" component={ScoresList} />
                    <Route exact path="/logout" component={Logout} />
                    <Route path="*" component={NotFound} />
                </Switch>
            );
        }
    }

    return (
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
    );
}

export default App;
