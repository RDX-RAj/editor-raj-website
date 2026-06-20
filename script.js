const API_KEY = "AIzaSyDfyMTMLaH29JalcWY4lnii7L0GiTZ5Sfo";
const CHANNEL_ID = "UCXBXbRGKFvyH83jjgCVD2gQ";

// ðŸ”¢ NUMBER FORMAT (SMART)
function formatNumber(num) {
  num = Number(num);

  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";

  return num;
}

// ðŸ“Š CHANNEL STATS
async function getStats() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await res.json();

    if (!data.items || !data.items.length) return;

    const stats = data.items[0].statistics;

    document.getElementById("subs").textContent = formatNumber(stats.subscriberCount);
    document.getElementById("views").textContent = formatNumber(stats.viewCount);
    document.getElementById("videos").textContent = formatNumber(stats.videoCount);

  } catch (e) {
    console.error("âŒ Stats error:", e);
  }
}

// ðŸŽ¯ TOP VIDEOS (SAFE + CLEAN)
const videoIds = ["mQGjBsBttLE","cnVmRi_q0l0","OmGzOoHEJbo"];

async function loadTopVideos() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(",")}&key=${API_KEY}`);
    const data = await res.json();

    if (!data.items) return;

    const videos = document.querySelectorAll(".videos .video");

    data.items.forEach((item, index) => {
      if (!videos[index]) return;

      const stats = item.statistics;

      const views = formatNumber(stats.viewCount);
      const likes = formatNumber(stats.likeCount);

      // duplicate avoid
      if (!videos[index].querySelector(".video-stats")) {
        videos[index].insertAdjacentHTML("beforeend", `
          <p class="video-stats">ðŸ‘ ${views} â€¢ â¤ï¸ ${likes}</p>
        `);
      }
    });

  } catch (e) {
    console.error("âŒ Top videos error:", e);
  }
}

// ðŸš€ LATEST VIDEOS (FIXED + CLEAN)
async function loadLatestVideos() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=6`);
    const data = await res.json();

    const container = document.getElementById("latestVideos");

    if (!container || !data.items) return;

    data.items.forEach(item => {
      if (item.id.videoId) {
        const videoHTML = `
          <div class="video">
            <iframe src="https://www.youtube.com/embed/${item.id.videoId}" allowfullscreen></iframe>
            <button class="like-btn">â¤ï¸</button>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", videoHTML);
      }
    });

    // LIKE BUTTON EVENTS (AFTER LOAD)
    document.querySelectorAll(".like-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("liked");
      });
    });

  } catch (e) {
    console.error("âŒ Latest error:", e);
  }
}

// ðŸŽ§ MUSIC CONTROL
function toggleMusic(){
  const music = document.getElementById("bgMusic");
  if (!music) return;

  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// ðŸŒ™ THEME TOGGLE (SAVE ALSO)
function toggleTheme(){
  document.body.classList.toggle("light");

  // save mode
  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

// ðŸ”¥ LOAD SAVED THEME
(function(){
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
  }
})();

// ðŸ”¥ LOADER FIX (PERFECT)
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 300); // smooth delay
});

// ðŸš€ RUN
getStats();
loadTopVideos();
loadLatestVideos();
