'use strict'
import {postData} from './utils.js'

const url = 'https://gamer-port.herokuapp.com';
class MessagesList {
  constructor() {
    this.messageList = []
  }
  getMessageList() {
    return this.messageList
  }
  init (element) {
    // set username and userID (not use, since endpoint only uses 1)
    let username = "", userID = undefined;
    if (typeof(Storage) !== "undefined") {
      username = localStorage.getItem("username");
      // userID = localStorage.getItem("username");
    } else {
      alert("Sorry, your browser does not support Web Storage...");
    }
    postData(`${url}/user/messages`, {'username': username, 'userID': userID})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject('HTTP STATUS CODE: ' + response.status)
        }
      })
      .then(data => {
        this.messageList = data;
        this.render(element);
      })
      .catch(error => console.log('error is', error));
  }
  deleteItem(element, messageID) {
    // set username and userID (not use, since endpoint only uses 1)
    let username = "", userID = undefined;
    if (typeof(Storage) !== "undefined") {
      username = localStorage.getItem("username");
      // userID = localStorage.getItem("username");
    } else {
      alert("Sorry, your browser does not support Web Storage...");
    }
    // makes post request to remove given message & rerenders
    postData(`${url}/user/messages/remove`, {'username': username, 'userID': userID, 'messageID': messageID })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject('HTTP STATUS CODE: ' + response.status)
        }
      })
      .then(data => {
        this.messageList = data;
        this.render(element);
      })
      .catch(error => console.log('error is', error));
  }
  /* Card Example (for reference):
    <div id=${message.id} class="card border-dark mb-3">
      <div class="card-header"></div>
      <div class="card-body text-dark">
        <h5 class="card-title"><a href="#">${message.title}</a></h5>
        <p class="card-text">${message.message}</p>
        <button id="mybtn ${message.id}" type="button" class="btn btn-danger float-sm-right"><i class="fa fa-trash"></i></button>
      </div>
    </div>
  */
  render(element) {
    let fragment = document.createDocumentFragment()
    for (let message of this.messageList) {
      // messageCard - should be separate class...
      const messageWrapper = document.createElement('div');
      const cardElem = document.createElement('div');
      cardElem.classList.add("card", "border-dark", "mb-3");
      // header
      const cardHeaderElem = document.createElement('div');
      cardHeaderElem.classList.add("card-header");
      cardHeaderElem.innerHTML = `<i class="fa fa-user fa-lg"></i> ${message.sender}`
      // body wrapper
      const cardBodyElem = document.createElement('div');
      cardBodyElem.classList.add("card-body", "text-dark");
      // card body title
      const cardBodyTitleElem = document.createElement('h5');
      cardBodyTitleElem.classList.add("card-title");
      cardBodyTitleElem.appendChild(document.createTextNode(`${message.title}`)); // add link here?
      // card body message
      const cardBodyMessageElem = document.createElement('p');
      cardBodyMessageElem.classList.add("card-text");
      cardBodyMessageElem.appendChild(document.createTextNode(`${message.message}`)); // add link here?
      // card body button
      const cardBodyButtonElem = document.createElement('button');
      cardBodyButtonElem.classList.add("btn", "btn-danger", "float-sm-right");
      cardBodyButtonElem.setAttribute("id", `mybtn ${message.id}`);
      cardBodyButtonElem.innerHTML = `<i class="fa fa-trash"></i>`;
      cardBodyButtonElem.onclick = () => {
        this.deleteItem(element, message.id);
      };
      // wrapper for games card list
      const cardBodyCardListElem = document.createElement('div');
      addGameCards(message.gameList, cardBodyCardListElem, message.gameRatingList)
      // add game list cards if applicable
      // add content to card body
      cardBodyElem.appendChild(cardBodyTitleElem);
      cardBodyElem.appendChild(cardBodyMessageElem);
      cardBodyElem.appendChild(cardBodyButtonElem);
      // add card header and body to card div 
      cardElem.appendChild(cardHeaderElem);
      cardElem.appendChild(cardBodyElem);
      // add card div to wrapper
      messageWrapper.appendChild(cardElem);
      // add each card wrapper to document fragment
      fragment.appendChild(messageWrapper)
    }
    element.innerHTML = ""
    element.appendChild(fragment);
  }
}

