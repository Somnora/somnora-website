(function () {
  "use strict";

  var projects = window.PORTFOLIO_PROJECTS || {};
  var order = window.PORTFOLIO_PROJECT_ORDER || [];
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("project") || "";
  var project = projects[slug];
  var root = document.getElementById("project-root");
  var notFound = document.getElementById("project-not-found");

  function byId(id) {
    return document.getElementById(id);
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function setMeta(selector, attribute, value) {
    var node = document.querySelector(selector);
    if (node) node.setAttribute(attribute, value);
  }

  function fallbackIcon(label) {
    var initial = (label || "P").charAt(0).toUpperCase();
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%232b211a'/><stop offset='1' stop-color='%230c1118'/></linearGradient></defs>" +
      "<rect width='128' height='128' rx='29' fill='url(%23g)'/>" +
      "<rect x='11' y='11' width='106' height='106' rx='22' fill='none' stroke='%23e8b86d' stroke-opacity='.48'/>" +
      "<text x='64' y='78' text-anchor='middle' font-family='Georgia,serif' font-size='52' font-weight='600' fill='%23f7efe4'>" + initial + "</text>" +
      "</svg>";
    return "data:image/svg+xml," + svg;
  }

  if (!project) {
    if (notFound) notFound.hidden = false;
    document.title = "Project Not Found | James McShane";
    return;
  }

  document.title = project.name + " | Product and System Architecture";
  setMeta("meta[name='description']", "content", project.summary);
  setMeta("meta[property='og:title']", "content", project.name + " | Product and System Architecture");
  setMeta("meta[property='og:description']", "content", project.summary);
  setMeta("meta[property='og:url']", "content", "https://somnora.app/portfolio/project.html?project=" + encodeURIComponent(slug));
  setMeta("meta[name='twitter:card']", "content", project.icon ? "summary" : "summary_large_image");

  var icon = byId("project-icon");
  icon.src = project.icon || fallbackIcon(project.name);
  icon.alt = project.name + " project icon";

  byId("project-eyebrow").textContent = project.eyebrow;
  byId("project-name").textContent = project.name;
  byId("project-category").textContent = project.category;
  byId("project-status").textContent = project.status;
  byId("project-status").setAttribute("data-kind", project.statusKind || "");
  byId("project-summary").textContent = project.summary;

  var links = byId("project-links");
  project.links.forEach(function (item) {
    var link = element("a", "project-action" + (item[2] ? " project-action-primary" : ""), item[0]);
    link.href = item[1];
    link.target = "_blank";
    link.rel = "noopener";
    links.appendChild(link);
  });

  var facts = byId("project-facts");
  project.facts.forEach(function (item) {
    var wrapper = element("div", "project-fact");
    wrapper.appendChild(element("dt", "", item[0]));
    wrapper.appendChild(element("dd", "", item[1]));
    facts.appendChild(wrapper);
  });

  var overview = byId("project-overview");
  project.overview.forEach(function (paragraph) {
    overview.appendChild(element("p", "", paragraph));
  });

  var features = byId("project-features");
  project.features.forEach(function (item, index) {
    var card = element("article", "project-feature");
    card.appendChild(element("span", "project-feature-number", String(index + 1).padStart(2, "0")));
    card.appendChild(element("h3", "", item[0]));
    card.appendChild(element("p", "", item[1]));
    features.appendChild(card);
  });

  byId("architecture-intro").textContent = project.architectureIntro;
  byId("architecture-note").textContent = project.architectureNote;

  var flows = byId("architecture-flows");
  project.architectureFlows.forEach(function (flow) {
    var section = element("article", "architecture-flow");
    section.appendChild(element("h3", "", flow.title));
    var track = element("ol", "architecture-track");
    flow.nodes.forEach(function (item) {
      var node = element("li", "architecture-node");
      node.appendChild(element("span", "architecture-step", item[0]));
      node.appendChild(element("h4", "", item[1]));
      node.appendChild(element("p", "", item[2]));
      track.appendChild(node);
    });
    section.appendChild(track);
    flows.appendChild(section);
  });

  var switcher = byId("project-switcher");
  order.forEach(function (otherSlug) {
    if (otherSlug === slug || !projects[otherSlug]) return;
    var other = projects[otherSlug];
    var link = element("a", "project-switch");
    link.href = "projects/" + encodeURIComponent(otherSlug) + "/";
    var otherIcon = element("img");
    otherIcon.src = other.icon || fallbackIcon(other.name);
    otherIcon.alt = "";
    otherIcon.width = 42;
    otherIcon.height = 42;
    var copy = element("span");
    copy.appendChild(element("strong", "", other.name));
    copy.appendChild(element("small", "", other.category));
    link.appendChild(otherIcon);
    link.appendChild(copy);
    switcher.appendChild(link);
  });

  root.hidden = false;
})();
