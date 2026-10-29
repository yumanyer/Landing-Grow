const io = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  }),
  { threshold: 0.15 }
);

document.querySelectorAll('.rv').forEach(el => io.observe(el));
