(function () {
  const STORAGE_KEY = "brian-lapido-cv-app-v2";
  const DATA_ENDPOINT = "/api/cv-data";
  const $profile = document.getElementById("public-profile");
  const $badges = document.getElementById("public-badges");
  const $sections = document.getElementById("public-sections");
  const $folderModal = document.getElementById("public-folder-modal");
  const $folderTitle = document.getElementById("public-folder-title");
  const $folderBody = document.getElementById("public-folder-body");
  let activeFolderId = "";

  function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10);
  }

  function esc(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function bullet(text) {
    return { id: uid("bullet"), text: text };
  }

  function entry(prefix, title, organization, period, location, details) {
    return {
      id: uid(prefix),
      title: title,
      organization: organization,
      period: period,
      location: location,
      details: details,
    };
  }

  function chip(label, detail) {
    return { id: uid("chip"), label: label, detail: detail };
  }

  function media() {
    return { id: uid("media"), label: "", type: "image", url: "", fileName: "" };
  }

  function specialty(name, focus, sector, gamerReference, description, characterImage) {
    return {
      id: uid("specialty"),
      name: name,
      focus: focus,
      sector: sector,
      gamerReference: gamerReference,
      characterImage: characterImage || "",
      description: description,
      media: [media()],
    };
  }

  function social(platform, handle, description, url) {
    return {
      id: uid("social"),
      platform: platform,
      handle: handle,
      description: description,
      url: url,
    };
  }

  const defaults = {
    theme: "professional",
    profile: {
      name: "Brian Ariel Lapido",
      role: "Estudiante de Desarrollo Full Stack | Tecnico en mantenimiento integral",
      email: "brianlapido9@gmail.com",
      phone: "+54 9 11 5797-9783",
      location: "Moreno, Buenos Aires, Argentina",
      availability: "Jornada completa",
      photo: "./img/perfil.png",
      photoScale: 1,
      photoX: 0,
      photoY: 0,
      summary:
        "Perfil con experiencia real en mantenimiento hospitalario, refrigeracion, electricidad y soldadura. Actualmente en formacion como desarrollador full stack, con enfoque en crecer hacia equipos de tecnologia, producto e inteligencia artificial aplicada.",
      objective:
        "Busco una oportunidad para desarrollarme como desarrollador junior o perfil tecnico hibrido, aportando compromiso, aprendizaje rapido y experiencia en resolucion de problemas complejos orientados a entornos digitales.",
    },
    sectionOrder: ["summary", "experience", "education", "skills", "languages", "specialties", "socials", "extras"],
    sections: {
      summary: { kind: "bullet-list", title: "Perfil profesional", description: "", items: [bullet("Responsable, comprometido y con fuerte sentido del compañerismo en entornos exigentes."), bullet("Capacidad para adaptarme rapido, aprender nuevas herramientas y sostener tareas tecnicas con constancia."), bullet("Interes en combinar experiencia tecnica de campo con una carrera orientada al desarrollo full stack, el codigo y la IA aplicada.")] },
      experience: { kind: "entry-list", title: "Experiencia laboral", description: "", items: [entry("experience", "Mantenimiento general", "Hospital Mariano y Luciano de la Vega", "Enero 2014 - Actualidad", "Moreno, Buenos Aires", "Responsable de tareas de mantenimiento general.\nPlomeria, electricidad y soldadura MIG, autogena y electrica.\nMantenimiento de motores trifasicos.\nCarga y transporte de tubos de oxigeno.\nCambio de tubos de CO2 en area de quirofano.")] },
      education: { kind: "entry-list", title: "Formacion y educacion", description: "", items: [entry("education", "Tecnico electromecanico", "E.E.S.T. N 2 - Moreno", "2008 - 2013", "Buenos Aires", "Secundario completo con formacion tecnica y base operativa integral."), entry("education", "Tecnico en refrigeracion", "Instituto educativo Eddis", "2023", "Buenos Aires", "Curso completo con certificado enfocado en instalacion, reparacion y diagnostico."), entry("education", "Desarrollo Web Full Stack", "Coderhouse", "2025 - En curso", "Modalidad online", "Primer curso de desarrollo web aprobado y especializacion de JavaScript en proceso.")] },
      skills: { kind: "chip-list", title: "Habilidades", description: "", items: [chip("Electricidad", "Instalaciones y mantenimiento general."), chip("Motores trifasicos", "Revision y mantenimiento preventivo."), chip("Refrigeracion", "Aires acondicionados y heladeras."), chip("Soldadura", "Electrica, MIG y autogena."), chip("Plomeria", "Intervenciones correctivas y soporte diario."), chip("Desarrollo web junior", "Base en HTML, CSS y JavaScript.")] },
      languages: { kind: "chip-list", title: "Idiomas", description: "", items: [chip("Español", "Nativo"), chip("Ingles", "Intermedio")] },
      specialties: { kind: "specialties", title: "Especialidades", description: "", items: [specialty("Desarrollo Full Stack", "Interfaces web, logica JavaScript y crecimiento hacia producto digital.", "Tecnologia / Producto", "Mega Man X", "Espacio pensado para mostrar proyectos, capturas y demos.", "https://res.cloudinary.com/dglpzels3/image/upload/v1774818978/latest_v38yuh.webp"), specialty("Mantenimiento tecnico integral", "Resolucion operativa en entornos criticos y soporte de infraestructura.", "Operaciones / Mantenimiento", "Metal Slug", "Ideal para documentar trabajos de mantenimiento hospitalario.", "https://res.cloudinary.com/dglpzels3/image/upload/v1774819079/latest_muphhf.webp"), specialty("Electricidad y motores trifasicos", "Diagnostico, mantenimiento y continuidad operativa.", "Industria / Energia", "DOOM Slayer", "Bloque destinado a tareas electricas y evidencia tecnica.", ""), specialty("Refrigeracion", "Instalacion, reparacion y mantenimiento de equipos.", "Servicios tecnicos", "Samus Aran", "Fotos, videos o procedimientos vinculados a aire acondicionado y heladeras.", "https://res.cloudinary.com/dglpzels3/image/upload/v1774819136/latest_hvbfga.webp"), specialty("Soldadura y construccion", "Trabajo estructural, ajustes y terminaciones.", "Obra / Taller", "Kratos", "Seccion para ordenar piezas, procesos y trabajos de taller.", ""), specialty("Diseño e impresion 3D", "Modelado, prototipado y produccion de piezas.", "Fabricacion / Creatividad", "Minecraft", "Renders, productos impresos y videos de prototipos.", "")] },
      socials: { kind: "socials", title: "Redes y contacto", description: "", items: [social("GitHub", "github.com/BrianLapido", "Repositorio y presencia tecnica.", "https://github.com/BrianLapido"), social("WhatsApp", "+54 9 11 5797-9783", "Canal directo de contacto.", "https://wa.me/5491157979783"), social("Email", "brianlapido9@gmail.com", "Via formal para propuestas laborales.", "mailto:brianlapido9@gmail.com"), social("Portfolio CV", "Repositorio del CV", "Version base publicada en GitHub.", "https://github.com/BrianLapido/cv")] },
      extras: { kind: "bullet-list", title: "Otros datos de interes", description: "", items: [bullet("Licencia de conducir: clases A.1.3 y B.1."), bullet("Disponibilidad para jornada completa y adaptacion a nuevos entornos."), bullet("Hobby actual: diseño e impresion 3D de productos personalizados.")] },
    },
  };

  async function load() {
    try {
      const response = await window.fetch(DATA_ENDPOINT, { cache: "no-store" });
      if (response.ok) {
        return normalize(await response.json());
      }
    } catch (error) {
      /* fallback below */
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? normalize(JSON.parse(saved)) : defaults;
    } catch (error) {
      return defaults;
    }
  }

  function normalize(raw) {
    const state = raw && typeof raw === "object" ? raw : {};
    const next = JSON.parse(JSON.stringify(defaults));
    next.theme = state.theme || next.theme;
    next.profile = Object.assign({}, next.profile, state.profile || {});
    next.profile.photo = next.profile.photo || "./img/perfil.png";
    next.profile.photoScale = Number(next.profile.photoScale || 1);
    next.profile.photoX = Number(next.profile.photoX || 0);
    next.profile.photoY = Number(next.profile.photoY || 0);

    if (state.sections && state.sections.specialties && Array.isArray(state.sections.specialties.items)) {
      next.sections.specialties.items = state.sections.specialties.items.map(function (item, index) {
        return Object.assign({}, next.sections.specialties.items[index] || specialty("", "", "", "", "", ""), item || {});
      });
    }

    if (state.sections) {
      Object.keys(next.sections).forEach(function (sectionId) {
        if (state.sections[sectionId]) {
          next.sections[sectionId] = Object.assign({}, next.sections[sectionId], state.sections[sectionId]);
          if (sectionId === "specialties") {
            next.sections[sectionId].items = next.sections.specialties.items;
          }
        }
      });
    }

    if (Array.isArray(state.sectionOrder)) {
      next.sectionOrder = state.sectionOrder.filter(function (sectionId) {
        return Boolean(next.sections[sectionId]);
      });
    }

    return next;
  }

  function externalUrl(value) {
    if (!value) {
      return "";
    }
    if (/^(data:|blob:|mailto:|tel:|https?:\/\/)/i.test(value)) {
      return value;
    }
    return "https://" + value.replace(/^\/+/, "");
  }

  function youtube(value) {
    const match = String(value || "").match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/i);
    return match ? "https://www.youtube.com/embed/" + match[1] : "";
  }

  function lines(text) {
    return String(text || "")
      .split("\n")
      .filter(Boolean)
      .map(function (line) {
        return "<li>" + esc(line.trim()) + "</li>";
      })
      .join("");
  }

  function renderMedia(item) {
    const safe = externalUrl(item.url);
    if (!safe) {
      return "";
    }
    if (item.type === "file") {
      return '<article class="media-card public-file-card"><p class="inline-note">' + esc(item.label || item.fileName || "Archivo") + '</p><p class="inline-note">Archivo adjunto dentro del portfolio.</p></article>';
    }
    if (item.type === "video") {
      return '<div class="media-preview is-placeholder"><p>' + esc(item.label || "Video agregado al portfolio") + "</p></div>";
    }
    return '<div class="media-preview"><img src="' + esc(safe) + '" alt="' + esc(item.label || "Imagen") + '" /></div>';
  }

  function renderFolderModal(state) {
    if (!$folderModal || !$folderBody || !$folderTitle) {
      return;
    }

    if (!activeFolderId) {
      $folderModal.classList.add("is-hidden");
      $folderBody.innerHTML = "";
      return;
    }

    const section = state.sections.specialties;
    const item = section.items.find(function (specialtyItem) {
      return specialtyItem.id === activeFolderId;
    });

    if (!item) {
      activeFolderId = "";
      $folderModal.classList.add("is-hidden");
      return;
    }

    $folderTitle.textContent = item.name;
    $folderBody.innerHTML = '<div class="media-grid">' + item.media.map(renderMedia).join("") + "</div>";
    $folderModal.classList.remove("is-hidden");
  }

  function renderSection(sectionId, state) {
    const section = state.sections[sectionId];
    if (!section) {
      return "";
    }

    if (section.kind === "entry-list") {
      return '<section class="section-card"><p class="panel-eyebrow">Seccion</p><h2>' + esc(section.title) + "</h2><div class=\"public-card-list\">" + section.items.map(function (item) {
        return '<article class="item-card public-card"><h3>' + esc(item.title) + '</h3><p class="public-meta">' + esc(item.organization) + " | " + esc(item.period) + '</p><p class="public-meta">' + esc(item.location) + '</p><ul class="public-list">' + lines(item.details) + "</ul></article>";
      }).join("") + "</div></section>";
    }

    if (section.kind === "chip-list") {
      return '<section class="section-card"><p class="panel-eyebrow">Seccion</p><h2>' + esc(section.title) + '</h2><div class="public-chip-list">' + section.items.map(function (item) {
        return '<article class="item-card public-chip-card"><strong>' + esc(item.label) + '</strong><p>' + esc(item.detail) + "</p></article>";
      }).join("") + "</div></section>";
    }

    if (section.kind === "specialties") {
      return '<section class="section-card"><p class="panel-eyebrow">Portfolio</p><h2>' + esc(section.title) + '</h2><div class="specialty-grid">' + section.items.map(function (item) {
        const mediaBlock = '<div class="folder-card"><div class="media-folder-head"><span class="folder-chip">Carpeta multimedia</span><span class="inline-note">' + esc(String(item.media.length)) + ' archivos</span></div><p class="inline-note">Portfolio compacto para mantener limpio el diseño publico.</p><div class="dual-actions"><button type="button" data-action="open-public-folder" data-specialty="' + esc(item.id) + '">Abrir carpeta</button></div></div>';
        const character = item.characterImage ? '<div class="specialty-art-side"><div class="character-frame"><img class="character-art" src="' + esc(item.characterImage) + '" alt="' + esc(item.gamerReference || item.name) + '" /></div></div>' : "";
        return '<article class="item-card public-specialty"><div class="specialty-layout"><div class="specialty-copy"><div class="specialty-badges"><span class="theme-chip">' + esc(state.theme === "gamer" ? item.gamerReference : item.focus || item.sector) + '</span><span class="meta-chip">' + esc(item.sector) + '</span></div><h3>' + esc(item.name) + '</h3><p>' + esc(item.description) + '</p></div>' + character + '</div>' + mediaBlock + "</article>";
      }).join("") + "</div></section>";
    }

    if (section.kind === "socials") {
      return '<section class="section-card"><p class="panel-eyebrow">Contacto</p><h2>' + esc(section.title) + '</h2><div class="social-grid">' + section.items.map(function (item) {
        const safe = externalUrl(item.url);
        return '<article class="social-link public-social-link"><strong>' + esc(item.platform) + '</strong><p>' + esc(item.description) + '</p><p class="public-meta">' + esc(item.handle) + '</p>' + (safe ? '<a class="link-button" href="' + esc(safe) + '" target="_blank" rel="noreferrer noopener">Abrir</a>' : "") + "</article>";
      }).join("") + "</div></section>";
    }

    return '<section class="section-card"><p class="panel-eyebrow">Seccion</p><h2>' + esc(section.title) + '</h2><ul class="public-list">' + section.items.map(function (item) {
      return "<li>" + esc(item.text) + "</li>";
    }).join("") + "</ul></section>";
  }

  async function render() {
    const state = await load();
    document.body.dataset.theme = state.theme || "professional";
    const photo = document.getElementById("public-photo");
    if (photo) {
      photo.src = state.profile.photo || "./img/perfil.png";
      photo.style.transform =
        "translate(" +
        Number(state.profile.photoX || 0) +
        "px, " +
        Number(state.profile.photoY || 0) +
        "px) scale(" +
        Number(state.profile.photoScale || 1) +
        ")";
    }
    $badges.innerHTML = [
      "<span>" + esc(state.profile.availability) + "</span>",
      "<span>" + esc(state.profile.location) + "</span>",
      "<span>" + esc(state.profile.role) + "</span>",
    ].join("");

    $profile.innerHTML = [
      "<h1>" + esc(state.profile.name) + "</h1>",
      "<h2 class=\"public-role\">" + esc(state.profile.role) + "</h2>",
      "<p class=\"public-copy\">" + esc(state.profile.summary) + "</p>",
      "<p class=\"public-copy\">" + esc(state.profile.objective) + "</p>",
      '<div class="dual-actions">' +
        '<a class="link-button" href="' + esc("mailto:" + state.profile.email) + '" target="_blank" rel="noreferrer noopener">Enviar email</a>' +
        '<a class="link-button" href="' + esc("https://wa.me/" + state.profile.phone.replace(/[^\d]/g, "")) + '" target="_blank" rel="noreferrer noopener">Abrir WhatsApp</a>' +
      "</div>",
    ].join("");

    $sections.innerHTML = state.sectionOrder.map(function (sectionId) {
      return renderSection(sectionId, state);
    }).join("");

    renderFolderModal(state);
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }

    if (button.dataset.action === "open-public-folder") {
      activeFolderId = button.dataset.specialty || "";
      render();
      return;
    }

    if (button.dataset.action === "close-public-folder") {
      activeFolderId = "";
      render();
    }
  });

  if ($folderModal) {
    $folderModal.addEventListener("click", function (event) {
      if (event.target === $folderModal) {
        activeFolderId = "";
        render();
      }
    });
  }

  window.addEventListener("storage", render);
  window.addEventListener("focus", render);
  window.setInterval(render, 15000);

  render();
})();
