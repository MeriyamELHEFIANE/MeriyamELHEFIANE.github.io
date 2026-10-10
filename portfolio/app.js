/* ============================================================
   GLOBAL STATE
   ============================================================ */
const GITHUB_USER = "MeriyamELHEFIANE";
let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   LOADER / BOOT SEQUENCE
   ============================================================ */
const bootMessages = [
  "Initializing Embedded System...",
  "Loading AI Engine...",
  "Connecting Sensors...",
  "Compiling Firmware...",
  "Deploying Portfolio...",
  "System Ready."
];

function runBootSequence(){
  const linesEl = document.getElementById("boot-lines");
  const fill = document.getElementById("boot-fill");
  const pct = document.getElementById("boot-pct");
  let progress = 0;

  bootMessages.forEach((msg, i) => {
    const row = document.createElement("div");
    row.className = "boot-line";
    row.innerHTML = `<span>${msg}</span><span class="status">...</span>`;
    linesEl.appendChild(row);
  });

  const rows = linesEl.querySelectorAll(".boot-line");
  const stepTime = reduceMotion ? 60 : 340;

  rows.forEach((row, i) => {
    setTimeout(() => {
      row.style.opacity = 1;
      row.style.transition = "opacity .3s ease";
      const status = row.querySelector(".status");
      status.textContent = "OK";
      progress = Math.round(((i + 1) / rows.length) * 100);
      fill.style.width = progress + "%";
      pct.textContent = progress + "%";
    }, i * stepTime);
  });

  const totalTime = rows.length * stepTime + 500;
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
    document.body.style.overflow = "auto";
    startPageAnimations();
  }, totalTime);
}

document.body.style.overflow = "hidden";
window.addEventListener("DOMContentLoaded", runBootSequence);

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + "px";
  dot.style.top = mouseY + "px";
});

