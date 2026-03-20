import { useState, useEffect } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import UsersScreen from "./src/screens/UsersScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { getAccessToken } from "./src/storage/authStorage";

export default function App() {
    const [screen, setScreen] = useState<string | null>(null);

    useEffect(() => {
        async function checkLogin() {
            const token = await getAccessToken();

            if (token) {
                setScreen("users");
            } else {
                setScreen("login");
            }
        }

        checkLogin();
    }, []);

    if (screen === "login") {
        return (
            <LoginScreen
                onLoginSuccess={(screen) => setScreen(screen)}
                onGoToRegister={() => setScreen("register")}
            />
        );
    }

    if (screen === "register") {
        return (
            <RegisterScreen
                onRegisterSuccess={() => setScreen("login")}
            />
        );
    }

    if (screen === "users") {
        return(
             <UsersScreen
                onLogout ={() => setScreen("login")}
                onGoToProfile={() => setScreen("profile")}
            />
        );
    }

    if (screen === "profile") {
        return (
             <ProfileScreen
                onLogout={() => setScreen("login")}
                onGoToUsers={() => setScreen("users")}
            />
        );
    }

}