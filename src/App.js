import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import { jwtDecode } from "jwt-decode";

function App() {
  const [hackerMode, setHackerMode] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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

  let shakeCountKonami = 0;
  let shakeCountBSOD = 0;
  let lastShakeTime = 0;

  const handleDeviceMotion = (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const currentTime = new Date().getTime();

    if (currentTime - lastShakeTime > 1000) {
      shakeCountKonami = 0;
      shakeCountBSOD = 0;
    }

    if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
      lastShakeTime = currentTime;
      shakeCountKonami++;
      shakeCountBSOD++;

      if (shakeCountKonami >= 4) {
        activateHackerMode();
        shakeCountKonami = 0;
      }

      if (shakeCountBSOD >= 2) {
        showBSOD();
        shakeCountBSOD = 0;
      }
    }
  };

  useEffect(() => {
    let bgColorInterval,
      alertInterval,
      textColorInterval,
      shakeInterval,
      messageInterval;

    if (hovered && !hackerMode) {
      bgColorInterval = setInterval(() => {
        document.body.style.backgroundColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
      }, 1000);
      alertInterval = setInterval(() => {
        if (!document.querySelector(".bsod")) {
          alert("FIN, FIN, FIN!!!!");
        }
      }, 5000);
      textColorInterval = setInterval(() => {
        document.body.style.color =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
      }, 1000);
      shakeInterval = setInterval(() => {
        const buttons = document.querySelectorAll(".shakeable");
        buttons.forEach((button) => {
          button.classList.add("shake");
          setTimeout(() => {
            button.classList.remove("shake");
          }, 500);
        });
      }, 4000);
      messageInterval = setInterval(() => {
        const message = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById("annoyingMessage").textContent = message;
      }, 2000);
    }

    return () => {
      clearInterval(bgColorInterval);
      clearInterval(alertInterval);
      clearInterval(textColorInterval);
      clearInterval(shakeInterval);
      clearInterval(messageInterval);
    };
  }, [hovered, messages, hackerMode]);

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

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (touch.clientX < window.innerWidth / 2) {
          handleKeyDown({ keyCode: 37 });
        } else {
          handleKeyDown({ keyCode: 39 });
        }
      } else if (e.touches.length === 2) {
        handleKeyDown({ keyCode: 38 });
      } else if (e.touches.length === 3) {
        handleKeyDown({ keyCode: 40 });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("touchstart", handleTouchStart);

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleDeviceMotion);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("touchstart", handleTouchStart);
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleDeviceMotion);
      }
    };
  }, [konamiIndex, konamiCode]);

  useEffect(() => {
    const buttons = document.querySelectorAll(".shakeable");
    const handleMouseOver = (e) => {
      if (!hackerMode) {
        e.target.style.position = "absolute";
        e.target.style.top =
          Math.random() * (window.innerHeight - e.target.offsetHeight) + "px";
        e.target.style.left =
          Math.random() * (window.innerWidth - e.target.offsetWidth) + "px";
      }
    };

    const handleTouchStart = (e) => {
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
      button.addEventListener("touchstart", handleTouchStart);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("mouseover", handleMouseOver);
        button.removeEventListener("touchstart", handleTouchStart);
      });
    };
  }, [hackerMode]);

  const activateHackerMode = () => {
    setHackerMode(true);
    document.body.classList.add("hacker-mode");
    document.body.style.backgroundColor = "black";
    document.querySelectorAll(".shakeable").forEach((button) => {
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

  const handleCredentialResponse = (response) => {
    const userObject = jwtDecode(response.credential);
    setUser({
      name: userObject.name,
      email: userObject.email,
      avatar: userObject.picture,
    });
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setUser(null);
    setShowLogoutConfirm(false);
    localStorage.removeItem("user");
    window.location.reload();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return (
    <div className="App d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-dark">
      <div className="top-right-corner">
        {user && (
          <button className="btn btn-secondary" onClick={redirectToGmail}>
            Gmail
          </button>
        )}
        {!user && <div id="google-signin-button"></div>}
        {user && (
          <div className="user-info" onClick={handleLogout}>
            <img src={user.avatar} alt="User Avatar" className="avatar" />
          </div>
        )}
      </div>
      {showLogoutConfirm && (
        <div className="logout-confirm">
          <p>Czy jesteś pewien, że chcesz się wylogować?</p>
          <button className="btn btn-danger" onClick={confirmLogout}>
            Tak
          </button>
          <button className="btn btn-secondary" onClick={cancelLogout}>
            Nie
          </button>
        </div>
      )}
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
          className="btn btn-primary mr-2 shakeable"
          onMouseOver={() => setHovered(true)}
          onClick={playSoundAndSearch}
        >
          Szukaj w Guugl
        </button>
        <button className="btn btn-secondary shakeable">Szczęśliwy traf</button>
      </div>
      <p id="annoyingMessage"></p>
    </div>
  );
}

export default App;
