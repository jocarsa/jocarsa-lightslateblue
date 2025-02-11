document.addEventListener("DOMContentLoaded", function () {
  class JocarsaEditor {
    constructor(textarea) {
      this.textarea = textarea;
      this.initEditor();
    }

    initEditor() {
      // Create the main container.
      const container = document.createElement("div");
      container.classList.add("jocarsa-container");

      // Hide the original textarea and insert the container before it.
      this.textarea.style.display = "none";
      this.textarea.parentNode.insertBefore(container, this.textarea);
      container.appendChild(this.textarea);

      // Create the visual editor (a contenteditable div).
      this.editorDiv = document.createElement("div");
      this.editorDiv.classList.add("jocarsa-editor");
      this.editorDiv.setAttribute("contenteditable", "true");
      // Load any preexisting content.
      this.editorDiv.innerHTML = this.textarea.value;
      container.appendChild(this.editorDiv);

      // Sync changes from the visual editor.
      this.editorDiv.addEventListener("input", () => {
        this.updateTextarea();
      });

      // Create the categorized block selector.
      this.createBlockSelector(container);

      // Create the HTML view toggle.
      this.createHTMLToggle(container);
    }

    // Updates the hidden textarea (and the HTML view, if visible)
    // by iterating through each child block and appending a newline.
    updateTextarea() {
      let html = "";
      Array.from(this.editorDiv.children).forEach(child => {
        html += child.outerHTML + "\n";
      });
      this.textarea.value = html;
      if (this.htmlEditor && this.htmlEditor.style.display !== "none") {
        this.htmlEditor.value = html;
      }
    }

    createBlockSelector(container) {
      const blockSelector = document.createElement("select");
      blockSelector.classList.add("jocarsa-block-selector");

      // Define categories and their blocks.
      const categories = [
        {
          name: "Bloques de Contenido Básicos",
          blocks: [
            { name: "Párrafo", tag: "p" },
            { name: "Encabezado (H1)", tag: "h1" },
            { name: "Encabezado (H2)", tag: "h2" },
            { name: "Encabezado (H3)", tag: "h3" },
            { name: "Lista no ordenada", tag: "ul" },
            { name: "Lista ordenada", tag: "ol" },
            { name: "Cita", tag: "blockquote" },
            { name: "Código", tag: "pre" }
          ]
        },
        {
          name: "Bloques de Medios",
          blocks: [
            { name: "Imagen", tag: "img" },
            { name: "Galería", tag: "gallery" },
            { name: "Audio", tag: "audio" },
            { name: "Vídeo", tag: "video" },
            { name: "Archivo", tag: "file" }
          ]
        },
        {
          name: "Bloques de Inserción y Embeds",
          blocks: [
            { name: "Botón", tag: "button" },
            { name: "Tabla", tag: "table" },
            { name: "Separador", tag: "hr" },
            { name: "Shortcode", tag: "shortcode" },
            { name: "HTML Personalizado", tag: "html" },
            { name: "Widget", tag: "widget" }
          ]
        },
        {
          name: "Bloques de Inserción de Terceros",
          blocks: [
            { name: "YouTube", tag: "youtube" },
            { name: "Vimeo", tag: "vimeo" },
            { name: "Twitter", tag: "twitter" },
            { name: "Facebook", tag: "facebook" },
            { name: "Instagram", tag: "instagram" },
            { name: "Google Maps", tag: "maps" },
            { name: "GitHub Gist", tag: "gist" }
          ]
        },
        {
          name: "Bloques de Diseño",
          blocks: [
            { name: "Grupo", tag: "group" },
            { name: "Columna", tag: "column" },
            { name: "Fila", tag: "row" },
            { name: "Caja de Contenedor", tag: "container" },
            { name: "Rejilla", tag: "grid" }
          ]
        },
        {
          name: "Bloques de Tema y Plantillas",
          blocks: [
            { name: "Encabezado del sitio", tag: "site-header" },
            { name: "Imagen Destacada", tag: "featured-image" },
            { name: "Fecha de Publicación", tag: "publication-date" },
            { name: "Autor", tag: "author" },
            { name: "Navegación", tag: "navigation" }
          ]
        }
      ];

      // Create optgroups for each category.
      categories.forEach(category => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = category.name;
        category.blocks.forEach(block => {
          const option = document.createElement("option");
          option.value = block.tag;
          option.textContent = block.name;
          optgroup.appendChild(option);
        });
        blockSelector.appendChild(optgroup);
      });

      // Create the "Add Block" button.
      const addButton = document.createElement("button");
      addButton.setAttribute("type", "button");
      addButton.textContent = "Añadir bloque";
      addButton.classList.add("jocarsa-add-block");

      container.appendChild(blockSelector);
      container.appendChild(addButton);

      addButton.addEventListener("click", () => {
        this.insertBlock(blockSelector.value);
      });
    }

    createHTMLToggle(container) {
      // Container for the toggle switch.
      const toggleContainer = document.createElement("div");
      toggleContainer.classList.add("jocarsa-html-toggle-container");

      // The checkbox for toggling the HTML view.
      const toggleSwitch = document.createElement("input");
      toggleSwitch.type = "checkbox";
      toggleSwitch.id = "html-toggle-" + Math.random().toString(36).substr(2, 5);
      toggleSwitch.classList.add("jocarsa-html-toggle");

      // Label styled as a slider.
      const toggleLabel = document.createElement("label");
      toggleLabel.setAttribute("for", toggleSwitch.id);
      toggleLabel.classList.add("jocarsa-html-toggle-label");
      toggleLabel.textContent = "Ver HTML";

      toggleContainer.appendChild(toggleSwitch);
      toggleContainer.appendChild(toggleLabel);

      container.appendChild(toggleContainer);

      // Create the HTML editor textarea (initially hidden).
      this.htmlEditor = document.createElement("textarea");
      this.htmlEditor.classList.add("jocarsa-html-editor");
      this.htmlEditor.style.display = "none";
      container.appendChild(this.htmlEditor);

      // Toggle the views.
      toggleSwitch.addEventListener("change", () => {
        if (toggleSwitch.checked) {
          this.htmlEditor.value = this.textarea.value;
          this.editorDiv.style.display = "none";
          this.htmlEditor.style.display = "block";
        } else {
          this.editorDiv.innerHTML = this.htmlEditor.value;
          this.editorDiv.style.display = "block";
          this.htmlEditor.style.display = "none";
          this.updateTextarea();
        }
      });

      this.htmlEditor.addEventListener("input", () => {
        this.updateTextarea();
      });
    }

    insertBlock(tag) {
  let newBlock;

  switch (tag) {
    // Basic Content Blocks.
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "ul":
    case "ol":
      newBlock = document.createElement(tag);
      newBlock.textContent = `Nuevo ${tag.toUpperCase()}`;
      break;
    case "blockquote":
      newBlock = document.createElement("blockquote");
      newBlock.textContent = "Cita de ejemplo";
      break;
    case "pre":
      newBlock = document.createElement("pre");
      newBlock.textContent = "Código de ejemplo";
      break;

    // Media Blocks.
    case "img":
      newBlock = document.createElement("img");
      newBlock.src = "https://via.placeholder.com/150";
      newBlock.alt = "Imagen de ejemplo";
      break;
    case "gallery":
      newBlock = document.createElement("div");
      newBlock.classList.add("gallery");
      for (let i = 0; i < 3; i++) {
        const img = document.createElement("img");
        img.src = "https://via.placeholder.com/150";
        img.alt = "Imagen de galería";
        img.classList.add("gallery-image");
        newBlock.appendChild(img);
      }
      break;
    case "audio":
      newBlock = document.createElement("audio");
      newBlock.controls = true;
      const audioSource = document.createElement("source");
      audioSource.src = "https://www.w3schools.com/html/horse.mp3";
      newBlock.appendChild(audioSource);
      break;
    case "video":
      newBlock = document.createElement("video");
      newBlock.controls = true;
      const videoSource = document.createElement("source");
      videoSource.src = "https://www.w3schools.com/html/mov_bbb.mp4";
      newBlock.appendChild(videoSource);
      break;
    case "file":
      newBlock = document.createElement("a");
      newBlock.href = "#";
      newBlock.textContent = "Descargar archivo de ejemplo";
      break;

    // Interactive/Embed Blocks.
    case "button":
      newBlock = document.createElement("button");
      newBlock.textContent = "Botón de ejemplo";
      break;
    case "table":
      newBlock = document.createElement("table");
      newBlock.border = "1";
      const tbody = document.createElement("tbody");
      const row = document.createElement("tr");
      const cell1 = document.createElement("td");
      cell1.textContent = "Celda 1";
      const cell2 = document.createElement("td");
      cell2.textContent = "Celda 2";
      row.appendChild(cell1);
      row.appendChild(cell2);
      tbody.appendChild(row);
      newBlock.appendChild(tbody);
      break;
    case "hr":
      newBlock = document.createElement("hr");
      break;
    case "shortcode":
      newBlock = document.createElement("div");
      newBlock.classList.add("shortcode");
      newBlock.textContent = "[shortcode]";
      break;
    case "html":
      newBlock = document.createElement("div");
      newBlock.classList.add("custom-html");
      newBlock.textContent = "<p>HTML personalizado</p>";
      break;
    case "widget":
      newBlock = document.createElement("div");
      newBlock.classList.add("widget");
      newBlock.textContent = "Widget: contenido dinámico";
      break;

    // Third-Party Embeds.
    case "youtube":
      let videoUrl = prompt("Ingrese la URL de YouTube o el ID del video:", "dQw4w9WgXcQ");
      if (!videoUrl) {
        videoUrl = "dQw4w9WgXcQ";
      }
      if (!videoUrl.includes("http")) {
        videoUrl = "https://www.youtube.com/embed/" + videoUrl;
      }
      newBlock = document.createElement("iframe");
      newBlock.src = videoUrl;
      newBlock.width = 560;
      newBlock.height = 315;
      newBlock.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      newBlock.allowFullscreen = true;
      break;
    case "vimeo":
      newBlock = document.createElement("iframe");
      newBlock.src = "https://player.vimeo.com/video/76979871";
      newBlock.width = 640;
      newBlock.height = 360;
      newBlock.allow = "autoplay; fullscreen; picture-in-picture";
      newBlock.allowFullscreen = true;
      break;
    case "twitter":
      newBlock = document.createElement("blockquote");
      newBlock.classList.add("twitter-tweet");
      newBlock.textContent = "Tweet embed placeholder";
      break;
    case "facebook":
      newBlock = document.createElement("div");
      newBlock.classList.add("fb-post");
      newBlock.textContent = "Facebook embed placeholder";
      break;
    case "instagram":
      newBlock = document.createElement("div");
      newBlock.classList.add("instagram-media");
      newBlock.textContent = "Instagram embed placeholder";
      break;
    case "maps":
      newBlock = document.createElement("iframe");
      newBlock.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3...";
      newBlock.width = 600;
      newBlock.height = 450;
      newBlock.style.border = 0;
      newBlock.allowFullscreen = "";
      newBlock.loading = "lazy";
      break;
    case "gist":
      newBlock = document.createElement("script");
      newBlock.src = "https://gist.github.com/username/gistid.js";
      break;

    // Design Blocks.
    case "group":
      newBlock = document.createElement("div");
      newBlock.classList.add("group");
      newBlock.textContent = "Grupo de bloques";
      break;
    case "column":
      newBlock = document.createElement("div");
      newBlock.classList.add("column");
      newBlock.textContent = "Columna";
      break;
    case "row":
      newBlock = document.createElement("div");
      newBlock.classList.add("row");
      newBlock.textContent = "Fila";
      break;
    case "container":
      newBlock = document.createElement("div");
      newBlock.classList.add("container-box");
      newBlock.textContent = "Caja de contenedor";
      break;
    case "grid":
      newBlock = document.createElement("div");
      newBlock.classList.add("grid");
      newBlock.textContent = "Rejilla";
      break;

    // Theme/Template Blocks.
    case "site-header":
      newBlock = document.createElement("header");
      newBlock.textContent = "Encabezado del sitio";
      break;
    case "featured-image":
      newBlock = document.createElement("img");
      newBlock.src = "https://via.placeholder.com/600x200";
      newBlock.alt = "Imagen destacada";
      break;
    case "publication-date":
      newBlock = document.createElement("time");
      newBlock.textContent = "Fecha de publicación";
      break;
    case "author":
      newBlock = document.createElement("span");
      newBlock.textContent = "Autor";
      break;
    case "navigation":
      newBlock = document.createElement("nav");
      newBlock.textContent = "Navegación";
      break;
    default:
      newBlock = document.createElement("div");
      newBlock.textContent = `Bloque desconocido: ${tag}`;
  }

  if (newBlock) {
    // Add a data attribute and extra CSS class for targeting.
    newBlock.setAttribute("data-block-type", tag);
    newBlock.classList.add("block-" + tag);
    newBlock.classList.add("jocarsa-block"); // Add this class to each block

    // Add a delete button to the block.
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.classList.add("block-delete-btn");
    deleteBtn.setAttribute("title", "Eliminar bloque");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      newBlock.remove();
      this.updateTextarea();
    });
    newBlock.appendChild(deleteBtn);

    // Append the new block to the visual editor.
    this.editorDiv.appendChild(newBlock);
    this.updateTextarea();
  }
}

  }

  // Initialize the editor on every textarea with the class "jocarsa-lightslateblue".
  document.querySelectorAll("textarea.jocarsa-lightslateblue").forEach(textarea => {
    new JocarsaEditor(textarea);
  });
});

