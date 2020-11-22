'use strict';
import {postData, getData} from './utils.js';

class MessagesList {
  constructor() {
    this.messageList = [];
  }
  getMessageList() {
    return this.messageList;
  }
  init (element) {
    getData('/user/messages')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject('HTTP STATUS CODE: ' + response.status);
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
    // makes post request to remove given message & rerenders
    postData('/user/messages/remove', {'messageID': messageID })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject('HTTP STATUS CODE: ' + response.status);
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
    function renderGameList(element, gameList) {
      element.innerHTML = "";

      const outerIndex = Math.ceil(gameList.length/3);
      // First for loop is the number of rows of cards, second for loop creates 3 cards per row
      let counter = 0;
      for (let j = 0; j < outerIndex; j++) {
          // Create card div for row
          const cardRowDiv = document.createElement('div');
          cardRowDiv.classList.add('card-deck', 'row', 'mb-3', 'cardRow');
          for (let i = 0; i < 3; i++) {
              if (gameList[counter] === undefined) {
                  break;
              }
              // Create main card div per card
              const cardDiv = document.createElement('div');
              cardDiv.classList.add('card', 'mw-5');
              cardDiv.id = gameList[counter].id;
  
              // Create div for game card image
              const pictureLink = document.createElement('a');
              const hrefLink = "game_overlay.html?gameID="+ gameList[counter].id;
              pictureLink.href = hrefLink;
              const image = document.createElement('img');
              image.classList.add('card-img-top');
              if (gameList[counter].cover !== null) {
                  const imageFilePath = '../images/' + gameList[counter].cover;
                  image.src = imageFilePath;
              }
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
              
              // Add description to game card body
              const gameDescription = document.createElement('p');
              gameDescription.classList.add('card-text');
              const descriptionText = gameList[counter].description;
              let truncatedText;
              if (descriptionText !== null) {
                  if (descriptionText.split(' ').length > 30) {
                      truncatedText = descriptionText.split(" ").splice(0,30).join(" ");
                      truncatedText = truncatedText + '...';
                  } else {
                      truncatedText = descriptionText;
                  }
              } else {
                  truncatedText = '';
              }
              const description = document.createTextNode(truncatedText);
              gameDescription.appendChild(description);
              cardBodyDiv.appendChild(gameDescription);
  
              // Create div to put rating and wishlist buttons at bottom of card
              const bottomCard = document.createElement('div');
              bottomCard.classList.add('bottomGameCard', 'mb-1');
  
              // Create add to wishlist button
              const wishlistDiv = document.createElement('div');
              wishlistDiv.classList.add('text-center', 'h-25');
              const wishlistButton = document.createElement('button');
              wishlistButton.classList.add('btn', 'btn-sm', 'btn-success');
              wishlistButton.innerText='Add to Wishlist';
              wishlistButton.addEventListener('click', () => {wishlistAdd(cardDiv.id);});
              wishlistDiv.appendChild(wishlistButton);
              bottomCard.appendChild(wishlistDiv);
  
              cardBodyDiv.appendChild(bottomCard);
  
              // Add single card div to row of cards
              cardDiv.appendChild(cardBodyDiv);
              cardRowDiv.appendChild(cardDiv);
  
              counter++;
          }
          // Add rows of game cards to container of game card rows    
          element.appendChild(cardRowDiv);
        }
      
    }
    //  userID, messageID, title, message
    const fragment = document.createDocumentFragment();
    
    for (const message of this.messageList) {
      const gameObjList = JSON.parse(message.message);

      // messageCard - should be separate class...
      const messageWrapper = document.createElement('div');
      const cardElem = document.createElement('div');
      cardElem.classList.add("card", "border-dark", "mb-3");
      // header
      // const cardHeaderElem = document.createElement('div');
      // cardHeaderElem.classList.add("card-header");
      // cardHeaderElem.innerHTML = `<i class="fa fa-user fa-lg"></i> ${message.sender}`;
      // body wrapper
      const cardBodyElem = document.createElement('div');
      cardBodyElem.classList.add("card-body", "text-dark");
      // card body title
      const cardBodyTitleElem = document.createElement('h5');
      cardBodyTitleElem.classList.add("card-title");
      cardBodyTitleElem.appendChild(document.createTextNode(`${message.title}`)); // add link here?
      // card body message
      const cardBodyMessageElem = document.createElement('div');
      cardBodyMessageElem.classList.add('container', 'ml-4', 'mt-4');
      renderGameList(cardBodyMessageElem, gameObjList);

      // Old code from when message was String from 1 person to another
      // const cardBodyMessageElem = document.createElement('p');
      // cardBodyMessageElem.classList.add("card-text");
      // cardBodyMessageElem.appendChild(document.createTextNode(`${message.message}`)); // add link here?
      
      // card body button
      const cardBodyButtonElem = document.createElement('button');
      cardBodyButtonElem.classList.add("btn", "btn-danger", "float-sm-right");
      cardBodyButtonElem.setAttribute("id", `mybtn ${message.id}`);
      cardBodyButtonElem.innerHTML = `<i class="fa fa-trash"></i>`;
      cardBodyButtonElem.onclick = () => {
        this.deleteItem(element, message.id);
      };
      // add content to card body
      cardBodyElem.appendChild(cardBodyTitleElem);
      cardBodyElem.appendChild(cardBodyMessageElem);
      cardBodyElem.appendChild(cardBodyButtonElem);
      // add card header and body to card div 
      cardElem.appendChild(cardBodyElem);
      // add card div to wrapper
      messageWrapper.appendChild(cardElem);
      // add each card wrapper to document fragment
      fragment.appendChild(messageWrapper);
    }
    element.innerHTML = "";
    element.appendChild(fragment);
  }
}

window.addEventListener("load", async function () {
  const msgListElem = document.getElementById("messageList");
  const messageListComp = new MessagesList();
  messageListComp.init(msgListElem);
});

// CHANGE IT TO PROPER JS way (way too much of a pain)
