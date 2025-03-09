import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserPlus, School } from "lucide-react";
import { auth } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["student", "teacher"]),
});

type RegisterForm = z.infer<typeof schema>;

function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });
  const user = useAuthStore((state) => state.user);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const registerFn =
        data.role === "student" ? auth.studentRegister : auth.teacherRegister;
      const response = await registerFn(data.name, data.email, data.password);
      setAuth({ ...response.data.user, role: data.role }, response.data.token);
      navigate(`/${data.role}-dashboard`);
    } catch (error) {
      toast.error("Registration failed");
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
          Create an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 border-[0.5px] block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 px-4 py-2"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 border-[0.5px] block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 px-4 py-2"
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
              className="mt-1 border-[0.5px] block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 px-4 py-2"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              {...register("role")}
              className="mt-1 border-[0.2px] block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 px-4 py-2"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-300"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
