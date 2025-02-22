document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    if (!link.dataset.prefetched) {
      const prefetch = document.createElement("link");
      prefetch.rel = "prefetch";
      prefetch.href = link.href;
      document.head.appendChild(prefetch);
      link.dataset.prefetched = "true"; // prevent duplicate prefetches
      console.log("prefetch", link.href);
    }
  });
});
