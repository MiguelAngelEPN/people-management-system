"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import "./login.css";
import { showToast } from "@/Component/Sweetalert/notification";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value: string) => {
    return /^[a-zA-Z0-9@#$%^&+=!._-]{6,50}$/.test(value);
  };

  const isValid =
    validateEmail(email) &&
    validatePassword(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      showToast({
        icon: "error",
        message: "Ingrese datos válidos.",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/Authentication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok || json.code !== 200) {
        showToast({
          icon: "error",
          message: json.message || "Credenciales incorrectas.",
        });
        return;
      }

      const data = json.data;

      if (!data || !data.token) {
        showToast({
          icon: "error",
          message: "Error: token no recibido.",
        });
        return;
      }

      // ============================
      // GUARDAR TODO EN COOKIES
      // ============================

      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("userGuid", data.userGuid, { expires: 7 });
      Cookies.set("username", data.username, { expires: 7 });
      Cookies.set("email", data.email, { expires: 7 });
      Cookies.set("role", data.role.toString(), { expires: 7 });
      
      await fetch("/api/auth/set-cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: data.token,
          role: data.role,
        }),
      });

      showToast({
        icon: "success",
        message: json.message,
        duration: 1500,
      });

      setTimeout(() => {
        router.push('./person/list');
      }, 1600);

    } catch (error) {
      showToast({
        icon: "error",
        message: "No se pudo conectar con el servidor.",
      });
    }
  };

  return (
    <div className="loginContainer">
      <form className="loginCard" onSubmit={handleSubmit}>
        <h2 className="loginTitle">Bienvenido</h2>

        <div className="loginInputGroup">
          <label className="loginLabel">Email</label>
          <input
            type="email"
            className="loginInput"
            placeholder="email@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>

        <div className="loginInputGroup">
          <label className="loginLabel">Contraseña</label>
          <input
            type="password"
            className="loginInput"
            placeholder="********"
            maxLength={50}
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
          />
          <small style={{ fontSize: "12px", color: "#aaa" }}>
            Permitidos: letras, números y @#$%^&+=!._-
          </small>
        </div>

        <button type="submit" disabled={!isValid} className="buttonLogin">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
