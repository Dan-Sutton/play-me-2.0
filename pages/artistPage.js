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
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import styles from "../styles/artistPage.module.css";
import logo from "../public/playmelogo.png";
import Image from "next/image";

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

  //?UPDATE reqCode

  const updateReqCode = async (newCode, id) => {
    const reqDoc = doc(db, "reqCodes", id);
    updateDoc(reqDoc, {
      userId: user.uid,
      reqCode: parseInt(newCode),
    });
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
    let button;
    try {
      code = reqCode[0].reqCode;
      getRequests(code);
    } catch (error) {
      code = "Please add a code!";
    }

    if (code === "Please add a code!") {
      button = (
        <button
          className={styles.submitButton}
          onClick={() => {
            submitReqCode(newReqCode);
          }}
        >
          SUBMIT
        </button>
      );
    } else {
      button = reqCode.map((code) => {
        return (
          <button
            className={styles.submitButton}
            onClick={() => {
              try {
                updateReqCode(newReqCode, code.id);
              } catch {
                submitReqCode(newReqCode);
              }
            }}
          >
            {"SUBMIT"}
          </button>
        );
      });
    }

    return (
      <div className={styles.artistPage}>
        <div className={styles.artistPageContent}>
          <div className={styles.artistHead}>
            <Image alt="playit" src={logo} className={styles.logo}></Image>
            <h2 className={styles.welcome}>{`Welcome back`}</h2>

            <div className={styles.nameAndImage}>
              <h2 className={styles.userName}>{`${user.displayName}`}</h2>
              <img
                className={styles.userImage}
                src={user.photoURL}
                referrerPolicy="no-referrer"
              ></img>
            </div>

            <h1 className={styles.requestCode}>{`REQUEST CODE: ${code}`}</h1>

            <div className={styles.updateReqDiv}>
              <input
                className={styles.reqUpdate}
                placeholder="Update Request Code"
                onChange={(e) => {
                  setNewReqCode(e.target.value);
                }}
                value={newReqCode}
              ></input>
              {button}
            </div>
          </div>

          <div className={styles.table}>
            <table className={styles.tableClass}>
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
                      className={styles.deleteButton}
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

          <button
            className={styles.signOut}
            onClick={() => {
              auth.signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }
}

export default ArtistPage;
