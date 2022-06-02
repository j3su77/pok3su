import Head from "next/head";
import type { AppProps } from "next/app";
import { AuthProvider, UIProvider } from "../context";

import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <UIProvider>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
            />
          </Head>

          <Component {...pageProps} />
        </UIProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;