function animateRing(){
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  ring.style.left = ringX + "px";
  ring.style.top = ringY + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener("mouseover", (e) => {
  if(e.target.closest("a, button, .magnetic, input, textarea")){
    ring.classList.add("hover");
  }
});
document.addEventListener("mouseout", (e) => {
  if(e.target.closest("a, button, .magnetic, input, textarea")){
    ring.classList.remove("hover");
  }
});

/* Magnetic buttons */
document.querySelectorAll(".magnetic").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.4}px)`;
  });
  el.addEventListener("mouseleave", () => { el.style.transform = "translate(0,0)"; });
});

/* ============================================================
   THEME TOGGLE
   ============================================================ */
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  root.setAttribute("data-theme", current === "light" ? "dark" : "light");
});

/* ============================================================
   TYPED ROLE TEXT
   ============================================================ */
const roles = [
  "Embedded Systems Engineer",
  "AI / Machine Learning Enthusiast",
  "Robotics Club President",
  "Full-Stack Developer"
];
const typedEl = document.getElementById("typed-role");
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = roles[roleIndex];
  if(!deleting){
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if(charIndex === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if(charIndex === 0){ deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

/* ============================================================
   BACKGROUND CIRCUIT CANVAS (traces + binary + particles)
   ============================================================ */
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let W, H;
function resizeBg(){
  W = bgCanvas.width = window.innerWidth;
  H = bgCanvas.height = document.body.scrollHeight;
}
resizeBg();
window.addEventListener("resize", () => { resizeBg(); });

/* circuit trace paths (simple orthogonal paths) */
const traces = [];
function makeTrace(){
  const startX = Math.random() * W;
  const startY = Math.random() * H;
  const points = [[startX, startY]];
  let x = startX, y = startY;
  const segments = 4 + Math.floor(Math.random() * 4);
  for(let i=0;i<segments;i++){
    if(i % 2 === 0){ x += (Math.random() - 0.5) * 260; }
    else { y += (Math.random() - 0.5) * 260; }
    points.push([x,y]);
  }
  return { points, progress: Math.random(), speed: 0.0009 + Math.random()*0.0016, color: Math.random() > 0.5 ? "73,232,212" : "255,180,84" };
}
for(let i=0;i<18;i++){ traces.push(makeTrace()); }

/* binary digits */
const binaries = [];
for(let i=0;i<38;i++){
  binaries.push({
    x: Math.random()*W, y: Math.random()*H,
    val: Math.random() > 0.5 ? "1" : "0",
    speed: 0.15 + Math.random()*0.35,
    opacity: 0.08 + Math.random()*0.18
  });
}

/* particles */
const particles = [];
for(let i=0;i<50;i++){
  particles.push({
    x: Math.random()*W, y: Math.random()*H,
    vx:(Math.random()-0.5)*0.15, vy:(Math.random()-0.5)*0.15,
    r: 0.6 + Math.random()*1.4
  });
}

function drawTrace(t){
  bgCtx.beginPath();
  bgCtx.moveTo(t.points[0][0], t.points[0][1]);
  for(let i=1;i<t.points.length;i++){ bgCtx.lineTo(t.points[i][0], t.points[i][1]); }
  bgCtx.strokeStyle = `rgba(${t.color},0.12)`;
  bgCtx.lineWidth = 1;
  bgCtx.stroke();

  // moving pulse along path length
  const totalSegs = t.points.length - 1;
  const segFloat = t.progress * totalSegs;
  const segIdx = Math.min(Math.floor(segFloat), totalSegs - 1);
  const segT = segFloat - segIdx;
  const p0 = t.points[segIdx], p1 = t.points[segIdx+1];
  const px = p0[0] + (p1[0]-p0[0]) * segT;
  const py = p0[1] + (p1[1]-p0[1]) * segT;

  bgCtx.beginPath();
  bgCtx.arc(px, py, 2.4, 0, Math.PI*2);
  bgCtx.fillStyle = `rgba(${t.color},0.9)`;
  bgCtx.shadowColor = `rgba(${t.color},1)`;
  bgCtx.shadowBlur = 8;
  bgCtx.fill();
  bgCtx.shadowBlur = 0;

  t.progress += t.speed;
  if(t.progress > 1) t.progress = 0;
}

function bgLoop(){
  bgCtx.clearRect(0,0,W,H);

  traces.forEach(drawTrace);

  bgCtx.font = "11px 'JetBrains Mono', monospace";
  binaries.forEach(b => {
    bgCtx.fillStyle = `rgba(73,232,212,${b.opacity})`;
    bgCtx.fillText(b.val, b.x, b.y);
    b.y += b.speed;
    if(b.y > H){ b.y = -10; b.x = Math.random()*W; b.val = Math.random() > 0.5 ? "1":"0"; }
  });

  particles.forEach(p => {
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    bgCtx.fillStyle = "rgba(255,180,84,0.35)";
    bgCtx.fill();
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0) p.x = W; if(p.x > W) p.x = 0;
    if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
  });

  requestAnimationFrame(bgLoop);
}
if(!reduceMotion){ bgLoop(); } else { bgCtx.clearRect(0,0,W,H); }

/* ============================================================
   OSCILLOSCOPE (hero)
   ============================================================ */
const scopeCanvas = document.getElementById("scope");
const scopeCtx = scopeCanvas.getContext("2d");
function resizeScope(){
  scopeCanvas.width = scopeCanvas.clientWidth * devicePixelRatio;
  scopeCanvas.height = scopeCanvas.clientHeight * devicePixelRatio;
}
resizeScope();
window.addEventListener("resize", resizeScope);

let scopeMouseInfluence = 0;
scopeCanvas.addEventListener("mousemove", (e) => {
  const rect = scopeCanvas.getBoundingClientRect();
  scopeMouseInfluence = (e.clientY - rect.top - rect.height/2) / (rect.height/2);
});
scopeCanvas.addEventListener("mouseleave", () => { scopeMouseInfluence = 0; });

let t0 = 0;
function drawScope(){
  const w = scopeCanvas.width, h = scopeCanvas.height;
  scopeCtx.clearRect(0,0,w,h);

  // grid
  scopeCtx.strokeStyle = "rgba(255,255,255,0.05)";
  scopeCtx.lineWidth = 1;
  for(let gx=0; gx<w; gx+=w/12){ scopeCtx.beginPath(); scopeCtx.moveTo(gx,0); scopeCtx.lineTo(gx,h); scopeCtx.stroke(); }
  for(let gy=0; gy<h; gy+=h/6){ scopeCtx.beginPath(); scopeCtx.moveTo(0,gy); scopeCtx.lineTo(w,gy); scopeCtx.stroke(); }

  // waveform
  scopeCtx.beginPath();
  const mid = h/2;
  for(let x=0; x<w; x++){
    const t = x/w * 4 * Math.PI + t0;
    const y = mid + Math.sin(t) * (h*0.16) * (1 + Math.abs(scopeMouseInfluence)) + Math.sin(t*2.7)*(h*0.05);
    if(x===0) scopeCtx.moveTo(x,y); else scopeCtx.lineTo(x,y);
  }
  scopeCtx.strokeStyle = "#49e8d4";
  scopeCtx.lineWidth = 2;
  scopeCtx.shadowColor = "#49e8d4";
  scopeCtx.shadowBlur = 10;
  scopeCtx.stroke();
  scopeCtx.shadowBlur = 0;

  t0 += reduceMotion ? 0 : 0.045;
  requestAnimationFrame(drawScope);
}
drawScope();

/* ============================================================
   GSAP SCROLL REVEALS
   ============================================================ */
function startPageAnimations(){
  if(typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".reveal").forEach((el, i) => {
    gsap.to(el, {
      opacity:1, y:0, duration:0.9, ease:"power3.out",
      scrollTrigger:{ trigger: el, start:"top 88%" }
    });
  });

  gsap.from("#hero .hero-kicker, #hero .hero-title, #hero .hero-role, #hero .hero-desc, #hero .hero-cta", {
    opacity:0, y:30, stagger:0.12, duration:1, ease:"power3.out", delay:0.1
  });
  gsap.from(".scope-wrap", { opacity:0, x:30, duration:1.1, ease:"power3.out", delay:0.3 });

  // parallax grid
  gsap.to(".neon-grid", {
    backgroundPosition: "0 200px",
    ease:"none",
    scrollTrigger:{ trigger: document.body, start:"top top", end:"bottom bottom", scrub:1 }
  });
}

/* ============================================================
   PROJECTS — live from GitHub, with graceful fallback
   ============================================================ */
const fallbackProjects = [
  { name:"Tennis-Club-Management", description:"Web platform built with Laravel to manage a tennis club end-to-end: memberships, courts, and administration.", language:"JavaScript", stars:1, category:"web", url:"https://github.com/MeriyamELHEFIANE/Tennis-Club-Management" },
  { name:"TP2_ML", description:"Machine learning lab exercise — model training and evaluation notebook.", language:"Jupyter Notebook", stars:1, category:"ml", url:"https://github.com/MeriyamELHEFIANE/Gestion-des-visiteurs"  },
  { name:"TP3_ML", description:"AI & machine learning lab work covering core ML algorithms.", language:"Jupyter Notebook", stars:1, category:"ml", url:"https://github.com/MeriyamELHEFIANE/TP3_ML" },
  { name:"TP5_ML", description:"AI & machine learning lab exercise, part of a semester-long ML coursework series.", language:"Jupyter Notebook", stars:1, category:"ml", url:"https://github.com/MeriyamELHEFIANE/TP5_ML" },
  { name:"Gestion-des-visiteurs", description:"Visitor management application for tracking check-ins and access.", language:"—", stars:0, category:"web", url:"https://github.com/MeriyamELHEFIANE/Gestion-des-visiteurs" }
];

function categoryFor(repo){
  const n = (repo.name + " " + (repo.description||"")).toLowerCase();
  if(n.includes("ml") || n.includes("machine") || n.includes("ai") || n.includes("learning")) return "ml";
  if(n.includes("esp") || n.includes("arduino") || n.includes("vhdl") || n.includes("embedded") || n.includes("iot")) return "embedded";
  return "web";
}

function renderProjects(list){
  const grid = document.getElementById("project-grid");
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.category = p.category;
    card.innerHTML = `
      <div class="glow-line"></div>
      <div class="tag">${p.category}</div>
      <h3>${p.name}</h3>
      <p>${p.description || "No description provided yet — see the repository for details."}</p>
      <div class="stack"><span>${p.language || "—"}</span><span>★ ${p.stars}</span></div>
      <div class="link-row"><a href="${p.url}" target="_blank" rel="noopener">View Repository ↗</a></div>
    `;
    grid.appendChild(card);
  });
}

renderProjects(fallbackProjects);

fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`)
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(data => {
    if(!Array.isArray(data)) return;
    const repos = data
      .filter(r => !r.fork)
      .map(r => ({
        name:r.name, description:r.description, language:r.language,
        stars:r.stargazers_count, url:r.html_url,
        category: categoryFor(r)
      }))
      .sort((a,b) => b.stars - a.stars)
      .slice(0, 9);
    if(repos.length){ renderProjects(repos); }
  })
  .catch(() => { /* keep fallback list — offline or rate-limited */ });

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".project-card").forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden-card", !show);
    });
  });
});

