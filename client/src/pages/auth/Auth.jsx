import React, { useState } from "react";
import {
  Navigate,
  redirect,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuthStore } from "../../services/store";
import axios from "axios";

export default function Auth() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [bgColor, setBgColor] = useState("#000000");
  const [searchParams, setSearchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const currentStreamId = searchParams.get("streamId");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (!name | !role | !bgColor) {
        toast.error("All fields are required.");
      }

      const body = {
        name,
        role,
        bgColor,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user`,
        body
      );

      if (response?.data?.ok) {
        const { id, role, bgColor, name, authorized } = response.data;

        const userInfo = { id, role, bgColor, name, authorized };
        window.localStorage.setItem("user-info", JSON.stringify(userInfo));

        setAuth({ id, role, bgColor, name, authorized });

        if (currentStreamId && role === "student") {
          navigate(-1);
        } else {
          navigate("/");
        }
      }
    } catch (error) {}
  }

  return (
    <>
      <div className="h-dvh flex justify-center items-center bg-slate-300">
        <form
          className="w-[400px] bg-[rgba(255,255,255,0.5)] p-5 flex flex-col justify-between items-start gap-5"
          onSubmit={handleSubmit}
        >
          <label className="font-bold" htmlFor="name">
            Name
          </label>
          <input
            required
            type="text"
            className="outline outline-2 outline-slate-950 py-2 px-4 rounded-lg"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <label className="font-bold" htmlFor="role">
            Role
          </label>
          <select
            defaultValue={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
            name="role"
            id="role"
          >
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <label className="font-bold" htmlFor="bg-color">
            Background Color
          </label>
          <input
            required
            onChange={(e) => {
              setBgColor(e.target.value);
            }}
            type="color"
            id="bg-color"
          />

          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-950 text-white py-2 px-4 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
