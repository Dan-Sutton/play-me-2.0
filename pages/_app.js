import "../styles/globals.css";
import Layout from "../components/layout";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const route = useRouter();

  return (
    <Layout>
      <Component {...pageProps} />
      <button
        onClick={() => {
          route.push("/auth/login");
        }}
      >
        Enter App
      </button>
    </Layout>
  );
}

export default MyApp;
