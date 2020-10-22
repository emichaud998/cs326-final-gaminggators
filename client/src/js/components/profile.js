export function ProfileComponent() {
  const container = document.createElement("div");
  const content = document.createElement('span');
  content.textContent = "PROFILE";
  container.appendChild(content);
  return container;
} 