/* ============================================================
   TERMINAL — animated typing with live GitHub stats
   ============================================================ */
async function runTerminal(){
  const body = document.getElementById("terminal-body");
  let statLine = "fetch: unavailable (offline or rate-limited)";
  try{
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if(res.ok){
      const u = await res.json();
      statLine = `repos: ${u.public_repos}  |  followers: ${u.followers}  |  following: ${u.following}`;
      document.querySelectorAll('[data-stat="repos"]').forEach(el => el.textContent = u.public_repos);
      document.querySelectorAll('[data-stat="followers"]').forEach(el => el.textContent = u.followers);
    }
  }catch(e){ /* keep fallback text */ }

  const lines = [
    { p:"$ ", c:"whoami", out:"meriyam-el-hefiane — embedded systems & ai engineer" },
    { p:"$ ", c:`curl api.github.com/users/${GITHUB_USER}`, out: statLine },
    { p:"$ ", c:"cat skills.json | grep priority", out:"[\"embedded-systems\", \"machine-learning\", \"full-stack\"]" },
    { p:"$ ", c:"status --check", out:"// open to internships & graduate roles" }
  ];

  for(const line of lines){
    const row = document.createElement("div");
    body.appendChild(row);
    let text = "";
    const full = line.p + line.c;
    for(let i=0;i<full.length;i++){
      text += full[i];
      row.innerHTML = `<span class="prompt">${text}</span>`;
      await new Promise(r => setTimeout(r, reduceMotion ? 0 : 22));
    }
    await new Promise(r => setTimeout(r, 150));
    const outRow = document.createElement("div");
    outRow.className = "comment";
    outRow.textContent = line.out;
    body.appendChild(outRow);
    await new Promise(r => setTimeout(r, 250));
  }
  const cursorRow = document.createElement("div");
  cursorRow.innerHTML = `<span class="prompt">$ </span><span class="terminal-cursor"></span>`;
  body.appendChild(cursorRow);
}

const terminalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      runTerminal();
      terminalObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
terminalObserver.observe(document.getElementById("terminal-section"));

/* ============================================================
   VISITOR COUNTER — persisted via window.storage (shared)
   ============================================================ */
async function trackVisitor(){
  const el = document.getElementById("visitor-count");
  try{
    let record = await window.storage.get("visitor-count", true).catch(() => null);
    let count = record ? parseInt(record.value, 10) : 0;
    count += 1;
    await window.storage.set("visitor-count", String(count), true);
    el.textContent = count.toLocaleString();
  }catch(e){
    el.textContent = "—";
  }
}
if(window.storage){ trackVisitor(); } else {
  document.getElementById("visitor-count").textContent = "—";
}

/* ============================================================
   CONTACT FORM (front-end only — wire to a backend/service to send)
   ============================================================ */
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const original = btn.textContent;
  btn.textContent = "Message Queued ✓";
  setTimeout(() => { btn.textContent = original; e.target.reset(); }, 2200);
});