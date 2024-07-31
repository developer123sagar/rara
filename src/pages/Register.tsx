/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth_content } from "@/constants";
import { CustomIcon, Spinner } from "@/common";
import { Link, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { signupUser } from "@/redux/auth/signupSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import Buttons from "@/common/Button";

type FormState = {
  [key: string]: string;
};

export default function Register() {
  const navigate = useNavigate();
  const { input, log_submit, reg_submit, reg_content } = auth_content;

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm_pass: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.signup);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password === form.confirm_pass) {
      const { confirm_pass, ...newFormValues } = form;

      dispatch(signupUser(newFormValues)).then((result) => {
        if (signupUser.fulfilled.match(result)) {
          const message = result.payload;
          toast.success(message || "Successfully registered");
          navigate("/login");
        } else {
          let errorMsg: string | undefined;
          if (result.error) {
            errorMsg = result.error.message;
            toast.error(errorMsg || "Something went wrong");
          }
        }
      });
    } else {
      toast.error("Password did not matched");
    }
  };

  return (
    <>
      <div className="h-screen sm:h-[100vh] flex w-full  overflow-y-hidden overflow-x-hidden">
        <div className="md:w-[90%] w-full flex justify-center overflow-y-scroll bg-[#fff] min-h-screen px-3 md:px-10 md:py-5  scrollbar-hide">
          <div className="md:w-[70%] lg:w-[60%] w-full">
            <aside className="mt-4">
              <figure>
                <Link to="/">
                  <img
                    src="logo.png"
                    alt="rara"
                    className="object-contain mx-auto pb-3 w-28 h-28"
                  />
                </Link>
              </figure>
              <form onSubmit={handleSignup}>
                <div className="flex flex-col gap-3 mt-3 ">
                  {input.map((item, id) => (
                    <div key={`${item.formName}..${id}`} className="relative">
                      <input
                        required
                        name={item.formName}
                        value={form[item.formName]}
                        onChange={handleInputChange}
                        placeholder={item.placeholder}
                        type={item.type}
                        className="form-control md:w-full w-full  bg-slate-50 py-3 pl-10  md:pl-10 placeholder:pl-10 placeholder:text-gray-500 border border-gray-200"
                      />
                      <CustomIcon
                        icon={item.icon}
                        className="absolute top-4 left-3"
                        size={20}
                        color="gray"
                      />
                    </div>
                  ))}
                  <Buttons
                    type="submit"
                    className="w-full flex items-center justify-center"
                  >
                    {" "}
                    {loading ? <Spinner btn /> : reg_submit}
                  </Buttons>
                </div>
              </form>
              <div className="flex items-center gap-2 mt-2 w-fit mx-auto">
                <small>{reg_content}</small>{" "}
                <Link to="/login">
                  <small className="text-[#e54350]">{log_submit}</small>
                </Link>
              </div>
            </aside>
          </div>
        </div>
        <div className="hidden md:block w-full">
          <img src="/login.jpg" alt="login" className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
