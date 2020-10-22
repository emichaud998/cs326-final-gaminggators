export function BrowseComponent(element) {
  const container = document.createElement("div");
  const content = document.createElement('span');
  content.textContent = "BROWSE";
  container.appendChild(content);
  element.appendChild(container);
} 