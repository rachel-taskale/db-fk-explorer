// pages/_app.js
import { Provider } from "@/components/ui/provider";

import "../styles/index.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
