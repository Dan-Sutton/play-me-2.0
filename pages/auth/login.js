import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebase";
import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import styles from "../../styles/login.module.css";
import Swal from "sweetalert2";
import Link from "next/link";

function Login(props) {
  const [requestCode, setrequestCode] = useState();
  const [title, setTitle] = useState();
  const [artist, setartist] = useState();
  const [name, setname] = useState();

  const route = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/artistPage");
    } catch (error) {
      console.log(error);
    }
  };

  const submitRequest = async () => {
    const requestsCollectionRef = collection(db, "requests");
    await addDoc(requestsCollectionRef, {
      reqCode: parseInt(requestCode),
      title: title,
      artist: artist,
      user: name,
    });

    setrequestCode("");
    setTitle("");
    setartist("");
    setname("");

    Swal.fire({
      position: "top",
      title: "Request sent! 🙌",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPageContent}>
        <h1 className={styles.playMeTitle}>Play That!</h1>

        <div className={styles.userInput}>
          <input
            type="number"
            className={styles.input}
            placeholder="REQUEST CODE"
            required
            onChange={(e) => setrequestCode(e.target.value)}
            value={requestCode}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="SONG TITLE"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="ARTIST NAME"
            required
            onChange={(e) => setartist(e.target.value)}
            value={artist}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="YOUR NAME"
            onChange={(e) => setname(e.target.value)}
            value={name}
          />
          <button className={styles.submit} onClick={submitRequest}>
            SUBMIT
          </button>
        </div>

        <div className={styles.loginandhome}>
          <div className={styles.login}>
            <button id="artist-login" onClick={GoogleLogin}>
              ARTIST LOGIN
            </button>
            {/* <a href="">Create New Account</a> */}
          </div>

          <div className={styles.homepage}>
            <Link href={"/"}>HOME PAGE</Link>
            {/* <a href="">Create New Account</a> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
