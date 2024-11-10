import React, { useEffect, useState, useMemo } from "react";
import "./App.css";

function App() {
  const [hackerMode, setHackerMode] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [user, setUser] = useState(null);
  const konamiCode = useMemo(
    () => [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    []
  );
  const messages = useMemo(
    () => [
      "Dlaczego nadal tu jesteś?",
      "To jest takie irytujące!",
      "KONAMI CODE!",
      "Serio, idź sobie!",
      "Musisz być naprawdę znudzony!",
      "To jest bez sensu!",
      "Dlaczego ciągle próbujesz?",
      "Po prostu zamknij kartę!",
      "Marnujesz swój czas!",
    ],
    []
  );

  useEffect(() => {
    if (hovered) {
      const bgColorInterval = setInterval(() => {
        document.body.style.backgroundColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
      }, 1000);
      const alertInterval = setInterval(() => {
        if (!document.querySelector(".bsod")) {
          alert("FIN, FIN, FIN!!!!");
        }
      }, 5000);
      const textColorInterval = setInterval(() => {
        document.body.style.color =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
      }, 1000);
      const shakeInterval = setInterval(() => {
        const buttons = document.querySelectorAll("button");
        buttons.forEach((button) => {
          button.classList.add("shake");
          setTimeout(() => {
            button.classList.remove("shake");
          }, 500);
        });
      }, 4000);
      const messageInterval = setInterval(() => {
        const message = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById("annoyingMessage").textContent = message;
      }, 2000);
      return () => {
        clearInterval(bgColorInterval);
        clearInterval(alertInterval);
        clearInterval(textColorInterval);
        clearInterval(shakeInterval);
        clearInterval(messageInterval);
      };
    }
  }, [hovered, messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === konamiCode[konamiIndex]) {
        setKonamiIndex(konamiIndex + 1);
        if (konamiIndex + 1 === konamiCode.length) {
          activateHackerMode();
          setKonamiIndex(0);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        showBSOD();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [konamiIndex, konamiCode]);

  useEffect(() => {
    const buttons = document.querySelectorAll("button");
    const handleMouseOver = (e) => {
      if (!hackerMode) {
        e.target.style.position = "absolute";
        e.target.style.top =
          Math.random() * (window.innerHeight - e.target.offsetHeight) + "px";
        e.target.style.left =
          Math.random() * (window.innerWidth - e.target.offsetWidth) + "px";
      }
    };
    buttons.forEach((button) => {
      button.addEventListener("mouseover", handleMouseOver);
    });
    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("mouseover", handleMouseOver);
      });
    };
  }, [hackerMode]);

  const activateHackerMode = () => {
    setHackerMode(true);
    document.body.classList.add("hacker-mode");
    document.body.style.backgroundColor = "black";
    document.querySelectorAll("button").forEach((button) => {
      button.style.position = "static";
      button.style.opacity = 1;
    });
    document.getElementById("annoyingMessage").textContent = "";
    document.querySelector(".App").classList.remove("bg-light");
  };

  const showBSOD = () => {
    const bsod = document.createElement("div");
    bsod.className = "bsod";
    bsod.innerHTML = `
      <div>
        <h1>:(</h1>
        <p>Twój komputer napotkał problem i musi zostać uruchomiony ponownie.</p>
        <p>Jeśli chcesz dowiedzieć się więcej, możesz wyszukać ten błąd online: UŻYJ_SWOJEGO_MÓZGU</p>
      </div>
    `;
    document.body.appendChild(bsod);
  };

  const playSoundAndSearch = () => {
    const query = document.getElementById("searchQuery").value;
    window.location.href = `https://www.google.com/search?q=${query}`;
  };

  const redirectToGmail = () => {
    window.location.href = "https://mail.google.com";
  };

  const onSignIn = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    setUser({
      name: profile.getName(),
      email: profile.getEmail(),
      avatar: profile.getImageUrl(),
    });
  };

  useEffect(() => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          scope: "profile email",
        })
        .then(() => {
          window.gapi.signin2.render("google-signin-button", {
            scope: "profile email",
            width: 240,
            height: 50,
            longtitle: true,
            theme: "dark",
            onsuccess: onSignIn,
          });
        });
    });
  }, []);

  return (
    <div className="App d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-dark">
      <div className="top-right-corner">
        <button className="btn btn-secondary" onClick={redirectToGmail}>
          Gmail
        </button>
        <div id="google-signin-button"></div>
        {user && (
          <div className="user-info">
            <img src={user.avatar} alt="User Avatar" className="avatar" />
          </div>
        )}
      </div>
      <div className="logo mb-4">
        <span>G</span>
        <span>u</span>
        <span>u</span>
        <span>g</span>
        <span>l</span>
      </div>
      <div className="search-container mb-3">
        <input
          type="text"
          className="form-control search-bar"
          id="searchQuery"
          placeholder="Szukaj w Guugl"
        />
      </div>
      <div className="buttons">
        <button
          className="btn btn-primary mr-2"
          onMouseOver={() => setHovered(true)}
          onClick={playSoundAndSearch}
        >
          Szukaj w Guugl
        </button>
        <button className="btn btn-secondary">Szczęśliwy traf</button>
      </div>
      <p id="annoyingMessage"></p>
    </div>
  );
}

export default App;
