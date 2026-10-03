$(document).ready(function () {
  // Hover previews close on departure; clicking pins the abstract for reading.
  document.querySelectorAll(".publication-abstract").forEach(function (details) {
    const publication = details.closest(".row");
    let pinned = false;
    publication.addEventListener("mouseenter", function () {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) details.open = true;
    });
    publication.addEventListener("mouseleave", function () {
      if (!pinned && !details.contains(document.activeElement)) details.open = false;
    });
    details.querySelector("summary").addEventListener("click", function (event) {
      event.preventDefault();
      pinned = !pinned;
      details.open = pinned;
    });
    details.addEventListener("focusout", function (event) {
      if (!pinned && !details.contains(event.relatedTarget) && !publication.matches(":hover")) details.open = false;
    });
    details.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        pinned = false;
        details.open = false;
        details.querySelector("summary").focus();
      }
    });
  });

  // add toggle functionality to abstract, award and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});
