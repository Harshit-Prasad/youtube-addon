import { useState } from "react";
import axios from "../../api/axios";
import { useUserInfoStore } from "../../services/store";

export default function ToggleButton() {
  const { role, setRole, id } = useUserInfoStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(role === "user" ? false : true);

  const handleToggleRole = async () => {
    try {
      setToggle((prev) => !prev);
      setLoading(true);
      const currentRole = !toggle ? "admin" : "user";
      const roleChanged = await axios.patch("/api/user/role", {
        updateRole: { role: currentRole },
        id,
      });

      setRole(currentRole);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Turn {toggle ? "Off" : "On"} Admin mode</h1>

      <button
        onClick={handleToggleRole}
        disabled={loading}
        className={`block relative h-[2rem] w-[4rem] rounded-full ${
          toggle ? "bg-green-500" : "bg-red-500"
        } disabled:bg-slate-600 `}
      >
        <span
          className={`absolute h-6 w-6 rounded-full top-[4px] left-[4px] bg-white ${
            toggle && "translate-x-8"
          }  transition-all`}
        ></span>
      </button>
    </>
  );
}
