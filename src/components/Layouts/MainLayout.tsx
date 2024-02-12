import React from "react";
import CustomNavbar from "../Navbar";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";

const loadData = (url: string) =>
  fetch(url).then((resp) => {
    console.log("RESP:", url, resp);
    if (resp.ok) {
      return resp.json() as Promise<any>;
    } else {
      return resp.json().then((error) => {
        throw error;
      });
    }
  });

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  console.log("PATH:", router.pathname.split("/")[1]);

  console.log("PROCESS:", process.env.ZITADEL_ISSUER);

  const { data: user, isValidating } = useSWR(`/api/userinfo`, (url) =>
    loadData(url)
  );

  return (
    <>
      <Head>
        <title>Stocks</title>
      </Head>
      <CustomNavbar user={user} isValidating={isValidating} />

      <main className="w-full h-[calc(100vh-64px)]" suppressHydrationWarning>
        <AnimatePresence mode="popLayout">
          <div
            key={router.pathname.split("/")[1]}
            className="w-full h-full z-10"
          >
            {children}
          </div>
        </AnimatePresence>
      </main>
    </>
  );
}
