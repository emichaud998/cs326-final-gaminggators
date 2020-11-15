'use strict';
import {postData} from './utils.js';

class MessagesList {
  constructor() {
    this.messageList = [];
  }
  getMessageList() {
    return this.messageList;
  }
  init (element) {
    // set username and userID (not use, since endpoint only uses 1)
    let username = "";
    const userID = "1111";
    if (typeof(Storage) !== "undefined") {
      username = undefined;
      //username = localStorage.getItem("username");
      // userID = localStorage.getItem("username");
    } else {
      alert("Sorry, your browser does not support Web Storage...");
    }
    postData('/user/messages', {'username': username, 'userID': userID})
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
    let username = "";
    const userID = undefined;
    if (typeof(Storage) !== "undefined") {
      username = localStorage.getItem("username");
      // userID = localStorage.getItem("username");
    } else {
      alert("Sorry, your browser does not support Web Storage...");
    }
    // makes post request to remove given message & rerenders
    postData('/user/messages/remove', {'username': username, 'userID': userID, 'messageID': messageID })
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
    const fragment = document.createDocumentFragment();
    for (const message of this.messageList) {
      // messageCard - should be separate class...
      const messageWrapper = document.createElement('div');
      const cardElem = document.createElement('div');
      cardElem.classList.add("card", "border-dark", "mb-3");
      // header
      const cardHeaderElem = document.createElement('div');
      cardHeaderElem.classList.add("card-header");
      cardHeaderElem.innerHTML = `<i class="fa fa-user fa-lg"></i> ${message.sender}`;
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