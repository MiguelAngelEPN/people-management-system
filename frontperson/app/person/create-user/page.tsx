"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../list/[id]/styles.css";
import Cookies from "js-cookie";

type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    age: number;
    address: string;
    photoUrl: string;
    username: string;
    password: string;
    confirmPassword: string;
    roleId: number;
    isActive: boolean;
};

const CreateUserPage = () => {
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        const r = Cookies.get("role");
        if (r) setRole(r);
    }, []);

    const [form, setForm] = useState<FormState>({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "", // ahora select
        phoneNumber: "",
        age: 0,
        address: "",
        photoUrl: "",
        username: "",
        password: "",
        confirmPassword: "",
        roleId: 0,
        isActive: true,
    });

    // Opciones sugeridas de country code (modifica según necesites)
    const countryOptions = [
        { label: "Seleccionar...", value: "" },
        { label: "+593 (Ecuador)", value: "+593" },
        { label: "+1 (USA/Canadá)", value: "+1" },
        { label: "+52 (México)", value: "+52" },
        { label: "+34 (España)", value: "+34" },
        { label: "+44 (Reino Unido)", value: "+44" },
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target;

        // Normalizar valores para ciertos campos
        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setForm((prev) => ({ ...prev, [target.name]: target.checked }));
            return;
        }

        // número para 'age' y para 'roleId'
        if (target.name === "age") {
            const parsed = parseInt(target.value === "" ? "0" : target.value, 10);
            setForm((prev) => ({ ...prev, age: isNaN(parsed) ? 0 : parsed }));
            return;
        }

        if (target.name === "roleId") {
            const parsed = parseInt(target.value === "" ? "0" : target.value, 10);
            setForm((prev) => ({ ...prev, roleId: isNaN(parsed) ? 0 : parsed }));
            return;
        }

        // default: texto / select
        setForm((prev) => ({ ...prev, [target.name]: target.value }));
    };

    // Reglas: las mismas que tu DTO C#
    const passwordPolicy = {
        minLen: 6,
        allowedRegex: /^[a-zA-Z0-9@#$%^&+=!._-]+$/,
        message:
            "Mínimo 6 caracteres. Permitidos: letras, números y estos símbolos @ # $ % ^ & + = ! . _ -",
    };

    const validateForm = (): string[] => {
        const errors: string[] = [];

        // First / Last name
        if (!form.firstName.trim() || form.firstName.length < 2 || form.firstName.length > 100)
            errors.push("El nombre debe tener entre 2 y 100 caracteres.");
        if (!form.lastName.trim() || form.lastName.length < 2 || form.lastName.length > 100)
            errors.push("El apellido debe tener entre 2 y 100 caracteres.");

        // Email
        if (!form.email.trim()) errors.push("El email es obligatorio.");
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) errors.push("Debe ingresar un email válido.");
            if (form.email.length > 150) errors.push("El email no puede exceder 150 caracteres.");
        }

        // Country code (select)
        if (!form.countryCode) errors.push("Debe seleccionar un código de país.");

        // Phone
        if (!form.phoneNumber.trim()) errors.push("El número telefónico es obligatorio.");
        else {
            const phoneRegex = /^[0-9]+$/;
            if (!phoneRegex.test(form.phoneNumber)) errors.push("El número telefónico solo puede contener números.");
            if (form.phoneNumber.length > 20) errors.push("El número telefónico no puede exceder 20 caracteres.");
        }

        // Age
        if (form.age < 0 || form.age > 120) errors.push("La edad debe estar entre 0 y 120.");

        // Address
        if (form.address && form.address.length > 250) errors.push("La dirección no puede exceder 250 caracteres.");

        // PhotoUrl
        if (form.photoUrl && form.photoUrl.length > 500) errors.push("La URL de la foto no puede exceder 500 caracteres.");
        // opcional: validar formato básico URL si se desea:
        if (form.photoUrl && !/^https?:\/\/.+/i.test(form.photoUrl)) {
            errors.push("La URL de la foto debe comenzar con http:// o https://");
        }

        // Username
        if (!form.username.trim()) errors.push("El username es obligatorio.");
        else {
            const usernameRegex = /^[a-zA-Z0-9._-]+$/;
            if (!usernameRegex.test(form.username)) errors.push("El username solo puede contener letras, números, ., _ y -.");
            if (form.username.length > 100) errors.push("El username no puede exceder 100 caracteres.");
        }

        // Password (obligatoria al crear)
        if (!form.password || form.password.length < passwordPolicy.minLen) {
            errors.push(`La contraseña debe tener al menos ${passwordPolicy.minLen} caracteres.`);
        } else {
            if (!passwordPolicy.allowedRegex.test(form.password)) {
                errors.push("La contraseña contiene caracteres inválidos.");
            }
        }

        // Confirm password
        if (form.password !== form.confirmPassword) errors.push("Las contraseñas no coinciden.");

        // Role
        if (form.roleId <= 0) errors.push("Debe seleccionar un rol válido.");

        return errors;
    };

    const handleSave = async () => {
        const errors = validateForm();
        if (errors.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Errores en el formulario",
                html: `<ul style="text-align:left">${errors.map((e) => `<li>${e}</li>`).join("")}</ul>`,
                timer: 4500,
                position: "top-end",
                toast: true,
                showConfirmButton: false,
            });
            return;
        }

        // Preparar payload idéntico al DTO (ajusta nombres si tu backend espera otro)
        const payload = {
            FirstName: form.firstName,
            LastName: form.lastName,
            Email: form.email,
            CountryCode: form.countryCode,
            PhoneNumber: form.phoneNumber,
            Age: form.age,
            Address: form.address || null,
            PhotoUrl: form.photoUrl || null,
            Username: form.username,
            Password: form.password,
            RoleId: form.roleId,
            IsActive: form.isActive,
        };

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/Person`;
            const res = await axios.post(url, payload, { timeout: 10000 });

            const body = res?.data;
            if (!body || typeof body !== "object") {
                Swal.fire({ icon: "error", title: "Respuesta inesperada del servidor", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
                return;
            }

            if (body.code !== 200) {
                Swal.fire({ icon: "error", title: body.message || "Error al crear usuario", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Usuario creado correctamente",
                position: "top-end",
                toast: true,
                timer: 2200,
                showConfirmButton: false,
            });

            // opcional: reset form o redirigir
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                countryCode: "",
                phoneNumber: "",
                age: 0,
                address: "",
                photoUrl: "",
                username: "",
                password: "",
                confirmPassword: "",
                roleId: 0,
                isActive: true,
            });
        } catch (err: any) {
            if (err.code === "ECONNABORTED" || err.message?.toLowerCase()?.includes("network")) {
                Swal.fire({ icon: "error", title: "No se pudo conectar al servidor", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
            } else {
                Swal.fire({ icon: "error", title: err?.response?.data?.message ?? "Error desconocido", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
            }
        }
    };

    return (
        <div className="editUserContainer">
            <h1>Crear Usuario</h1>

            <div className="formGrid">
                {/* Imagen */}
                <div className="imageSection">
                    {form.photoUrl && (
                        // muestra imagen si la url es válida (simple)
                        <img
                            src={form.photoUrl}
                            alt="User"
                            style={{ width: 150, height: 150, borderRadius: 8, objectFit: "cover", marginBottom: 12 }}
                        />
                    )}
                    <input
                        type="text"
                        name="photoUrl"
                        placeholder="URL de la foto (http(s)://...)"
                        value={form.photoUrl}
                        onChange={handleChange}
                        maxLength={500}
                    />
                </div>

                <div>
                    <label>Nombre</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} maxLength={100} />
                </div>

                <div>
                    <label>Apellido</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} maxLength={100} />
                </div>

                <div>
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} maxLength={150} />
                </div>

                <div>
                    <label>Código de país</label>
                    <select name="countryCode" value={form.countryCode} onChange={handleChange}>
                        {countryOptions.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Teléfono</label>
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} maxLength={20} />
                </div>

                <div>
                    <label>Edad</label>
                    <input name="age" type="number" value={form.age} onChange={handleChange} min={0} max={120} />
                </div>

                <div>
                    <label>Dirección</label>
                    <input name="address" value={form.address} onChange={handleChange} maxLength={250} />
                </div>

                <div>
                    <label>Username</label>
                    <input name="username" value={form.username} onChange={handleChange} maxLength={100} />
                </div>

                <div>
                    <label>Contraseña</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} />
                    <small style={{ display: "block", marginTop: 6, color: "var(--color-text-secondary)", fontSize: 12 }}>
                        {passwordPolicy.message}
                    </small>
                </div>

                <div>
                    <label>Confirmar contraseña</label>
                    <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
                </div>

                <div>
                    <label>Rol</label>
                    <select name="roleId" value={form.roleId} onChange={handleChange}>
                        <option value={0}>Seleccione...</option>
                        <option value={1}>Admin</option>
                        <option value={2}>User</option>
                    </select>
                </div>

                <div>
                    <label>Activo</label>
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                </div>
            </div>

            {role === "Admin" && (
                <button onClick={handleSave} className="saveButton">
                    Crear usuario
                </button>

            )}
        </div>
    );
};

export default CreateUserPage;
