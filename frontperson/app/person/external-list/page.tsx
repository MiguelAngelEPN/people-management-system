"use client";

import React, { useEffect, useState } from "react";
import "../list/list.css";

interface UserApi {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

const Page = () => {
  const [users, setUsers] = useState<UserApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://gorest.co.in/public/v2/users");

        if (!res.ok) throw new Error("Error al obtener usuarios");

        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-10 text-lg font-semibold">
        Cargando usuarios...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-10 text-lg">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Usuarios (API Externa)</h1>

      <div className="tableWrapper">
        <table className="customTable">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Nombre</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Género</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Estado</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4 capitalize">{user.gender}</td>
                <td
                  className={`py-2 px-4 font-medium ${user.status === "active" ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {user.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
