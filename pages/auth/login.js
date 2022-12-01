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
  };

  return (
    <div>
      <h1 id="playme-title">Play Me!</h1>

      <div class="user-input">
        <input
          type="number"
          id="request-code"
          placeholder="REQUEST CODE"
          required
          onChange={(e) => setrequestCode(e.target.value)}
          value={requestCode}
        />
        <input
          type="text"
          id="song-title"
          placeholder="SONG TITLE"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          type="text"
          id="artist-name"
          placeholder="ARTIST NAME"
          required
          onChange={(e) => setartist(e.target.value)}
          value={artist}
        />
        <input
          type="text"
          id="your-name"
          placeholder="YOUR NAME"
          onChange={(e) => setname(e.target.value)}
          value={name}
        />
      </div>

      <div id="submit-btn">
        <button onClick={submitRequest}>SUBMIT</button>
      </div>

      <div class="login">
        <button id="artist-login" onClick={GoogleLogin}>
          ARTIST LOGIN
        </button>
        <a href="">Create New Account</a>
      </div>
    </div>
  );
}

export default Login;
