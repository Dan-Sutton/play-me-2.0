import React from "react";

function Login(props) {
  return (
    <div>
      <h1 id="playme-title">Play Me!</h1>

      <form>
        <div class="user-input">
          <input
            type="text"
            id="request-code"
            placeholder="REQUEST CODE"
            required
          />
          <input
            type="text"
            id="song-title"
            placeholder="SONG TITLE"
            required
          />
          <input
            type="text"
            id="artist-name"
            placeholder="ARTIST NAME"
            required
          />
          <input type="text" id="your-name" placeholder="YOUR NAME" />
        </div>

        <div id="submit-btn">
          <input id="submit" placeholder="SUBMIT" />
        </div>
      </form>

      <div class="login">
        <a href="login.html" id="artist-login">
          ARTIST LOGIN
        </a>
        <a href="">Create New Account</a>
      </div>
    </div>
  );
}

export default Login;
