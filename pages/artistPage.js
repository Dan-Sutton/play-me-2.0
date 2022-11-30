import React from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

function ArtistPage(props) {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  const route = useRouter();
  if (!user) route.push("/auth/login");
  if (user)
    return (
      <div>
        <div id="artist-head">
          <h1>{`Welcome back ${user.displayName}`}</h1>
          <p id="request-code">REQUEST CODE: 1234</p>
        </div>

        <div id="table">
          <h2>Your Requests</h2>
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

export default ArtistPage;
