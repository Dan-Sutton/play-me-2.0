import React from "react";
import Link from "next/link";

function Nav(props) {
  return (
    <nav>
      <Link href={"/"}>Logo</Link>
      <ul>
        <Link href={"/auth/login"}>Artist Page</Link>
      </ul>
    </nav>
  );
}

export default Nav;
