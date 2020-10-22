export function WishlistComponent() {
  const container = document.createElement("div");
  const content = document.createElement('span');
  content.textContent = "WISHLIST";
  container.appendChild(content);
  return container;
} 