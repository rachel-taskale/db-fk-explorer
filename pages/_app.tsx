// pages/_app.tsx
import type { AppProps } from "next/app";
import { Provider } from "@/components/ui/provider";
import Layout from "@/components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
