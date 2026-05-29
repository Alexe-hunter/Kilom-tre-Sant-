// mon système de routage pour mon app

const routes = {
    "/": {
        page: "pages/home.html",
        style: "Assets/Style/home.css",
        script: "Assets/Script/app/home.js",
        init: "initHome",
        title: "Home"
    },
    "/pharmacie": {
        page: "pages/pharmacie.html",
        style: "Assets/Style/pharmacie.css",
        script: "Assets/Script/app/pharmacie.js",
        init: "initPharmacie",
        title: "Pharmacie"
    },
    "/about": {
        page: "pages/about.html",
        style: "Assets/Style/about.css",
        script: "Assets/Script/app/about.js",
        init: "initAbout",
        title: "About"
    }
};  

/* pour eviter que mes js se charge encore*/ 
const jsLoaded = new Set();

/** pour le chargement et affichage de ma page
 * @param {string} hash 
 */

async function navigate(hash){
    const route = routes[hash] ? hash : "/";
    const config = routes[route];

try {

    const app = document.getElementById("app");
    app.innerHTML = "";

    const response = await fetch(config.page);
    if (!response.ok) throw new Error(`Page ${config.page} ...introuvable...`);

    const html = await response.text();
    app.innerHTML = html;

    app.classList.remove("page-enter");
    void app.offsetWidth;
    app.classList.add("page-enter");

    document.title = config.title;

    const tousLesstylepage = Object.values(routes).map(r => r.style).filter(Boolean);

    tousLesstylepage.forEach(stylefile => {
        const link = document.querySelector(`link[href="${stylefile}"]`);
        if (link) link.media = "none";
    });

    if (config.style) {
        const linkExistant = document.querySelector(`link[href="${config.style}"]`);
        if (linkExistant) {
            linkExistant.media = "all";
        } else {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = config.style;
            link.media = "all";
            document.head.appendChild(link);
        }
    }

    if (config.script && !jsLoaded.has(config.script)) {
        await loadScript(config.script);
        jsLoaded.add(config.script);    
    }

    if (config.init && typeof window[config.init] === "function") {
        requestAnimationFrame(() => {
            window[config.init]();
        });
    }

    updateActiveLink(route);

    window.scrollTo(0, 0);

}catch (error) {
    console.error("Eurreur lorrs du chargement de la page :", error);
    const app = document.getElementById("app");
    app.innerHTML = "<h1>Erreur de chargement de la page</h1><p>Veuillez réessayer plus tard.</p>";
}
}

/**
 * Charge mon js
 * @param {string} src - Le chemin vers le fichier JavaScript
 * @returns {Promise}
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Erreur de chargement du script ${src}`));
        document.body.appendChild(script);
    });
}

/**
 * Met à jour les liens de navigation pour refléter la page active
 * @param {string} route - La route actuellement active
 */
function updateActiveLink(route) {
    document.querySelectorAll("[data-route]").forEach(link => {
        link.classList.toggle("active", link.dataset.route === route);
    });
}


windows.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1) || "/";
    navigate(hash);
});

document.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1) || "/";
    navigate(hash);
});

window.showToast = function(message, type = "default") {
    const ancien = document.querySelector("g-toast");
    if (ancien) ancien.remove();

    const toast = document.createElement("div");
    toast.className = `g-toast ${type !== "default" ? "g-toast--" + type : ""}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout (() => { toast.remove(); }, 3000);
};