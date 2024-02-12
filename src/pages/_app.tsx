import Layout from "@/components/Layouts/MainLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import React, { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}

export default App;
