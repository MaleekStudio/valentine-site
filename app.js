// ✅ Put your image filenames here (inside /assets)
const IMAGES = [
  "pic1.jpeg",
  "pic2.jpeg",
  "pic3.jpeg",
  "pic4.jpeg",
  "pic5.jpeg",
  "pic6.jpeg",
  "pic7.jpeg",
  "pic8.jpeg",
];




const askScreen = document.getElementById("ask-screen");
const finalScreen = document.getElementById("final-screen");
const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const buttonArea = document.getElementById("button-area");
const heartsLayer = document.getElementById("hearts-layer");
const confettiLayer = document.getElementById("confetti-layer");
const gallery = document.getElementById("gallery");

function rand(min, max){ return Math.random() * (max - min) + min; }

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

// --- NO button dodge logic ---
function moveNoRandomly() {
  const areaRect = buttonArea.getBoundingClientRect();
  const btnRect  = noBtn.getBoundingClientRect();

  const padding = 16;

  const maxX = areaRect.width - btnRect.width - padding;
  const maxY = areaRect.height - btnRect.height - padding;

  // Keep it out of the top text zone (roughly)
  const minY = 70;

  let x = rand(padding, Math.max(padding, maxX));
  let y = rand(minY, Math.max(minY, maxY));

  // Set absolute position INSIDE button area
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

["mouseenter", "mousedown", "click", "touchstart"].forEach(evt => {
  noBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    moveNoRandomly();
  }, { passive:false });
});

// Ensure NO stays within bounds on resize
window.addEventListener("resize", () => {
  moveNoRandomly();
});

// --- Floating hearts ---
function spawnHeart() {
  const heart = document.createElement("div");
  heart.textContent = "❤";
  heart.style.position = "absolute";
  heart.style.left = `${rand(0, window.innerWidth - 20)}px`;
  heart.style.top = `${window.innerHeight + 30}px`;
  heart.style.fontSize = `${rand(14, 22)}px`;
  heart.style.opacity = `${rand(0.45, 0.85)}`;
  heart.style.color = `rgba(255, ${Math.floor(rand(80, 200))}, ${Math.floor(rand(120, 220))}, 0.85)`;
  heart.style.filter = "drop-shadow(0 6px 10px rgba(0,0,0,0.10))";
  heartsLayer.appendChild(heart);

  const drift = rand(-70, 70);
  const duration = rand(1800, 3600);

  heart.animate([
    { transform: `translate(0px, 0px)` },
    { transform: `translate(${drift}px, ${-(window.innerHeight + 140)}px)` }
  ], { duration, easing: "ease-in-out" });

  heart.animate([
    { opacity: 0 },
    { opacity: parseFloat(heart.style.opacity) },
    { opacity: 0 }
  ], { duration, easing: "ease-in-out" });

  setTimeout(() => heart.remove(), duration + 50);
}

let heartTimer = setInterval(spawnHeart, 220);

// --- Confetti burst ---
function spawnConfettiPiece() {
  const piece = document.createElement("div");
  piece.style.position = "absolute";
  piece.style.width = "8px";
  piece.style.height = "12px";
  piece.style.borderRadius = "3px";
  piece.style.left = `${rand(120, window.innerWidth - 120)}px`;
  piece.style.top = `${rand(90, 180)}px`;
  piece.style.background = `hsl(${rand(0, 360)}, 90%, 60%)`;
  piece.style.opacity = "1";
  confettiLayer.appendChild(piece);

  const endX = rand(-240, 240);
  const endY = window.innerHeight + 120;
  const dur  = rand(900, 1600);
  const rot  = rand(360, 900);

  piece.animate([
    { transform: `translate(0px, 0px) rotate(0deg)` },
    { transform: `translate(${endX}px, ${endY}px) rotate(${rot}deg)` }
  ], { duration: dur, easing: "cubic-bezier(.2,.7,.2,1)" });

  piece.animate([
    { opacity: 1 },
    { opacity: 1 },
    { opacity: 0 }
  ], { duration: dur, easing: "ease-in-out" });

  setTimeout(() => piece.remove(), dur + 50);
}

function confettiBurst(count = 60) {
  for (let i=0; i<count; i++) spawnConfettiPiece();
}

// --- Final gallery ---
function renderGallery() {
  gallery.innerHTML = "";
  IMAGES.forEach(src => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Us ❤️";
    img.loading = "lazy";

    card.appendChild(img);
    gallery.appendChild(card);
  });
}

// --- YES click transition ---
yesBtn.addEventListener("click", () => {
  confettiBurst(70);

  document.body.classList.add("love-mode");

  let heartRain = setInterval(spawnHeart, 300);
  setTimeout(() => clearInterval(heartRain), 12000);

  askScreen.classList.add("fade-out");

  setTimeout(() => {
    askScreen.classList.remove("active", "fade-out");
    renderGallery();
    finalScreen.classList.add("active", "fade-in");
  }, 450);
});

// Start with a random NO position so it feels alive
setTimeout(moveNoRandomly, 80);
