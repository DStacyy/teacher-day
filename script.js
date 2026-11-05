/* ===== Popup surat ===== */
const btnBuka = document.getElementById("btnBuka");
const btnTutup = document.getElementById("btnTutup");
const overlay = document.getElementById("overlay");
const body = document.body;

let confettiDiluncurkan = false;

function bukaSurat() {
  btnBuka.classList.add("opened");

  // Beri jeda agar tutup amplop terbuka dulu sebelum surat muncul
  setTimeout(() => {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    body.classList.add("locked");
    btnTutup.focus();

    if (!confettiDiluncurkan) {
      luncurkanConfetti();
      confettiDiluncurkan = true;
    }
  }, 600);
}

function tutupSurat() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  body.classList.remove("locked");
  btnBuka.classList.remove("opened");
  btnBuka.focus();
}

btnBuka.addEventListener("click", bukaSurat);
btnTutup.addEventListener("click", tutupSurat);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) tutupSurat();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("show")) tutupSurat();
});

/* ===== Kartu harapan (flip) ===== */
document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", () => {
    const sudahBalik = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", String(sudahBalik));
  });
});

/* ===== Hiasan pop: ikon membesar dan memercik ===== */
document.querySelectorAll(".pop-item").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.remove("popped");
    void item.offsetWidth; // reset animasi agar bisa diulang
    item.classList.add("popped");
    jatuhkan(item);
  });
});

// Ikon berjatuhan dari atas layar, durasi 2 sampai 3 detik
function jatuhkan(el) {
  const ikonAsli = el.textContent.trim();
  const jumlah = 16;

  for (let i = 0; i < jumlah; i++) {
    const ikon = document.createElement("span");
    ikon.className = "falling";
    ikon.textContent = ikonAsli;
    ikon.style.left = Math.random() * 100 + "vw";
    ikon.style.fontSize = 24 + Math.random() * 20 + "px";
    ikon.style.setProperty("--dur", 2 + Math.random() + "s");
    ikon.style.setProperty(
      "--spin",
      (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360) + "deg"
    );
    ikon.style.animationDelay = Math.random() * 0.4 + "s";
    document.body.appendChild(ikon);

    // Hapus elemen setelah animasi selesai (dengan cadangan jika animasi dinonaktifkan)
    ikon.addEventListener("animationend", () => ikon.remove());
    setTimeout(() => ikon.remove(), 3600);
  }
}

/* ===== Daun yang bisa digeser ===== */
const playground = document.getElementById("playground");
const daun = document.getElementById("daun");
let sedangGeser = false;
let geserOffsetX = 0;
let geserOffsetY = 0;

daun.addEventListener("pointerdown", (e) => {
  sedangGeser = true;
  daun.setPointerCapture(e.pointerId);
  const rect = daun.getBoundingClientRect();
  geserOffsetX = e.clientX - rect.left;
  geserOffsetY = e.clientY - rect.top;
  daun.classList.add("dragging");
});

daun.addEventListener("pointermove", (e) => {
  if (!sedangGeser) return;
  const area = playground.getBoundingClientRect();
  const maxX = area.width - daun.offsetWidth;
  const maxY = area.height - daun.offsetHeight;

  let x = e.clientX - area.left - geserOffsetX;
  let y = e.clientY - area.top - geserOffsetY;
  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  daun.style.left = x + "px";
  daun.style.top = y + "px";
});

function selesaiGeser() {
  if (!sedangGeser) return;
  sedangGeser = false;
  daun.classList.remove("dragging");
}
daun.addEventListener("pointerup", selesaiGeser);
daun.addEventListener("pointercancel", selesaiGeser);

/* ===== Scroll reveal untuk tiap bagian ===== */
const bagianScroll = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const pengamat = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          pengamat.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  bagianScroll.forEach((el) => pengamat.observe(el));
} else {
  bagianScroll.forEach((el) => el.classList.add("visible"));
}

/* ===== Confetti sederhana dengan canvas ===== */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let partikel = [];
let animasiId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const warnaConfetti = ["#1e6f5c", "#6fd3a8", "#3aa584", "#b8ecd6", "#e4f8ef", "#2a8a74"];

function luncurkanConfetti() {
  for (let i = 0; i < 120; i++) {
    partikel.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      r: 4 + Math.random() * 4,
      vx: -1.5 + Math.random() * 3,
      vy: 2 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vrot: -0.1 + Math.random() * 0.2,
      warna: warnaConfetti[Math.floor(Math.random() * warnaConfetti.length)],
    });
  }
  if (!animasiId) animasiId = requestAnimationFrame(gambar);
}

function gambar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  partikel.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.warna;
    ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
    ctx.restore();
  });

  partikel = partikel.filter((p) => p.y < canvas.height + 20);

  if (partikel.length > 0) {
    animasiId = requestAnimationFrame(gambar);
  } else {
    animasiId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ===== Backsound (file mp3 dari folder assets) ===== */
const musik = document.getElementById("backsound");
const btnMusik = document.getElementById("btnMusik");
let musikAktif = false;

musik.volume = 0.4;

function setMusik(putar) {
  if (putar) {
    // Browser hanya mengizinkan audio diputar setelah ada interaksi pengguna
    musik.play()
      .then(() => {
        musikAktif = true;
        btnMusik.classList.add("playing");
        btnMusik.textContent = "🎵";
        btnMusik.setAttribute("aria-pressed", "true");
      })
      .catch(() => {
        // File belum ada, path salah, atau diblokir browser
      });
  } else {
    musik.pause();
    musikAktif = false;
    btnMusik.classList.remove("playing");
    btnMusik.textContent = "🔇";
    btnMusik.setAttribute("aria-pressed", "false");
  }
}

btnMusik.addEventListener("click", () => setMusik(!musikAktif));

// Musik ikut mulai saat amplop diketuk pertama kali
btnBuka.addEventListener("click", () => {
  if (!musikAktif) setMusik(true);
});