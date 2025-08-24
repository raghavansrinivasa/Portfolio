// Scroll fade-in & floating icons
const sections = document.querySelectorAll("section");
const icons = document.querySelectorAll("#floating-icons .icon");

window.addEventListener("scroll", () => {
  sections.forEach((sec, index) => {
    const rect = sec.getBoundingClientRect();

    // Fade-in
    if(rect.top < window.innerHeight - 100) sec.classList.add("visible");

    // Floating icons active
    if(rect.top < window.innerHeight/2 && rect.bottom > window.innerHeight/4){
      icons.forEach(icon => icon.classList.remove("active"));
      if(icons[index]) icons[index].classList.add("active");
    }
  });
});

// Dark mode toggle
const toggleBtn = document.getElementById('darkModeToggle');
const html = document.documentElement;

toggleBtn.addEventListener('click', () => {
  html.classList.toggle('dark');
  toggleBtn.textContent = html.classList.contains('dark') ? '☀️' : '🌙';
});
