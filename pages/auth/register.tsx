import { useState, useEffect, useRef, useContext } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { BiErrorCircle } from "react-icons/bi";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";

import { MainLayout } from "../../components/layouts/MainLayout";
import { validations } from "../../utils";

import { AuthContext } from "../../context/auth/AuthContext";

import styles from "../../styles/LoginPage.module.css";

type FormData = {
  email: string;
  password: string;
  password_repeat?: string;
  name: string;
};

const RegisterUser = () => {
  const { registerUser } = useContext(AuthContext);
  const [showError, setShowError] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const password = useRef({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  password.current = watch("password", "");

  const onRegisterUser = async ({ name, email, password }: FormData) => {
    setPasswordShown(false);
    setIsSubmit(true);
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(JSON.stringify(message!));
      console.log("error");
      setIsSubmit(false);
      setTimeout(() => setShowError(false), 4000);
      return;
    }

    // Todo: navegar a la pantalla que el usuario estaba
    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);

    await signIn("credentials", { email, password });
  };

  useEffect(() => {
    if (watch("password").length !== 0) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("password")]);

  return (
    <MainLayout title={"Registrarse | Pok3su"}>
      <div className={`${styles.container_login} container`}>
        <h2 className={`section__title-center`}>Registrarse</h2>

        <form
          className={styles.login__form}
          onSubmit={(e) => e.preventDefault()}
        >
          {/* --------names--------- */}
          <div className={styles["login__content-input"]}>
            <label htmlFor="email">Nombres</label>
            <input
              className={`${styles.login__input} ${
                errors.name && styles["login__input-invalid"]
              }`}
              type="text"
              id="name"
              {...register("name", {
                required: "Este campo es requerido",
                minLength: {
                  value: 3,
                  message:
                    "Vaya! ese nombre no es válido, a menos que seas asiatico y te llames Yu",
                },
              })}
            />
            {errors.name && (
              <p className={styles.text__error}>{errors.name.message}</p>
            )}
          </div>

          {/* --------email--------- */}
          <div className={styles["login__content-input"]}>
            <label htmlFor="email">Email</label>
            <input
              className={`${styles.login__input} ${
                errors.email && styles["login__input-invalid"]
              }`}
              type="email"
              id="email"
              {...register("email", {
                required: "Este campo es requerido",
                validate: validations.isEmail,
              })}
            />
            {errors.email && (
              <p className={styles.text__error}>{errors.email.message}</p>
            )}
          </div>

          {/* --------contraseña--------- */}
          <div className={styles["login__content-input"]}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              className={`${styles.login__input} ${
                errors.password && styles["login__input-invalid"]
              }`}
              type={passwordShown ? "text" : "password"}
              {...register("password", {
                required: "Este campo es requerido",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            {errors.password && (
              <p className={styles.text__error}>{errors.password.message}</p>
            )}
            {passwordLength && (
              <a
                className={styles.show__password}
                onClick={() => setPasswordShown(!passwordShown)}
              >
                {passwordShown ? <BsEyeSlashFill /> : <BsEyeFill />}
              </a>
            )}
          </div>

          {/* --------repetir contraseña--------- */}
          <div className={styles["login__content-input"]}>
            <label htmlFor="password-repeat">Repite la contraseña</label>
            <input
              id="password_repeat"
              type="password"
              className={`${styles.login__input} ${
                errors.password_repeat && styles["login__input-invalid"]
              }`}
              {...register("password_repeat", {
                required: "Este campo es requerido",
                validate: (value) =>
                  value === password.current || "Las contraseñas no coinciden",
              })}
            />
            {errors.password_repeat && (
              <p className={styles.text__error}>
                {errors.password_repeat.message}
              </p>
            )}
          </div>

          <div className={styles["login__form-credential-error"]}>
            <span
              style={{ display: showError ? "flex" : "none" }}
              className={`${styles["login__content-errorCredential"]} fadeIn`}
            >
              <BiErrorCircle />
              {errorMessage}
            </span>
          </div>

          <div
            style={{
              position: "relative",
              display: "grid",
              placeItems: "center",
            }}
          >
            <button
              onClick={handleSubmit(onRegisterUser)}
              className={`button ${
                isSubmit ? styles["login__button-loader"] : styles.login__button
              }`}
              disabled={isSubmit}
            >
              <span className={styles["login__button-text"]}>
                {!isSubmit ? "Crear cuenta" : "Cargando..."}
              </span>
            </button>
          </div>

          <div className={styles["login__button-register"]}>
            <Link
              href={
                router.query.p
                  ? `/auth/login?p=${router.query.p}`
                  : "/auth/login"
              }
            >
              <a className={styles.link__register}>
                ¿Ya tienes cuenta? ¡Logueate por aqui!
              </a>
            </Link>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  // console.log({session});

  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterUser;
