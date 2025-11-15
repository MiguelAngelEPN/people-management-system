"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./list.css";
import Swal from "sweetalert2";
import { showToast, confirmAlert } from "@/Component/Sweetalert/notification";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface UserPersonResponse {
  userId: number;
  userGuid: string;
  username: string;
  roleId: number;
  isActive: boolean;
  createdAt: string;
  personId: number;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  age: number;
  address: string;
  photoUrl: string;
}

interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    users: UserPersonResponse[];
  };
}

export default function PersonListPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  useEffect(() => {
    const r = Cookies.get("role");
    if (r) setRole(r);

  }, []);
  const [users, setUsers] = useState<UserPersonResponse[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(false);

  // ⭐ Nuevo: usuario seleccionado
  const [selectedUserGuid, setSelectedUserGuid] = useState<string | null>(null);

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [apiUrl] = useState(process.env.NEXT_PUBLIC_API_URL);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get<ApiResponse>(
        `${apiUrl}/Person?page=${page}&pageSize=${pageSize}`,
        {
          params: {
            page,
            pageSize,
            firstName: firstName.trim() || null,
            lastName: lastName.trim() || null,
          },
          timeout: 8000,
        }
      );

      const body = response.data;

      if (!body?.data?.users) {
        showToast({
          icon: "error",
          message: "Error en formato del servidor.",
          duration: 3000,
        });
        return;
      }

      setUsers(body.data.users);
    } catch (error: any) {
      showToast({
        icon: "error",
        message: error?.response?.data?.message || "Error desconocido.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, firstName, lastName]);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 600);

    setTypingTimeout(timeout);
  }, [firstName, lastName]);

  // Navegar al editar
  const handleEdit = () => {
    if (!selectedUserGuid) return;
    router.push(`./list/${selectedUserGuid}`);
  };

  const handleDelete = async () => {
    if (!selectedUserGuid) return;

    const confirmed = await confirmAlert(
      "¿Estás seguro de eliminar este usuario?",
      "warning",
      "Eliminar"
    );

    if (!confirmed) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/Person/${selectedUserGuid}`;
      const response = await axios.delete(url);

      if (response.data.code !== 200) {
        Swal.fire({
          icon: "error",
          title: response.data.message || "No se pudo eliminar",
        });
        return;
      }

      // ==== ELIMINAR DEL FRONT ====
      setUsers((prev) =>
        prev.filter((u) => u.userGuid !== selectedUserGuid)
      );

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error?.response?.data?.message ?? "Error inesperado",
      });
    }
  };

  return (
    <div className="listContainer">
      <h1 className="titlePage">Usuarios</h1>

      {/* === Filtros + Botón Editar === */}
      <div className="filtersRow">
        <input
          type="text"
          placeholder="Nombre..."
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="inputFilter"
        />

        <input
          type="text"
          placeholder="Apellido..."
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="inputFilter"
        />

        {/* Botón Editar */}

        {role === "Admin" && (
          <button
            onClick={handleEdit}
            disabled={!selectedUserGuid}
            className={`btnPagination ${!selectedUserGuid ? "btnDisabled" : ""
              }`}
          >
            Editar usuario
          </button>

        )}
        {/* Botón eliminar */}

        {role === "Admin" && (
          <button
            onClick={handleDelete}
            disabled={!selectedUserGuid}
            className={`btnPagination ${!selectedUserGuid ? "btnDisabled" : ""
              }`}
          >
            Eliminar usuario
          </button>
        )}

      </div>

      {/* === Tabla === */}
      <div className="tableWrapper">
        <table className="customTable">
          <thead>
            <tr>
              <th>c</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Activo</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="loadingRow">
                  Cargando...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="emptyRow">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.userId}>
                  {/* Checkbox tipo radio */}
                  <td className="text-center">
                    <input
                      type="radio"
                      name="selectedUser"
                      checked={selectedUserGuid === u.userGuid}
                      onChange={() => setSelectedUserGuid(u.userGuid)}
                    />
                  </td>

                  <td>{u.username}</td>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.countryCode} {u.phoneNumber}
                  </td>
                  <td>{u.isActive ? "✔" : "✘"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* === Paginación === */}
      <div className="paginationRow">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="btnPagination"
        >
          Anterior
        </button>

        <span className="pageNumber">Página {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="btnPagination"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
