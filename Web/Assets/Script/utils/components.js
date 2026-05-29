/* mon système de chargement de composants*/

/**charge mon html et injecte ce dernier dans un elmnt du dom
 * @param {string} elementId
 * @param {string} filePath 
 * @returns {Promise}        
 */

async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);

    if (!response.ok) throw new Error(`Composant ${filePath} introuvable`);

    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;

  } catch (err) {
    console.error("loadComponent :", err.message);
  }
}


/* initialisation du menu burger apres chargmt des nav */
function initBurger() {
  const burger = document.getElementById("nav-burger");
  const links  = document.getElementById("nav-links");
  const icon   = document.getElementById("burger-icon");

  if (!burger || !links) return;

  burger.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    icon.textContent = isOpen ? "✕" : "☰";
    burger.setAttribute("aria-expanded", isOpen);
  });

  links.addEventListener("click", e => {
    if (e.target.closest("a")) {
      links.classList.remove("open");
      icon.textContent = "☰";
      burger.setAttribute("aria-expanded", false);
    }
  });
}



document.addEventListener("DOMContentLoaded", async () => {

  await Promise.all([
    loadComponent("nav",    "components/nav.html"),
    loadComponent("footer", "components/footer.html")
  ]);

  initBurger();
});
