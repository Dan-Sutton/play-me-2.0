import "../styles/globals.css";
import Layout from "../components/layout";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const route = useRouter();

  return (
    <Layout>
      <button
        onClick={() => {
          route.push("/auth/login");
        }}
      >
        Enter App
      </button>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
