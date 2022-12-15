import "../styles/globals.css";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import welcomepage from "../public/welcome.png";
import Image from "next/image";

function MyApp({ Component, pageProps }) {
  const route = useRouter();

  return (
    <Layout>
      <div className={"apphomecontainer"}>
        <div className={"welcomeimagecontainer"}>
          <Image
            className={"welcomeimage"}
            width={600}
            height={800}
            src={welcomepage}
          ></Image>
        </div>

        <button
          className={"enterbutton"}
          onClick={() => {
            route.push("/auth/login");
          }}
        >
          Enter App
        </button>
      </div>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
