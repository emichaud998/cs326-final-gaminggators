export function BrowseComponent() {
  const container = document.createElement("div");
  const content = document.createElement('span');
  content.textContent = "BROWSE";
  container.appendChild(content);
  return container;
} 