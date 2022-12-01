import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import styles from "../styles/artistPage.module.css";

function ArtistPage(props) {
  const [user, loading] = useAuthState(auth);
  const [requests, setRequests] = useState([]);
  const [reqCode, setReqCode] = useState([]);
  const [newReqCode, setNewReqCode] = useState([]);

  const requestsCollectionRef = collection(db, "requests");
  const reqCodeCollectionRef = collection(db, "reqCodes");
  const route = useRouter();

  //?Fetches COLLECTION matching user's uid
  const handleReqCode = async () => {
    if (user) {
      const q = query(reqCodeCollectionRef, where("userId", "==", user.uid));
      const onSnapShotUpdate = onSnapshot(q, (snapShot) => {
        setReqCode(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      return onSnapShotUpdate;
    }
  };

  //?Fetches all requests
  const getRequests = async (reqCode) => {
    const q = query(requestsCollectionRef, where("reqCode", "==", reqCode));
    const onSnapShotUpdate = onSnapshot(q, (snapShot) => {
      setRequests(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return onSnapShotUpdate;
  };

  //?POST new reqCode
  async function submitReqCode(newReqCode) {
    const q = query(reqCodeCollectionRef);
    await addDoc(reqCodeCollectionRef, {
      userId: user.uid,
      reqCode: parseInt(newReqCode),
    });
    setNewReqCode("");
  }

  //?DELETE request
  const deleteRequest = async (id) => {
    const reqDoc = doc(db, "requests", id);
    await deleteDoc(reqDoc);
  };

  //?Calling GET on User authentication

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
      <div className={styles.artistPage}>
        <div className={styles.artistHead}>
          <img src={user.photoURL} referrerPolicy="no-referrer"></img>
          <h1
            className={styles.requestCode}
          >{`Welcome back ${user.displayName}`}</h1>

          <h1 className={styles.requestCode}>{`REQUEST CODE: ${code}`}</h1>
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
        </div>

        <div className={styles.table}>
          <table>
            <tr>
              <th className={styles.tableHeader}>Song Title</th>
              <th className={styles.tableHeader}>Artist Name</th>
              <th className={styles.tableHeader}>User</th>
              <th className={styles.tableHeader}>Delete</th>
            </tr>
            {requests.map((request) => {
              return (
                <tr>
                  <th className={styles.tableBody}>{request.title}</th>
                  <th className={styles.tableBody}>{request.artist}</th>
                  <th className={styles.tableBody}>{request.user}</th>
                  <th
                    className={styles.tableBody}
                    onClick={() => {
                      deleteRequest(request.id);
                    }}
                  >
                    ❌
                  </th>
                </tr>
              );
            })}
          </table>
        </div>

        <div>
          <button className={styles.deleteAllButton}>DELETE ALL</button>
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
