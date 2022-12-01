import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebase";

function ArtistPage(props) {
  const [user, loading] = useAuthState(auth);
  const [requests, setRequests] = useState([]);
  const [reqCode, setReqCode] = useState([]);
  const [newReqCode, setNewReqCode] = useState([]);

  const requestsCollectionRef = collection(db, "requests");
  const reqCodeCollectionRef = collection(db, "reqCodes");
  const route = useRouter();

  //!Fetches COLLECTION matching user's uid
  //if no collection found, then notification to add REQUEST CODE
  //CREATE doc with reqCode field
  const handleReqCode = async () => {
    if (user) {
      const q = query(reqCodeCollectionRef, where("userId", "==", user.uid));
      const onSnapShotUpdate = onSnapshot(q, (snapShot) => {
        setReqCode(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      return onSnapShotUpdate;
    }
  };

  //!Fetches all requests
  //Need to update - Only fetch where Request's reqCode, matches user's reqCode
  const getRequests = async (reqCode) => {
    const q = query(requestsCollectionRef, where("reqCode", "==", reqCode));
    const onSnapShotUpdate = onSnapshot(q, (snapShot) => {
      setRequests(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return onSnapShotUpdate;
  };

  //!POST new reqCode

  async function submitReqCode(newReqCode) {
    const q = query(reqCodeCollectionRef);
    await addDoc(reqCodeCollectionRef, {
      userId: user.uid,
      reqCode: parseInt(newReqCode),
    });
    setNewReqCode("");
  }

  //?Calling GET on User authentication

  //Get Req
  useEffect(() => {
    handleReqCode();
  }, [user]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) route.push("/auth/login");

  if (user && !loading && reqCode) {
    let code;
    try {
      code = reqCode[0].reqCode;
      getRequests(code);
    } catch (error) {
      code = "...";
    }

    return (
      <div>
        <div id="artist-head">
          <h1>{`Welcome back ${user.displayName}`}</h1>

          <h1 id="request-code">{`REQUEST CODE: ${code}`}</h1>
          <input
            placeholder="Update Request Code"
            onChange={(e) => {
              setNewReqCode(e.target.value);
            }}
            value={newReqCode}
          ></input>
          <button onClick={() => submitReqCode(newReqCode)}>
            {"Submit New Request Code"}
          </button>

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