window.addEventListener("load", async function () {
  const msgListElem = document.getElementById("messageList");
  let messageListComp = new MessagesList();
  messageListComp.init(msgListElem);
});

// CHANGE IT TO PROPER JS way (way too much of a pain)

// Add game cards to main body container of the page
function addGameCards(gameList, gameCardsDiv, user_ratings) {
  gameCardsDiv.innerHTML = '';
  gameCardsDiv.classList.add('container', 'ml-4', 'mt-4');
  if (gameList.length <= 0) {
    return;
  }
  const outerIndex = Math.ceil(gameList.length/4);
  // First for loop is the number of rows of cards, second for loop creates 3 cards per row
  let counter = 0;
  for (let j = 0; j < outerIndex; j++) {
      // Create card div for row
      const cardRowDiv = document.createElement('div');
      cardRowDiv.classList.add('card-deck', 'row', 'mb-3', 'cardRow');
      for (let i = 0; i < 4; i++) {
          if (gameList[counter] === undefined) {
              break;
          }
          // Create main card div per card
          const cardDiv = document.createElement('div');
          cardDiv.classList.add('card');
          cardDiv.id = gameList[counter].id;

          // Create div for game card image
          const pictureLink = document.createElement('a');
          const hrefLink = "game_overlay.html?gameID="+ gameList[counter].id;
          pictureLink.href = hrefLink;
          const image = document.createElement('img');
          image.classList.add('card-img-top');
          image.src = gameList[counter].cover;
          pictureLink.appendChild(image);
          cardDiv.appendChild(pictureLink);
          
          // Create div for game card body
          const cardBodyDiv = document.createElement('div');
          cardBodyDiv.classList.add('card-body');

          // Add game title to game card body
          const titleLink = document.createElement('a');
          titleLink.href = hrefLink;
          const cardTitle = document.createElement('h5');
          cardTitle.classList.add('card-title');
          const title = document.createTextNode(gameList[counter].name);
          cardTitle.appendChild(title);
          titleLink.appendChild(cardTitle);
          cardBodyDiv.appendChild(titleLink);

          // Create ratings div and insert rating label
          const ratingsDiv = document.createElement('div');
          ratingsDiv.classList.add('d-flex', 'flex-row', 'flex-wrap');
          const ratingLabel = document.createElement('p');
          ratingLabel.classList.add('mr-3');
          const textRatingLabel = document.createTextNode('Your Rating: ');
          ratingLabel.appendChild(textRatingLabel);
          ratingsDiv.appendChild(ratingLabel);

          let goldStarNum = 0;
          const ratingObj = user_ratings.find(rating => {
              return rating.gameID === cardDiv.id;
          });
          if (ratingObj) {
              goldStarNum = ratingObj.rating;
          }
          // Create card game rating stars
          for (let starCount = 1; starCount <= 5; starCount++){
              const starDiv = document.createElement('div');
              starDiv.classList.add('fa', 'fa-star', 'mt-1', 'mb-2');
              if (goldStarNum > 0) {
                  starDiv.style.color = 'gold';
                  goldStarNum--;
              }
              ratingsDiv.appendChild(starDiv);
          }

          const breakline = document.createElement('br');
          ratingsDiv.appendChild(breakline);
          cardBodyDiv.appendChild(ratingsDiv);

          // Add single card div to row of cards
          cardDiv.appendChild(cardBodyDiv);
          cardRowDiv.appendChild(cardDiv);

          counter++;
      }
      // Add rows of game cards to container of game card rows
      gameCardsDiv.appendChild(cardRowDiv);
  }
}