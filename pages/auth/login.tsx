import { useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { signIn, getSession, getProviders } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiErrorCircle } from "react-icons/bi";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

import { MainLayout } from "../../components/layouts";
import { validations } from "../../utils";
import { useRouter } from "next/router";

import styles from "../../styles/LoginPage.module.css";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  // const { loginUser } = useContext( AuthContext );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [providers, setProviders] = useState<any>({});
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  
  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  useEffect(() => {
      if(watch("password").length !== 0){
        setPasswordLength(true)
      }else {
        setPasswordLength(false)
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("password")])
  

  const onLoginUser: SubmitHandler<FormData> = async ({
    email,
    password,
  }: FormData) => {
    setPasswordShown(false)
    setIsSubmit(true);
    setShowError(false);

    try {
      const userLog: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      const destination = router.query.p?.toString() || '/';
      router.replace(destination);

      if (!userLog.error) {
        setIsSubmit(false);
        router.push("/");
      } else {
        setIsSubmit(false);
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);

        console.error("Credentials do not match!", { type: "error" });
        return;
      }
    } catch (error) {
      throw new Error("Something is wrong");
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <MainLayout title="Ingresar | Pok3su">
      <div className={`${styles.container_login} container`}>
        <h2 className={`section__title-center `}>Iniciar sesión</h2>

        <form
          className={styles.login__form}
          onSubmit={handleSubmit(onLoginUser)}
        >
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
              <a className={styles.show__password} onClick={togglePassword}>
                {passwordShown ? <BsEyeSlashFill /> : <BsEyeFill />}
              </a>
            )}
          </div>
          <div className={styles["login__form-credential-error"]}>
            <span
              style={{ display: showError ? "flex" : "none" }}
              className={`${styles["login__content-errorCredential"]} fadeIn`}
            >
              <BiErrorCircle />
              Error, por favor revisa el usuario y/o contraseña
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
              className={`button ${
                isSubmit ? styles["login__button-loader"] : styles.login__button
              }`}
              disabled={isSubmit}
            >
              {" "}
              <span className={styles["login__button-text"]}>
                {!isSubmit ? "Entrar" : "Cargando..."}
              </span>
            </button>
          </div>

          <div className={styles["login__button-register"]}>
            <NextLink
              href={
                router.query.p
                  ? `/auth/register?p=${router.query.p}`
                  : "/auth/register"
              }
            >
              <a className={styles.link__register}>
                ¿No tienes cuenta? ¡Registrate por aqui!
              </a>
            </NextLink>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

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

export default LoginPage;
