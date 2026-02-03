import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/leads/FadeLoaderCustom";
import { getToken } from "../api/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const body = { email, password };
    const res = await getToken(body);

    const decoded = jwtDecode(res.data.access_token);

    const user = {
      id:decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("user", JSON.stringify(user));

    if (decoded.role === "admin") navigate("/admin");
    else navigate("/dashboard");

  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Login failed";

    toast.error(msg);
    console.error("Login error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      {loading ? <Loader size={90} color="#111" /> :
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 disabled:opacity-60 text-white p-2 w-full rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      }
    </div>
  );
};

export default Login;
