"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Header() {
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        setUsername(Cookies.get("username") || "");
    }, []);

    useEffect(() => {
        if (!Cookies.get("token")) {
            router.push('/');
        }
    }, []);

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("userGuid");
        Cookies.remove("username");
        Cookies.remove("email");
        Cookies.remove("role");

        router.push('/');
    };

    return (
        <header className="header">
            <button onClick={logout} className="logoutBtn">
                Cerrar sesión
            </button>


            <div className="headerUser">
                <span>{username ? `👋 Hola, ${username}` : "Usuario"}</span>
            </div>
        </header>
    );
}
