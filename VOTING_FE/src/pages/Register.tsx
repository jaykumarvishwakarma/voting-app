import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
}

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(phone)) newErrors.phone = "Phone must be 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (setter: (value: string) => void) =>
    (e:any) => {
      setter(e.target.value);
    };

  const register = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, name, phone }),
      });

      if (res.ok) {
        navigate("/login");
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

        <input
          className={`w-full mb-1 px-4 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleChange(setName)}
        />
        {errors.name && <p className="text-red-500 text-sm mb-3">{errors.name}</p>}

        <input
          className={`w-full mb-1 px-4 py-2 border ${
            errors.phone ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={handleChange(setPhone)}
        />
        {errors.phone && <p className="text-red-500 text-sm mb-3">{errors.phone}</p>}

        <input
          className={`w-full mb-1 px-4 py-2 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleChange(setEmail)}
        />
        {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

        <input
          className={`w-full mb-1 px-4 py-2 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleChange(setPassword)}
        />
        {errors.password && <p className="text-red-500 text-sm mb-3">{errors.password}</p>}

        <button
          onClick={register}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          Register
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
