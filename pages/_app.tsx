// pages/_app.tsx
import type { AppProps } from "next/app";
import { Provider } from "@/components/ui/provider";
import "../styles/index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
