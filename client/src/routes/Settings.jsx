import { useNavigate } from "react-router-dom";
import ToggleButton from "../components/ToggleButton";

export default function Settings() {
  const navigate = useNavigate();
  return (
    <div className="h-dvh flex flex-col items-start p-4">
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="button bg-slate-800 hover:bg-slate-950"
      >
        Go Back
      </button>
      <div className="p-4 w-full flex flex-col flex-grow gap-4 justify-center items-center">
        <ToggleButton />
      </div>
    </div>
  );
}
