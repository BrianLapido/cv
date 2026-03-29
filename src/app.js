(function () {
  const STORAGE_KEY = "brian-lapido-cv-app-v2";
  const DATA_ENDPOINT = "/api/cv-data";
  const PIN_KEY = "brian-lapido-admin-pin";
  const SESSION_KEY = "brian-lapido-admin-session";
  const $board = document.getElementById("cv-board");
  const $profile = document.getElementById("profile-fields");
  const $themes = Array.from(document.querySelectorAll("[data-theme-choice]"));
  const $auth = document.getElementById("admin-auth");
  const $authForm = document.getElementById("auth-form");
  const $authTitle = document.getElementById("auth-title");
  const $authCopy = document.getElementById("auth-copy");
  const $authLabel = document.getElementById("auth-label");
  const $authInput = document.getElementById("auth-input");
  const $authSubmit = document.getElementById("auth-submit");
  const $adminApp = document.getElementById("admin-app");
  const $adminPhoto = document.getElementById("admin-photo");
  const $specialtyUpload = document.getElementById("specialty-upload-input");
  const $profilePhotoInput = document.getElementById("profile-photo-input");
  const $folderModal = document.getElementById("admin-folder-modal");
  const $folderTitle = document.getElementById("admin-folder-title");
  const $folderBody = document.getElementById("admin-folder-body");
  const $saveStatus = document.getElementById("save-status");

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

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function find(items, id) {
    return items.find(function (item) {
      return item.id === id;
    });
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
      role: "Estudiante de Desarrollo Full Stack | Técnico en mantenimiento integral",
      email: "brianlapido9@gmail.com",
      phone: "+54 9 11 5797-9783",
      location: "Moreno, Buenos Aires, Argentina",
      availability: "Jornada completa",
      photo: "./img/perfil.png",
      photoScale: 1,
      photoX: 0,
      photoY: 0,
      summary:
        "Perfil con experiencia real en mantenimiento hospitalario, refrigeración, electricidad y soldadura. Actualmente en formación como desarrollador full stack, con enfoque en crecer hacia equipos de tecnología, producto e inteligencia artificial aplicada.",
      objective:
        "Busco una oportunidad para desarrollarme como desarrollador junior o perfil técnico híbrido, aportando compromiso, aprendizaje rápido y experiencia en resolución de problemas complejos orientados a entornos digitales.",
    },
    sectionOrder: ["summary", "experience", "education", "skills", "languages", "specialties", "socials", "extras"],
    sections: {
      summary: { kind: "bullet-list", title: "Perfil profesional", description: "Resumen editable de fortalezas, enfoque laboral y propuesta de valor.", items: [bullet("Responsable, comprometido y con fuerte sentido del compañerismo en entornos exigentes."), bullet("Capacidad para adaptarme rápido, aprender nuevas herramientas y sostener tareas técnicas con constancia."), bullet("Interés en combinar experiencia técnica de campo con una carrera orientada al desarrollo full stack, el código y la IA aplicada.")] },
      experience: { kind: "entry-list", title: "Experiencia laboral", description: "Bloques editables para experiencia profesional, proyectos o servicios.", items: [entry("experience", "Mantenimiento general", "Hospital Mariano y Luciano de la Vega", "Enero 2014 - Actualidad", "Moreno, Buenos Aires", "Responsable de tareas de mantenimiento general.\nPlomería, electricidad y soldadura MIG, autógena y eléctrica.\nMantenimiento de motores trifásicos.\nCarga y transporte de tubos de oxígeno.\nCambio de tubos de CO2 en área de quirófano.")] },
      education: { kind: "entry-list", title: "Formación y educación", description: "Espacio ideal para estudios, certificaciones, cursos y capacitaciones.", items: [entry("education", "Técnico electromecánico", "E.E.S.T. N°2 - Moreno", "2008 - 2013", "Buenos Aires", "Secundario completo con formación técnica y base operativa integral."), entry("education", "Técnico en refrigeración", "Instituto educativo Eddis", "2023", "Buenos Aires", "Curso completo con certificado enfocado en instalación, reparación y diagnóstico."), entry("education", "Desarrollo Web Full Stack", "Coderhouse", "2025 - En curso", "Modalidad online", "Primer curso de desarrollo web aprobado y especialización de JavaScript en proceso.")] },
      skills: { kind: "chip-list", title: "Habilidades", description: "Competencias técnicas y operativas que podés adaptar a cada búsqueda.", items: [chip("Electricidad", "Instalaciones, diagnóstico y mantenimiento general."), chip("Motores trifásicos", "Revisión y mantenimiento preventivo."), chip("Refrigeración", "Aires acondicionados, heladeras y resolución de fallas."), chip("Soldadura", "Eléctrica, MIG y autógena."), chip("Plomería", "Intervenciones correctivas y soporte diario."), chip("Desarrollo web junior", "Base en HTML, CSS, JavaScript y lógica de producto.")] },
      languages: { kind: "chip-list", title: "Idiomas", description: "Podés ajustar niveles y agregar certificaciones o herramientas.", items: [chip("Español", "Nativo"), chip("Inglés", "Intermedio")] },
      specialties: { kind: "specialties", title: "Especialidades y portfolio multimedia", description: "Cada bloque admite archivos, imagenes, videos y referencias adaptadas al estilo visual elegido.", items: [specialty("Desarrollo Full Stack", "Interfaces web, lógica JavaScript y crecimiento hacia producto digital.", "Tecnología / Producto", "Mega Man X", "Espacio pensado para mostrar proyectos, capturas, demos y avances de estudio.", "https://res.cloudinary.com/dglpzels3/image/upload/v1774818978/latest_v38yuh.webp"), specialty("Mantenimiento técnico integral", "Resolución operativa en entornos críticos y soporte de infraestructura.", "Operaciones / Mantenimiento", "Metal Slug", "Ideal para documentar trabajos de mantenimiento hospitalario e infraestructura.", "https://res.cloudinary.com/dglpzels3/image/upload/v1774819079/latest_muphhf.webp"), specialty("Electricidad y motores trifásicos", "Diagnóstico, mantenimiento y continuidad operativa.", "Industria / Energía", "DOOM Slayer", "Bloque destinado a tareas eléctricas, tableros, motores y evidencia técnica.", ""), specialty("Refrigeración", "Instalación, reparación y mantenimiento de equipos.", "Servicios técnicos", "Samus Aran", "Acá podés subir fotos, videos o procedimientos vinculados a aire acondicionado y heladeras.", "https://res.cloudinary.com/dglpzels3/image/upload/v1774819136/latest_hvbfga.webp"), specialty("Soldadura y construcción", "Trabajo estructural, ajustes, refuerzos y terminaciones.", "Obra / Taller", "Kratos", "Pensado para ordenar piezas, procesos y trabajos fabricados en taller.", ""), specialty("Diseño e impresión 3D", "Modelado, prototipado y producción de piezas.", "Fabricación / Creatividad", "Minecraft", "Sección para mostrar renders, productos impresos y videos de prototipos.", "")] },
      socials: { kind: "socials", title: "Redes y contacto", description: "Cada red incluye descripción, enlace editable y acceso directo.", items: [social("GitHub", "github.com/BrianLapido", "Repositorio y presencia técnica para compartir proyectos y código.", "https://github.com/BrianLapido"), social("WhatsApp", "+54 9 11 5797-9783", "Canal directo para contacto rápido, entrevistas o coordinación laboral.", "https://wa.me/5491157979783"), social("Email", "brianlapido9@gmail.com", "Vía formal para propuestas, contactos profesionales y envío de información.", "mailto:brianlapido9@gmail.com"), social("Portfolio CV", "Repositorio del CV", "Acceso a la versión base publicada en GitHub para usar como respaldo o portfolio.", "https://github.com/BrianLapido/cv")] },
      extras: { kind: "bullet-list", title: "Otros datos de interés", description: "Información complementaria útil para búsquedas laborales o presentaciones.", items: [bullet("Licencia de conducir: clases A.1.3 y B.1."), bullet("Disponibilidad para jornada completa y adaptación a nuevos entornos."), bullet("Hobby actual: diseño e impresión 3D de productos personalizados.")] },
    },
  };

  function normalizeMedia(item) {
    return Object.assign(media(), item || {}, {
      id: item && item.id ? item.id : uid("media"),
      label: item && item.label ? item.label : item && item.fileName ? item.fileName : "",
      type: item && item.type ? item.type : "image",
      url: item && item.url ? item.url : "",
      fileName: item && item.fileName ? item.fileName : "",
    });
  }

  function normalizeSpecialty(item, fallback) {
    const safe = Object.assign({}, fallback || specialty("", "", "", "", "", ""), item || {});
    safe.id = safe.id || uid("specialty");
    safe.characterImage = safe.characterImage || (fallback && fallback.characterImage) || "";
    safe.media = Array.isArray(item && item.media) && item.media.length
      ? item.media.map(normalizeMedia)
      : clone((fallback && fallback.media) || [media()]);
    return safe;
  }

  function normalizeSectionItem(sectionId, item, fallback) {
    if (sectionId === "specialties") {
      return normalizeSpecialty(item, fallback);
    }
    if (sectionId === "socials") {
      return Object.assign({}, fallback || social("", "", "", ""), item || {}, {
        id: item && item.id ? item.id : uid("social"),
      });
    }
    if (sectionId === "experience" || sectionId === "education") {
      return Object.assign({}, fallback || entry(sectionId, "", "", "", "", ""), item || {}, {
        id: item && item.id ? item.id : uid(sectionId),
      });
    }
    if (sectionId === "skills" || sectionId === "languages") {
      return Object.assign({}, fallback || chip("", ""), item || {}, {
        id: item && item.id ? item.id : uid("chip"),
      });
    }
    return Object.assign({}, fallback || bullet(""), item || {}, {
      id: item && item.id ? item.id : uid("bullet"),
    });
  }

  function normalizeState(raw) {
    const next = clone(defaults);
    const input = raw && typeof raw === "object" ? raw : {};

    next.theme = input.theme || next.theme;
    next.profile = Object.assign({}, next.profile, input.profile || {});
    next.profile.photo = next.profile.photo || "./img/perfil.png";
    next.profile.photoScale = Number(next.profile.photoScale || 1);
    next.profile.photoX = Number(next.profile.photoX || 0);
    next.profile.photoY = Number(next.profile.photoY || 0);

    if (Array.isArray(input.sectionOrder)) {
      next.sectionOrder = input.sectionOrder.filter(function (sectionId) {
        return Boolean(next.sections[sectionId]);
      });
    }

    Object.keys(next.sections).forEach(function (sectionId) {
      const incoming = input.sections && input.sections[sectionId];
      if (!incoming) {
        return;
      }

      next.sections[sectionId].title = incoming.title || next.sections[sectionId].title;
      next.sections[sectionId].description =
        incoming.description || next.sections[sectionId].description;

      if (Array.isArray(incoming.items)) {
        next.sections[sectionId].items = incoming.items.map(function (item, index) {
          return normalizeSectionItem(
            sectionId,
            item,
            defaults.sections[sectionId].items[index]
          );
        });
      }
    });

    return next;
  }

  function load() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? normalizeState(JSON.parse(saved)) : clone(defaults);
    } catch (error) {
      return clone(defaults);
    }
  }

  function save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if ($saveStatus) {
      $saveStatus.textContent =
        "Borrador local actualizado. Presiona Guardar cambios para impactar el deployment.";
    }
  }

  function setSaveStatus(message) {
    if ($saveStatus) {
      $saveStatus.textContent = message;
    }
  }

  async function loadDeploymentState() {
    try {
      const response = await window.fetch(DATA_ENDPOINT, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("No se pudo leer el deployment");
      }
      const remote = await response.json();
      state = normalizeState(remote);
      save();
      setSaveStatus("Contenido cargado desde la version publicada del deployment.");
      return true;
    } catch (error) {
      return false;
    }
  }

  async function saveDeploymentState() {
    setSaveStatus("Guardando cambios en el deployment...");

    try {
      const response = await window.fetch(DATA_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error("No se pudieron guardar los cambios");
      }

      setSaveStatus("Cambios guardados en deployment correctamente.");
    } catch (error) {
      setSaveStatus("No se pudieron guardar los cambios en deployment.");
      window.alert("Fallo el guardado del deployment. Revisa si el servidor permite escritura.");
    }
  }

  function url(value) {
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

  let state = load();
  let drag = null;
  let authMode = "login";
  let pendingSpecialtyId = "";
  let activeFolderId = "";

  function hasPin() {
    return Boolean(window.localStorage.getItem(PIN_KEY));
  }

  function isUnlocked() {
    return window.sessionStorage.getItem(SESSION_KEY) === "open";
  }

  function setUnlocked(value) {
    if (value) {
      window.sessionStorage.setItem(SESSION_KEY, "open");
    } else {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  }

  function toHash(text) {
    return window.crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(text))
      .then(function (buffer) {
        return Array.from(new Uint8Array(buffer))
          .map(function (byte) {
            return byte.toString(16).padStart(2, "0");
          })
          .join("");
      });
  }

  function setAuthMode(mode) {
    authMode = mode;
    if (!$auth) {
      return;
    }

    if (mode === "setup") {
      $authTitle.textContent = "Crear PIN administrador";
      $authCopy.textContent =
        "Esta es una proteccion local para tu ruta admin. Crea un PIN personal para habilitar el panel.";
      $authLabel.textContent = "Nuevo PIN";
      $authSubmit.textContent = "Guardar PIN";
      $authInput.value = "";
      return;
    }

    $authTitle.textContent = "Acceso administrador";
    $authCopy.textContent =
      "Ingresa tu PIN para abrir el panel privado de edicion del CV.";
    $authLabel.textContent = "PIN de administrador";
    $authSubmit.textContent = "Ingresar";
    $authInput.value = "";
  }

  async function showAdmin() {
    if ($auth) {
      $auth.classList.add("is-hidden");
    }
    if ($adminApp) {
      $adminApp.classList.remove("is-hidden");
    }
    await loadDeploymentState();
    renderApp();
    ensureTransparentProfilePhoto();
    setSaveStatus("Contenido cargado desde la version publicada del deployment.");
  }

  async function unlockAdmin(pin) {
    const cleanPin = String(pin || "").trim();
    if (!cleanPin) {
      window.alert("Ingresa un PIN valido.");
      return;
    }

    if (authMode === "setup") {
      const hash = await toHash(cleanPin);
      window.localStorage.setItem(PIN_KEY, hash);
      setUnlocked(true);
      await showAdmin();
      return;
    }

    const expected = window.localStorage.getItem(PIN_KEY);
    const actual = await toHash(cleanPin);

    if (actual !== expected) {
      window.alert("PIN incorrecto.");
      return;
    }

    setUnlocked(true);
    await showAdmin();
  }

  function logoutAdmin() {
    setUnlocked(false);
    if ($adminApp) {
      $adminApp.classList.add("is-hidden");
    }
    if ($auth) {
      $auth.classList.remove("is-hidden");
    }
    setAuthMode(hasPin() ? "login" : "setup");
  }

  async function bootAdmin() {
    if (!$auth || !$adminApp) {
      renderApp();
      return;
    }

    if (!hasPin()) {
      $adminApp.classList.add("is-hidden");
      $auth.classList.remove("is-hidden");
      setAuthMode("setup");
      return;
    }

    if (!isUnlocked()) {
      $adminApp.classList.add("is-hidden");
      $auth.classList.remove("is-hidden");
      setAuthMode("login");
      return;
    }

    await showAdmin();
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function transparentImage(source) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = function () {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);

        for (let index = 0; index < pixels.data.length; index += 4) {
          const red = pixels.data[index];
          const green = pixels.data[index + 1];
          const blue = pixels.data[index + 2];
          const isLight = red > 235 && green > 235 && blue > 235;

          if (isLight) {
            pixels.data[index + 3] = 0;
          }
        }

        context.putImageData(pixels, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      image.onerror = reject;
      image.src = source;
    });
  }

  async function ensureTransparentProfilePhoto() {
    if (!state.profile.photo || state.profile.photoTransparent) {
      return;
    }

    try {
      state.profile.photo = await transparentImage(state.profile.photo);
      state.profile.photoTransparent = true;
      save();
      applyProfilePhoto();
    } catch (error) {
      /* ignore photo cleanup failure */
    }
  }

  async function handleProfilePhotoUpload(file) {
    if (!file) {
      return;
    }

    const raw = await readFileAsDataUrl(file);
    state.profile.photo = await transparentImage(raw);
    state.profile.photoTransparent = true;
    state.profile.photoScale = 1;
    state.profile.photoX = 0;
    state.profile.photoY = 0;
    renderApp();
  }

  async function handleSpecialtyFiles(files) {
    const specialtyItem = find(state.sections.specialties.items, pendingSpecialtyId);
    if (!specialtyItem || !files.length) {
      return;
    }

    const uploaded = [];
    for (const file of Array.from(files)) {
      const dataUrl = await readFileAsDataUrl(file);
      uploaded.push({
        id: uid("media"),
        label: file.name,
        fileName: file.name,
        type: file.type.indexOf("video/") === 0 ? "video" : file.type.indexOf("image/") === 0 ? "image" : "file",
        url: dataUrl,
      });
    }

    specialtyItem.media = specialtyItem.media
      .filter(function (item) {
        return item.url || item.label || item.fileName;
      })
      .concat(uploaded);

    pendingSpecialtyId = "";
    renderApp();
  }

  function field(label, kind, attrs, value, tag, className) {
    const base = ' data-input-kind="' + esc(kind) + '"';
    const extra = Object.keys(attrs || {}).map(function (key) {
      return " data-" + key + '="' + esc(attrs[key]) + '"';
    }).join("");
    if (tag === "textarea") {
      return '<div class="field-stack"><label>' + esc(label) + "</label><textarea" + base + extra + ">" + esc(value) + "</textarea></div>";
    }
    if (tag === "select") {
      return '<div class="field-stack"><label>' + esc(label) + "</label><select" + base + extra + ">" + value + "</select></div>";
    }
    return '<div class="field-stack"><label>' + esc(label) + '</label><input class="' + esc(className || "") + '"' + base + extra + ' value="' + esc(value) + '" /></div>';
  }

  function bar(sectionId, itemId) {
    return '<div class="card-toolbar"><div class="section-actions"><span class="drag-pill">mover</span></div><div class="card-actions"><button type="button" data-action="delete-item" data-section="' + esc(sectionId) + '" data-id="' + esc(itemId) + '">Eliminar</button></div></div>';
  }

  function addText(kind) {
    return { "bullet-list": "Agregar punto", "entry-list": "Agregar bloque", "chip-list": "Agregar item", specialties: "Agregar especialidad", socials: "Agregar red" }[kind];
  }

  function themeBadge(item) {
    if (state.theme === "gamer") {
      return item.gamerReference || "Elegí una referencia arcade";
    }
    if (state.theme === "professional") {
      return item.focus || "Especialidad editable";
    }
    if (state.theme === "informatica") {
      return "Sector adaptable";
    }
    return "Especialidad destacada";
  }

  function preview(item) {
    const safe = url(item.url);
    if (!safe) {
      return '<div class="media-preview is-placeholder"><p>Sumá una URL de imagen o video para construir tu portfolio visual.</p></div>';
    }
    if (item.type === "file") {
      return '<div class="media-preview is-placeholder"><p>Archivo listo para abrir o descargar.</p></div>';
    }
    if (item.type === "video") {
      const embed = youtube(safe);
      if (embed) {
        return '<div class="media-preview"><iframe src="' + esc(embed) + '" title="' + esc(item.label || "Video") + '" loading="lazy" allowfullscreen></iframe></div>';
      }
      return '<div class="media-preview"><video controls preload="metadata" src="' + esc(safe) + '"></video></div>';
    }
    return '<div class="media-preview"><img src="' + esc(safe) + '" alt="' + esc(item.label || "Imagen") + '" /></div>';
  }

  function rangeField(label, fieldName, value, min, max, step) {
    return '<div class="field-stack"><label>' + esc(label) + '</label><input type="range" min="' + esc(min) + '" max="' + esc(max) + '" step="' + esc(step) + '" data-input-kind="profile" data-field="' + esc(fieldName) + '" value="' + esc(value) + '" /></div>';
  }

  function applyProfilePhoto() {
    if (!$adminPhoto) {
      return;
    }

    $adminPhoto.src = state.profile.photo || "./img/perfil.png";
    $adminPhoto.style.transform =
      "translate(" +
      Number(state.profile.photoX || 0) +
      "px, " +
      Number(state.profile.photoY || 0) +
      "px) scale(" +
      Number(state.profile.photoScale || 1) +
      ")";
  }

  function renderProfile() {
    $profile.innerHTML = [
      field("Nombre completo", "profile", { field: "name" }, state.profile.name, "input", "profile-name-input"),
      field("Título profesional", "profile", { field: "role" }, state.profile.role, "input", "profile-role-input"),
      '<div class="profile-grid">',
      field("Email", "profile", { field: "email" }, state.profile.email),
      field("Teléfono", "profile", { field: "phone" }, state.profile.phone),
      field("Ubicación", "profile", { field: "location" }, state.profile.location),
      field("Disponibilidad", "profile", { field: "availability" }, state.profile.availability),
      "</div>",
      field("Resumen profesional", "profile", { field: "summary" }, state.profile.summary, "textarea"),
      field("Objetivo laboral", "profile", { field: "objective" }, state.profile.objective, "textarea"),
      '<div class="section-card photo-panel"><div class="panel-heading"><div><p class="panel-eyebrow">Foto de perfil</p><h2>Ajuste visual</h2></div></div><div class="dual-actions"><button type="button" data-action="change-profile-photo">Cambiar foto</button><button type="button" data-action="reset-profile-photo" class="ghost-button">Restaurar encuadre</button></div><div class="profile-grid">' +
        rangeField("Zoom", "photoScale", state.profile.photoScale, 0.8, 2.4, 0.05) +
        rangeField("Mover horizontal", "photoX", state.profile.photoX, -180, 180, 1) +
        rangeField("Mover vertical", "photoY", state.profile.photoY, -180, 180, 1) +
      "</div><p class=\"inline-note\">Al subir una nueva foto se limpia el fondo blanco para integrarlo mejor con cada estilo.</p></div>",
      '<div class="dual-actions"><a href="' + esc("mailto:" + state.profile.email) + '" target="_blank" rel="noreferrer noopener">Enviar email</a><a href="' + esc("https://wa.me/" + state.profile.phone.replace(/[^\d]/g, "")) + '" target="_blank" rel="noreferrer noopener">Abrir WhatsApp</a></div>',
    ].join("");

    applyProfilePhoto();
  }

  function renderEntry(sectionId, item) {
    return '<article class="item-card" draggable="true" data-scope="' + esc(sectionId + "-items") + '" data-id="' + esc(item.id) + '">' + bar(sectionId, item.id) + '<div class="meta-grid">' + field("Título", "section-item", { section: sectionId, id: item.id, field: "title" }, item.title) + field("Organización", "section-item", { section: sectionId, id: item.id, field: "organization" }, item.organization) + field("Período", "section-item", { section: sectionId, id: item.id, field: "period" }, item.period) + field("Ubicación", "section-item", { section: sectionId, id: item.id, field: "location" }, item.location) + '</div>' + field("Detalle (una idea por línea)", "section-item", { section: sectionId, id: item.id, field: "details" }, item.details, "textarea") + "</article>";
  }

  function renderChip(sectionId, item) {
    return '<article class="item-card" draggable="true" data-scope="' + esc(sectionId + "-items") + '" data-id="' + esc(item.id) + '">' + bar(sectionId, item.id) + '<div class="meta-grid">' + field("Nombre", "section-item", { section: sectionId, id: item.id, field: "label" }, item.label) + field("Detalle", "section-item", { section: sectionId, id: item.id, field: "detail" }, item.detail) + "</div></article>";
  }

  function renderBullet(sectionId, item) {
    return '<article class="item-card" draggable="true" data-scope="' + esc(sectionId + "-items") + '" data-id="' + esc(item.id) + '">' + bar(sectionId, item.id) + field("Contenido", "section-item", { section: sectionId, id: item.id, field: "text" }, item.text, "textarea") + "</article>";
  }

  function renderMedia(specialtyId, item) {
    const options = '<option value="image"' + (item.type === "image" ? " selected" : "") + '>Imagen</option><option value="video"' + (item.type === "video" ? " selected" : "") + '>Video</option><option value="file"' + (item.type === "file" ? " selected" : "") + ">Archivo</option>";
    const download =
      item.url
        ? '<a class="link-button" href="' + esc(url(item.url)) + '" target="_blank" rel="noreferrer noopener">Abrir archivo</a>'
        : "";
    return '<article class="media-card" draggable="true" data-scope="media-' + esc(specialtyId) + '" data-id="' + esc(item.id) + '"><div class="card-toolbar"><div class="section-actions"><span class="drag-pill">mover</span><span class="meta-chip">' + esc(item.type === "video" ? "Video" : item.type === "file" ? "Archivo" : "Imagen") + '</span></div><div class="card-actions"><button type="button" data-action="delete-media" data-specialty="' + esc(specialtyId) + '" data-id="' + esc(item.id) + '">Eliminar</button></div></div><div class="meta-grid">' + field("Título", "media", { specialty: specialtyId, id: item.id, field: "label" }, item.label || item.fileName) + field("Tipo", "media", { specialty: specialtyId, id: item.id, field: "type" }, options, "select") + '</div>' + field("URL de imagen, video o archivo", "media", { specialty: specialtyId, id: item.id, field: "url" }, item.url) + download + preview(item) + "</article>";
  }

  function characterFigure(item) {
    if (!item.characterImage) {
      return '<span class="theme-chip">' + esc(themeBadge(item)) + "</span>";
    }

    return '<div class="character-frame"><img class="character-art" src="' + esc(item.characterImage) + '" alt="' + esc(item.gamerReference || item.name) + '" /></div>';
  }

  function mediaCollection(item) {
    const total = item.media.filter(function (mediaItem) {
      return mediaItem.url || mediaItem.label || mediaItem.fileName;
    }).length;

    return '<div class="folder-card"><div class="media-folder-head"><span class="folder-chip">Carpeta multimedia</span><span class="inline-note">' + esc(String(total)) + ' archivos en esta especialidad</span></div><p class="inline-note">Los archivos quedan agrupados para no romper el estilo de la pagina.</p><div class="dual-actions"><button type="button" data-action="open-folder-modal" data-specialty="' + esc(item.id) + '">Abrir carpeta</button><button type="button" data-action="upload-specialty-files" data-specialty="' + esc(item.id) + '">Subir archivos</button></div></div>';
  }

  function renderFolderModal() {
    if (!$folderModal || !$folderBody || !$folderTitle) {
      return;
    }

    if (!activeFolderId) {
      $folderModal.classList.add("is-hidden");
      $folderBody.innerHTML = "";
      return;
    }

    const item = find(state.sections.specialties.items, activeFolderId);
    if (!item) {
      activeFolderId = "";
      $folderModal.classList.add("is-hidden");
      return;
    }

    $folderTitle.textContent = item.name;
    $folderBody.innerHTML = '<div class="media-grid">' + item.media.map(function (mediaItem) {
      return renderMedia(item.id, mediaItem);
    }).join("") + "</div>";
    $folderModal.classList.remove("is-hidden");
  }

  function renderSpecialty(item) {
    return '<article class="item-card" draggable="true" data-scope="specialties-items" data-id="' + esc(item.id) + '"><div class="specialty-header"><div class="specialty-badges"><span class="drag-pill">mover</span><span class="meta-chip">' + esc(item.sector || "Sector editable") + '</span></div><div class="card-actions"><button type="button" data-action="upload-specialty-files" data-specialty="' + esc(item.id) + '">Subir archivos</button><button type="button" data-action="add-media" data-specialty="' + esc(item.id) + '">Agregar media</button><button type="button" data-action="delete-item" data-section="specialties" data-id="' + esc(item.id) + '">Eliminar</button></div></div><div class="specialty-layout"><div class="specialty-copy"><div class="specialty-badges"><span class="theme-chip">' + esc(themeBadge(item)) + '</span></div><div class="meta-grid">' + field("Especialidad", "specialty", { id: item.id, field: "name" }, item.name) + field("Enfoque", "specialty", { id: item.id, field: "focus" }, item.focus) + field("Sector", "specialty", { id: item.id, field: "sector" }, item.sector) + field("Referencia gamer", "specialty", { id: item.id, field: "gamerReference" }, item.gamerReference) + '</div>' + field("Imagen del personaje", "specialty", { id: item.id, field: "characterImage" }, item.characterImage) + field("Descripción", "specialty", { id: item.id, field: "description" }, item.description, "textarea") + '</div>' + (item.characterImage ? '<div class="specialty-art-side">' + characterFigure(item) + "</div>" : "") + "</div>" + mediaCollection(item) + "</article>";
  }

  function renderSocial(item) {
    const safe = url(item.url);
    return '<article class="social-link" draggable="true" data-scope="socials-items" data-id="' + esc(item.id) + '">' + bar("socials", item.id) + '<div class="meta-grid">' + field("Red", "social", { id: item.id, field: "platform" }, item.platform) + field("Usuario / referencia", "social", { id: item.id, field: "handle" }, item.handle) + field("Enlace", "social", { id: item.id, field: "url" }, item.url) + field("Descripción", "social", { id: item.id, field: "description" }, item.description) + '</div>' + (safe ? '<a href="' + esc(safe) + '" target="_blank" rel="noreferrer noopener">' + esc(safe) + "</a>" : '<p class="inline-note">Completá la URL para activar el enlace directo.</p>') + "</article>";
  }

  function renderSection(sectionId) {
    const section = state.sections[sectionId];
    let body = "";
    if (section.kind === "entry-list") {
      body = section.items.map(function (item) { return renderEntry(sectionId, item); }).join("");
    } else if (section.kind === "chip-list") {
      body = section.items.map(function (item) { return renderChip(sectionId, item); }).join("");
    } else if (section.kind === "specialties") {
      body = section.items.map(renderSpecialty).join("");
    } else if (section.kind === "socials") {
      body = section.items.map(renderSocial).join("");
    } else {
      body = section.items.map(function (item) { return renderBullet(sectionId, item); }).join("");
    }
    return '<section class="section-card" draggable="true" data-scope="section-order" data-id="' + esc(sectionId) + '"><div class="section-header"><div class="section-actions"><span class="drag-pill">mover</span><input class="section-title-input" data-input-kind="section-meta" data-section="' + esc(sectionId) + '" data-field="title" value="' + esc(section.title) + '" /></div><div class="section-actions"><button type="button" data-action="add-item" data-section="' + esc(sectionId) + '">' + addText(section.kind) + '</button></div></div><p class="section-description">' + esc(section.description) + '</p><div class="' + (section.kind === "specialties" ? "specialty-grid" : section.kind === "socials" ? "social-grid" : "item-grid") + '">' + body + "</div></section>";
  }

  function renderApp() {
    document.body.dataset.theme = state.theme;
    $themes.forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.themeChoice === state.theme);
    });
    renderProfile();
    $board.innerHTML = state.sectionOrder.map(renderSection).join("");
    renderFolderModal();
    save();
  }

  function addItem(sectionId) {
    if (sectionId === "specialties") {
      state.sections.specialties.items.push(specialty("Nueva especialidad", "", "", "", ""));
    } else if (sectionId === "socials") {
      state.sections.socials.items.push(social("Nueva red", "", "", ""));
    } else if (sectionId === "experience" || sectionId === "education") {
      state.sections[sectionId].items.push(entry(sectionId, "Nuevo bloque", "", "", "", ""));
    } else if (sectionId === "skills" || sectionId === "languages") {
      state.sections[sectionId].items.push(chip("Nuevo item", ""));
    } else {
      state.sections[sectionId].items.push(bullet("Nuevo contenido"));
    }
    renderApp();
  }

  function dropTargets() {
    document.querySelectorAll(".is-drop-target").forEach(function (element) {
      element.classList.remove("is-drop-target");
    });
  }

  function scopeTarget(start, scope) {
    let node = start;
    while (node && node !== document.body) {
      if (node.dataset && node.dataset.scope === scope) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function move(list, fromId, toId, useId) {
    const copy = list.slice();
    const fromIndex = copy.findIndex(function (item) { return (useId ? item.id : item) === fromId; });
    const toIndex = copy.findIndex(function (item) { return (useId ? item.id : item) === toId; });
    if (fromIndex === -1 || toIndex === -1) {
      return copy;
    }
    const current = copy.splice(fromIndex, 1)[0];
    copy.splice(toIndex, 0, current);
    return copy;
  }

  function reorder(scope, fromId, toId) {
    if (fromId === toId) {
      return;
    }
    if (scope === "section-order") {
      state.sectionOrder = move(state.sectionOrder, fromId, toId, false);
      return;
    }
    if (scope === "specialties-items") {
      state.sections.specialties.items = move(state.sections.specialties.items, fromId, toId, true);
      return;
    }
    if (scope === "socials-items") {
      state.sections.socials.items = move(state.sections.socials.items, fromId, toId, true);
      return;
    }
    if (scope.indexOf("media-") === 0) {
      const item = find(state.sections.specialties.items, scope.replace("media-", ""));
      if (item) {
        item.media = move(item.media, fromId, toId, true);
      }
      return;
    }
    const sectionId = scope.replace("-items", "");
    state.sections[sectionId].items = move(state.sections[sectionId].items, fromId, toId, true);
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }
    const action = button.dataset.action;
    if (action === "set-theme") {
      state.theme = button.dataset.themeChoice;
      renderApp();
      return;
    }
    if (action === "save-deployment") {
      saveDeploymentState();
      return;
    }
    if (action === "logout-admin") {
      logoutAdmin();
      return;
    }
    if (action === "change-profile-photo") {
      if ($profilePhotoInput) {
        $profilePhotoInput.click();
      }
      return;
    }
    if (action === "reset-profile-photo") {
      state.profile.photoScale = 1;
      state.profile.photoX = 0;
      state.profile.photoY = 0;
      renderApp();
      return;
    }
    if (action === "restore-default") {
      state = clone(defaults);
      renderApp();
      ensureTransparentProfilePhoto();
      return;
    }
    if (action === "export-json") {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = "cv-app-backup.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      return;
    }
    if (action === "quick-add" || action === "add-item") {
      addItem(button.dataset.target || button.dataset.section);
      return;
    }
    if (action === "open-folder-modal") {
      activeFolderId = button.dataset.specialty || "";
      renderFolderModal();
      return;
    }
    if (action === "close-folder-modal") {
      activeFolderId = "";
      renderFolderModal();
      return;
    }
    if (action === "delete-item") {
      state.sections[button.dataset.section].items = state.sections[button.dataset.section].items.filter(function (item) { return item.id !== button.dataset.id; });
      renderApp();
      return;
    }
    if (action === "add-media") {
      const item = find(state.sections.specialties.items, button.dataset.specialty);
      if (item) {
        item.media.push(media());
        renderApp();
      }
      return;
    }
    if (action === "upload-specialty-files") {
      pendingSpecialtyId = button.dataset.specialty || "";
      if ($specialtyUpload) {
        $specialtyUpload.value = "";
        $specialtyUpload.click();
      }
      return;
    }
    if (action === "delete-media") {
      const item = find(state.sections.specialties.items, button.dataset.specialty);
      if (item) {
        item.media = item.media.filter(function (mediaItem) { return mediaItem.id !== button.dataset.id; });
        renderApp();
      }
    }
  });

  document.addEventListener("input", function (event) {
    const t = event.target;
    const kind = t.dataset.inputKind;
    if (!kind) {
      return;
    }
    if (kind === "profile") {
      state.profile[t.dataset.field] = t.value;
      if (t.dataset.field === "photoScale" || t.dataset.field === "photoX" || t.dataset.field === "photoY") {
        applyProfilePhoto();
      }
      save();
      return;
    }
    if (kind === "section-meta") {
      state.sections[t.dataset.section][t.dataset.field] = t.value;
      save();
      return;
    }
    if (kind === "section-item") {
      const item = find(state.sections[t.dataset.section].items, t.dataset.id);
      if (item) {
        item[t.dataset.field] = t.value;
        save();
      }
      return;
    }
    if (kind === "specialty") {
      const item = find(state.sections.specialties.items, t.dataset.id);
      if (item) {
        item[t.dataset.field] = t.value;
        t.dataset.field === "sector" || t.dataset.field === "focus" || t.dataset.field === "gamerReference" ? renderApp() : save();
      }
      return;
    }
    if (kind === "social") {
      const item = find(state.sections.socials.items, t.dataset.id);
      if (item) {
        item[t.dataset.field] = t.value;
        t.dataset.field === "url" ? renderApp() : save();
      }
      return;
    }
    if (kind === "media") {
      const item = find(state.sections.specialties.items, t.dataset.specialty);
      const mediaItem = item ? find(item.media, t.dataset.id) : null;
      if (mediaItem) {
        mediaItem[t.dataset.field] = t.value;
        t.dataset.field === "url" || t.dataset.field === "type" ? renderApp() : save();
      }
    }
  });

  document.addEventListener("dragstart", function (event) {
    const node = event.target.closest("[draggable='true']");
    if (node) {
      drag = { scope: node.dataset.scope, id: node.dataset.id };
    }
  });

  document.addEventListener("dragover", function (event) {
    const node = drag ? scopeTarget(event.target, drag.scope) : null;
    if (!node || !drag) {
      return;
    }
    event.preventDefault();
    dropTargets();
    node.classList.add("is-drop-target");
  });

  document.addEventListener("drop", function (event) {
    const node = drag ? scopeTarget(event.target, drag.scope) : null;
    if (!node || !drag) {
      dropTargets();
      drag = null;
      return;
    }
    event.preventDefault();
    reorder(node.dataset.scope, drag.id, node.dataset.id);
    dropTargets();
    drag = null;
    renderApp();
  });

  document.addEventListener("dragend", dropTargets);

  if ($folderModal) {
    $folderModal.addEventListener("click", function (event) {
      if (event.target === $folderModal) {
        activeFolderId = "";
        renderFolderModal();
      }
    });
  }

  if ($authForm) {
    $authForm.addEventListener("submit", function (event) {
      event.preventDefault();
      unlockAdmin($authInput.value);
    });
  }

  if ($specialtyUpload) {
    $specialtyUpload.addEventListener("change", function (event) {
      handleSpecialtyFiles(event.target.files || []);
    });
  }

  if ($profilePhotoInput) {
    $profilePhotoInput.addEventListener("change", function (event) {
      handleProfilePhotoUpload((event.target.files || [])[0]);
    });
  }

  bootAdmin();
})();
