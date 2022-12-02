import "../styles/globals.css";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import welcomepage from "../public/welcomepage.png";
import Image from "next/image";

function MyApp({ Component, pageProps }) {
  const route = useRouter();

  return (
    <Layout>
      {/* <Image src={welcomepage}></Image> */}
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
