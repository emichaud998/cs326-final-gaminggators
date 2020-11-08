window.addEventListener("load", async function () {
  document.getElementById('reset').addEventListener('click', () => {
    game.reset();
    renderGame(game);
  });
});