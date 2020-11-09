import React, { useContext, useEffect, useState } from "react";
import FirebaseContext from "../../context/FirebaseContext";

const Home = () => {
  const [userRepos, setUserRepos] = useState([]);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "fetch-repos" });
  }, []);

  chrome.runtime.onMessage.addListener((message) => {
    console.log("message", message);
    if (message.action === "storage-userRepos") {
      if (Array.isArray(message.payload)) {
        setUserRepos(message.payload);
      }
    }
  });

  return (
    <div>
      <button
        onClick={() => chrome.runtime.sendMessage({ action: "sign-out" })}
      >
        Sign Out
      </button>
      <h1>QuickHub Home</h1>
      {firebase.name}
      <ul>
        {userRepos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
