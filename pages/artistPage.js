import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebase";

function ArtistPage(props) {
  const [user, loading] = useAuthState(auth);
  const [requests, setRequests] = useState([]);
  const requestsCollectionRef = collection(db, "requests");
  const route = useRouter();

  //!Fetches COLLECTION matching user's uid
  //if no collection found, then notification to add REQUEST CODE
  //CREATE doc with reqCode field

  //!Fetches all requests
  //Need to update - Only fetch where Request's reqCode, matches user's reqCode
  const getRequests = async () => {
    const q = query(requestsCollectionRef, where("reqCode", "==", 12345678));

    const onSnapShotUpdate = onSnapshot(q, (snapShot) => {
      setRequests(snapShot.docs.map((doc) => ({ ...doc.data() })));
    });

    return onSnapShotUpdate;
  };

  useEffect(() => {
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
            {requests.map((request) => {
              return (
                <tr>
                  <th>{request.title}</th>
                  <th>{request.artist}</th>
                  <th>{request.user}</th>
                  <th>❌</th>
                </tr>
              );
            })}
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
