export function RecommendComponent() {
  const container = document.createElement("div");
  const content = document.createElement('span');
  content.textContent = "RECOMMENDATIONS";
  container.appendChild(content);
  return container;
} 