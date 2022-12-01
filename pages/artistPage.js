import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

function ArtistPage(props) {
  const [user, loading] = useAuthState(auth);
  const [requests, setRequests] = useState([]);
  const requestsCollectionRef = collection(db, "requests");
  const route = useRouter();

  useEffect(() => {
    const getRequests = async () => {
      const data = await getDocs(requestsCollectionRef);
      console.log(data);
    };

    getRequests();
  }, [user]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) route.push("/auth/login");
  if (user) {
    return (
      <div>
        <div id="artist-head">
          <h1>{`Welcome back ${user.displayName}`}</h1>
          <p id="request-code">REQUEST CODE: 1234</p>
          <img src={user.photoURL} referrerPolicy="no-referrer"></img>
        </div>

        <div id="table">
          <table>
            <tr>
              <th>Song Title</th>
              <th>Artist Name</th>
              <th>User</th>
              <th>Delete</th>
            </tr>
          </table>
        </div>

        <div id="delete-all-btn">
          <button id="delete-all">DELETE ALL</button>
        </div>

        <button
          onClick={() => {
            auth.signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }
}

export default ArtistPage;
