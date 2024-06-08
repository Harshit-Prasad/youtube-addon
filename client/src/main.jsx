import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </GoogleOAuthProvider>
);
