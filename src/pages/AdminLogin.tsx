import { CustomIcon, Spinner } from "@/common";
import { signinAdmin } from "@/redux/auth/loginSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLoginField } from "@/constants";
import { auth_content } from "@/constants";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

type FormState = {
  [key: string]: string;
};

const AdminLogin = () => {
  const [form, setForm] = useState<FormState>({
    emailOrUsername: "",
    password: "",
    Email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.signin);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    if (name === "emailOrUsername") {
      setForm((prevForm) => ({
        ...prevForm,
        Email: value,
      }));
    }
  };

  const handleSignin = (e: FormEvent) => {
    e.preventDefault();
    dispatch(signinAdmin(form)).then((result) => {
      if (signinAdmin.fulfilled.match(result)) {
        toast.success("Successfully login");

        navigate("/dashboard");
      } else {
        toast.error("Invalid Credentials");
      }
    });
  };

  const { reg_forgot, reg_remember } = auth_content;

  return (
    <>
      <div className="flex ">
        <div className="w-[100%] r-md:w-[60%]  overflow-y-scroll bg-[#fff] min-h-screen  px-1 sm:px-10 sm:py-5  scrollbar-hide">
          <div className="mt-5 sm:mt-[90px] px-1 sm:px-5">
            <figure>
              <Link to="/">
                <img
                  src="/logo.png"
                  alt="rara"
                  height={200}
                  width={200}
                  className="object-contain mx-auto"
                />
              </Link>
            </figure>
            <h1 className="text-[2rem] text-center">
              Vendor <span className="font-bold"></span>Login
            </h1>
            <form onSubmit={handleSignin}>
              <div className="flex flex-col  gap-6 mt-8">
                {adminLoginField.map((item, id) => (
                  <div key={`${item.formName}..${id}`} className="relative">
                    <input
                      name={item.formName}
                      value={form[item.formName]}
                      onChange={handleInputChange}
                      required
                      placeholder={item.placeholder}
                      type={showPassword ? "text" : `${item.type}`}
                      className="form-control w-full  bg-slate-50 py-3 pl-10 placeholder:text-[13px] placeholder:text-gray-500 border rounded-[4px] border-black"
                    />
                    {item.type === "password" ? (
                      <div className=" flex justify-end">
                        <CustomIcon
                          icon={item.icon}
                          className="absolute top-4   left-3"
                          size={20}
                          color="gray"
                        />
                        {!showPassword ? (
                          <IoEyeOutline
                            className="absolute top-4 mx-3  cursor-pointer"
                            size={20}
                            color="gray"
                            onClick={togglePasswordVisibility}
                          />
                        ) : (
                          <FaRegEyeSlash
                            className="absolute top-4 mx-3 cursor-pointer"
                            size={20}
                            color="gray"
                            onClick={togglePasswordVisibility}
                          />
                        )}
                      </div>
                    ) : (
                      <CustomIcon
                        icon={item.icon}
                        className="absolute top-4 left-3"
                        size={20}
                        color="gray"
                      />
                    )}
                  </div>
                ))}
                <div className="w-full flex justify-between items-center">
                  <div className="float-left">
                    <label className="container_check text-[#999] text-sm">
                      {reg_remember}
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <button className="text-[#999] text-sm">{reg_forgot}</button>
                </div>

                <button className="w-full px-6 py-3 h-[50px] mt-5 text-white bg-[#dc3545] rounded-[4px] font-bold flex items-center justify-center">
                  {loading ? <Spinner btn /> : `Login`}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src="/loginbg.jpg"
            alt="login"
            className="h-screen object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
