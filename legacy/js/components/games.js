export function GamesComponent() {
  const container = document.createElement("div");
  const content = document.createElement('span');
  content.textContent = "GAMES";
  container.appendChild(content);
  return container;
}