import {BrowseComponent} from './components/browse.js';
import {GamesComponent} from './components/games.js';
import {ProfileComponent} from './components/profile.js';
import {RecommendComponent} from './components/recommend.js';
import {WishlistComponent} from './components/wishlist.js';

window.addEventListener('load', async function() {
  console.log("RUNNING");
});

function select_tab(id) {
  // Remove selected class from all buttons
  document.querySelectorAll(".route").forEach(
    item => item.classList.remove('selected'));
  // select clicked element (visually)
  document.querySelectorAll("#" + id).forEach(
    item => item.classList.add('selected'));
}

function load_content(id) {
  function getComponentFromId(id) {
    switch(id) {
      case "profile":
        return ProfileComponent();
      case "browse":
        return BrowseComponent();
      case "recommendations":
        return RecommendComponent();
      case "games":
        return GamesComponent();
      case "wishlist":
        return WishlistComponent();
      default:
        return 'Content loading for /' + id + '...';
    }
  }
  console.log("Loading content for {" + id + "}");
  // Update text "Content loading for {id}..."
  // Here you would do content loading magic...
  // Perhaps run Fetch API to update resources
  document.querySelector("#content").appendChild(getComponentFromId(id));
  // document.querySelector("#content").innerHTML = getComponentFromId(id);
}
function push(event) {
  // Get id attribute of the button or link clicked
  let id = event.target.id;
  // Visually select the clicked button/tab/box
  select_tab(id);
  // Update Title in Window's Tab
  document.title = id;
  // Load content for this tab/page
  load_content(id);
  // Finally push state change to the address bar
  window.history.pushState({ id }, `${id}`,
    `/page/${id}`);
}

window.onload = event => {
  // Add history push() event when boxes are clicked
  window["profile"].addEventListener("click",
    event => push(event))
  window["browse"].addEventListener("click",
    event => push(event))
  window["recommendations"].addEventListener("click",
    event => push(event))
  window["games"].addEventListener("click",
    event => push(event))
  window["wishlist"].addEventListener("click",
    event => push(event))
}
// Listen for PopStateEvent
// (Back or Forward buttons are clicked)
window.addEventListener("popstate", event => {
  // Grab the history state id
  let stateId = event.state.id;
  // Show clicked id in console (just for fun)
  console.log("stateId = ", stateId);
  // Visually select the clicked button/tab/box
  select_tab(stateId);
  // Load content for this tab/page
  load_content(stateId);
});