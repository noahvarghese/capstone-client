import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import "./index.scss";

const Login: React.FC<{}> = () => {
    const [displayForm, setDisplayForm] = useState<0 | 1>(0);
    console.log(displayForm);

    return (
        <div className="Login">
            <h1>Welcome OnBoard</h1>
            {displayForm === 0 ? (
                <LoginForm setForm={() => setDisplayForm(1)} />
            ) : (
                <RegisterForm setForm={() => setDisplayForm(0)} />
            )}
        </div>
    );
};

export default Login;
