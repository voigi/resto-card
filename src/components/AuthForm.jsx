import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { findUser, addUser, isEmailTaken } from "../mocks/UserMock" 

const schemaSignup = yup.object({
  username: yup.string().required("Nom d’utilisateur requis").min(3).max(20),
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup.string().required("Mot de passe requis").min(6),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe doivent correspondre")
    .required("Confirmation requise"),
});

const schemaLogin = yup.object({
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup.string().required("Mot de passe requis"),
});

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isLogin ? schemaLogin : schemaSignup),
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    if (isLogin) {
      const user = findUser(data.email.trim(), data.password);
      if (user) {
        alert("Connexion réussie !");
        onLogin();
      } else {
        alert("Email ou mot de passe invalide");
      }
    } else {
      if (isEmailTaken(data.email.trim())) {
        alert("Cet email est déjà utilisé");
        return;
      }
      addUser({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
      });
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setIsLogin(true);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Connexion" : "Inscription"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isLogin && (
          <>
            <label>Nom d’utilisateur</label>
            <input {...register("username")} />
            <p>{errors.username?.message}</p>
          </>
        )}

        <label>Email</label>
        <input {...register("email")} />
        <p>{errors.email?.message}</p>

        <label>Mot de passe</label>
        <input type="password" {...register("password")} />
        <p>{errors.password?.message}</p>

        {!isLogin && (
          <>
            <label>Confirmer mot de passe</label>
            <input type="password" {...register("confirmPassword")} />
            <p>{errors.confirmPassword?.message}</p>
          </>
        )}

        <button type="submit">{isLogin ? "Se connecter" : "S’inscrire"}</button>
      </form>

      <p className="toggle-link">
        {isLogin ? "Pas encore inscrit ?" : "Déjà un compte ?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: "blue", cursor: "pointer", background: "none", border: "none" }}
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;


