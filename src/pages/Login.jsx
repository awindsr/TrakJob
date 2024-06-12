import React, { useEffect, useState } from "react";
import supabase from "../utils/Supabase"; // Assuming you have a supabase client
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const [isSignup, setIsSignup] = useState(false);

  const toggleSignup = () => {
    setIsSignup((prevState) => !prevState);
  };

  const handleSignup = async () => {
    try {
      const { user, error: userError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (userError) {
        throw new Error(userError.message);
      } else {
        setSuccessMessage(
          "Account created successfully! Please check your email to verify your account."
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.log("Error signing up:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const { user, error: userError } = await supabase.auth.signInWithPassword(
        {
          email: formData.email,
          password: formData.password,
        }
      );
      if (userError) {
        throw new Error(userError.message);
      } else {
        // console.log(user.user.id)
        const { data, error } = await supabase.auth.getUserIdentities();
        // console.log(data.identities[0].user_id)
        sessionStorage.setItem("user_id", data.identities[0].user_id);

       try {
        const { data:userData, error:userDataError } = await supabase
        .from("users")
        .insert([{ email: formData.email, user_id: data.identities[0].user_id}])
        .select();

        if (userDataError) {
          throw new Error(userDataError.message);
        }
        else{
          console.log("User added successfully")
        }
       } catch (error) {
        console.log(error.message)
       }
        // console.log("User signed in:", user);
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error signing in:", error);

      setErrorMessage(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      isSignup &&
      formData.password == formData.confirmPassword &&
      formData.password.length >= 8
    ) {
      handleSignup();
    } else if (!isSignup && formData.password.length >= 8) {
      handleLogin();
    }
  };

  return (
    <div className="loginContainer flex h-screen w-screen font-gilroy bg-tertiary">
      <div className="w-2/3 h-full p-4 flex justify-center items-center">
        <div className="flex flex-col h-full items-center justify-center">
          <h2 className="font-bold text-4xl">
            {!isSignup ? "Welcome Back 👋" : "Welcome 👋"}
          </h2>
          <p className="text-gray-500">
            {!isSignup
              ? "Login to your account"
              : "Enter your details to sign up"}
          </p>
          <form
            className="flex flex-col gap-2 mt-4"
            onSubmit={(e) => handleSubmit(e)}>
            {isSignup && (
              <input
                type="text"
                placeholder="Name"
                className="p-2 border border-gray-300 rounded-lg mb-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="p-2 border border-gray-300 rounded-lg mb-2"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 border border-gray-300 rounded-lg mb-2"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {isSignup && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="p-2 border border-gray-300 rounded-lg mb-2"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            )}
            <button
              className="bg-primary text-white p-2 rounded-lg"
              type="submit">
              {!isSignup ? "Login" : "Sign Up"}
            </button>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm mt-2">{successMessage}</p>
            )}
            <button className="text-neutral-500" onClick={toggleSignup}>
              {!isSignup
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="text-primary">
                {!isSignup ? "Sign Up" : "Login"}
              </span>
            </button>
          </form>
        </div>
        <div className="absolute top-0 p-4">
          <h1 className="font-black text-3xl">Trak.Job</h1>
          <p>Your Job Hunt, Organized</p>
        </div>
      </div>
      <div className="w-1/3 h-full">
        <img
          src="./images/login-bg-1x.png"
          alt="background image"
          className="w-full h-full object-fill object-center"
        />
      </div>
    </div>
  );
}
