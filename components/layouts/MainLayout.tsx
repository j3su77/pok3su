import { FC, ReactNode } from "react";
import Head from "next/head";

import {  Navbar } from "../ui";
import { SideMenu } from "../ui";
import { Footer } from "../ui";


interface Props {
  title: string;
  children: ReactNode;
  imageFullUrl?: string;
}

export const MainLayout: FC<Props> = ({
  children,
  title,
  imageFullUrl,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
    

        <meta name="og:title" content={title} />
     
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>

      <Navbar />
      <SideMenu />
    

      <main style={{marginTop: "calc(var(--header-height) + 15px)", minHeight: "calc(100vh - var(--header-height))"}}>
        {children}
      </main>

    <Footer />
    </>
  );
};
