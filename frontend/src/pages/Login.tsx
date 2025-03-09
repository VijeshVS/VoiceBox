import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LogIn, School } from "lucide-react";
import { auth } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["student", "teacher"]),
});

type LoginForm = z.infer<typeof schema>;

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const user = useAuthStore((state) => state.user);

  const onSubmit = async (data: LoginForm) => {
    try {
      const loginFn =
        data.role === "student" ? auth.studentLogin : auth.teacherLogin;
      const response = await loginFn(data.email, data.password);
      setAuth({ ...response.data.user, role: data.role }, response.data.token);
      navigate(`/${data.role}-dashboard`);
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}-dashboard`);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <School className="h-14 w-14 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm border-[0.5px] focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 px-4 py-2"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 block w-full rounded-lg border-[0.5px] border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 px-4 py-2"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              {...register("role")}
              className="mt-1 block w-full rounded-lg border-[0.2px] border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 px-4 py-2"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-300"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
