"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { showToast } from "@/Component/Sweetalert/notification"; // AJUSTA ESTA RUTA
import "./styles.css"
export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [apiUrl] = useState(process.env.NEXT_PUBLIC_API_URL);

    const [form, setForm] = useState({
        userId: 0,
        userGuid: "",
        username: "",
        roleId: 0,
        isActive: false,
        createdAt: "",

        personId: 0,
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "",
        phoneNumber: "",
        age: 0,
        address: "",
        photoUrl: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;

        setForm((prev) => ({
            ...prev,
            [target.name]:
                target instanceof HTMLInputElement && target.type === "checkbox"
                    ? target.checked
                    : target.value,
        }));
    };


    // =============================
    // Cargar datos del servidor
    // =============================
    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/Person/${id}`);

                if (!response?.data || typeof response.data !== "object") {
                    showToast({
                        icon: "error",
                        message: "Respuesta inesperada del servidor",
                        duration: 3000,
                    });
                    return setNotFound(true);
                }

                if (response.data.code === 404) {
                    setNotFound(true);
                    return;
                }

                if (response.data.code !== 200) {
                    showToast({
                        icon: "error",
                        message: response.data.message,
                        duration: 3000,
                    });
                    return setNotFound(true);
                }

                const u = response.data.data;

                setForm({
                    userId: u.userId,
                    userGuid: u.userGuid,
                    username: u.username,
                    roleId: u.roleId,
                    isActive: u.isActive,
                    createdAt: u.createdAt,

                    personId: u.personId,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    countryCode: u.countryCode,
                    phoneNumber: u.phoneNumber,
                    age: u.age,
                    address: u.address ?? "",
                    photoUrl: u.photoUrl ?? "",
                });

            } catch (error: any) {
                if (error.code === "ERR_NETWORK") {
                    showToast({
                        icon: "error",
                        message: "No se puede conectar al servidor",
                        duration: 3000,
                    });
                } else {
                    showToast({
                        icon: "error",
                        message: "Error inesperado",
                        duration: 3000,
                    });
                }
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // =============================
    // Guardar cambios
    // =============================
    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            setLoading(true);
            const response = await axios.put(`${apiUrl}/Person/${form.userGuid}`, form);

            if (response?.data?.code !== 200) {
                return showToast({
                    icon: "error",
                    message: response.data.message || "Error al actualizar",
                    duration: 3000,
                });
            }
            showToast({
                icon: "success",
                message: "Usuario actualizado correctamente",
                duration: 3000,
            });

            router.push("/person/list");

        } catch (error: any) {
            if (error.code === "ERR_NETWORK") {
                showToast({
                    icon: "error",
                    message: "No se puede conectar al servidor",
                    duration: 3000,
                });
            } else {
                showToast({
                    icon: "error",
                    message: "Error inesperado",
                    duration: 3000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // Loading
    // =============================
    if (loading) {
        return (
            <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                Cargando...
            </div>
        );
    }

    // =============================
    // Página no disponible
    // =============================
    if (notFound) {
        return (
            <div style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.8rem",
                fontWeight: "bold"
            }}>
                Página no disponible
            </div>
        );
    }

    const validateForm = () => {
        // ======= Nombre =======
        if (!form.firstName.trim()) {
            showToast({ icon: "error", message: "El nombre es obligatorio.", duration: 3000 });
            return false;
        }
        if (form.firstName.length < 2 || form.firstName.length > 100) {
            showToast({ icon: "error", message: "El nombre debe tener entre 2 y 100 caracteres.", duration: 3000 });
            return false;
        }

        // ======= Apellido =======
        if (!form.lastName.trim()) {
            showToast({ icon: "error", message: "El apellido es obligatorio.", duration: 3000 });
            return false;
        }
        if (form.lastName.length < 2 || form.lastName.length > 100) {
            showToast({ icon: "error", message: "El apellido debe tener entre 2 y 100 caracteres.", duration: 3000 });
            return false;
        }

        // ======= Email =======
        if (!form.email.trim()) {
            showToast({ icon: "error", message: "El email es obligatorio.", duration: 3000 });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            showToast({ icon: "error", message: "Debe ingresar un email válido.", duration: 3000 });
            return false;
        }
        if (form.email.length > 150) {
            showToast({ icon: "error", message: "El email no puede exceder 150 caracteres.", duration: 3000 });
            return false;
        }

        // ======= Código de país =======
        const ccRegex = /^\+[0-9]{1,4}$/;
        if (!ccRegex.test(form.countryCode)) {
            showToast({ icon: "error", message: "El código de país debe ser + y 1-4 dígitos.", duration: 3000 });
            return false;
        }
        if (form.countryCode.length > 5) {
            showToast({ icon: "error", message: "El código de país no puede exceder 5 caracteres.", duration: 3000 });
            return false;
        }

        // ======= Teléfono =======
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(form.phoneNumber)) {
            showToast({ icon: "error", message: "El número telefónico solo debe contener números.", duration: 3000 });
            return false;
        }
        if (form.phoneNumber.length > 20) {
            showToast({ icon: "error", message: "El número telefónico no puede exceder 20 caracteres.", duration: 3000 });
            return false;
        }

        // ======= Edad =======
        if (form.age < 0 || form.age > 120) {
            showToast({ icon: "error", message: "La edad debe estar entre 0 y 120.", duration: 3000 });
            return false;
        }

        // ======= Dirección =======
        if (form.address && form.address.length > 250) {
            showToast({ icon: "error", message: "La dirección no puede exceder 250 caracteres.", duration: 3000 });
            return false;
        }

        // ======= URL foto =======
        if (form.photoUrl && form.photoUrl.length > 500) {
            showToast({ icon: "error", message: "La URL de la foto no puede exceder 500 caracteres.", duration: 3000 });
            return false;
        }

        // ======= Username =======
        if (!form.username.trim()) {
            showToast({ icon: "error", message: "El username es obligatorio.", duration: 3000 });
            return false;
        }
        const usernameRegex = /^[a-zA-Z0-9._-]+$/;
        if (!usernameRegex.test(form.username)) {
            showToast({ icon: "error", message: "Username solo puede contener letras, números, ., _ y -.", duration: 3000 });
            return false;
        }
        if (form.username.length > 100) {
            showToast({ icon: "error", message: "Username no puede exceder 100 caracteres.", duration: 3000 });
            return false;
        }

        // ======= Rol =======
        if (form.roleId <= 0) {
            showToast({ icon: "error", message: "Debe seleccionar un rol válido.", duration: 3000 });
            return false;
        }

        return true;
    };

    // =============================
    // UI de edición
    // =============================
    return (
        <div className="editUserContainer">
            <h1>Editar Usuario</h1>

            <div className="formGrid">

                {/* Imagen */}
                <div className="imageSection">
                    {form.photoUrl && (
                        <img
                            src={form.photoUrl}
                            alt="User"
                            style={{ width: 150, height: 150, borderRadius: 8, objectFit: "cover", marginBottom: 12 }}
                        />
                    )}
                    <input
                        type="text"
                        name="photoUrl"
                        placeholder="URL de la foto"
                        value={form.photoUrl}
                        onChange={handleChange}
                    />
                </div>

                {/* Person */}
                <div>
                    <label>Nombre</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} />
                </div>

                <div>
                    <label>Apellido</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} />
                </div>

                <div>
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} />
                </div>

                <div>
                    <label>Código de país</label>
                    <input name="countryCode" value={form.countryCode} onChange={handleChange} />
                </div>

                <div>
                    <label>Teléfono</label>
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                </div>

                <div>
                    <label>Edad</label>
                    <input name="age" type="number" value={form.age} onChange={handleChange} />
                </div>

                <div>
                    <label>Dirección</label>
                    <input name="address" value={form.address} onChange={handleChange} />
                </div>

                {/* User */}
                <div>
                    <label>Username</label>
                    <input name="username" value={form.username} onChange={handleChange} />
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

            <button onClick={handleSave} className="saveButton">
                Guardar cambios
            </button>
        </div>
    );
}
