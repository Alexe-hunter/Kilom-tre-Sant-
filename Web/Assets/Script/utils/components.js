// cargeur des composants de mon app

async function loadComponent(id, file) {
    const response = await fetch(file);
    document.getElementById(id).innerHTML = await response.text();
}

//chargement de mes composants
window.addEventListener("load", () => {
    loadComponent("nav", "components/nav.html");
    loadComponent("footer", "components/footer.html");
});