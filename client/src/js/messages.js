'use strict'
import {postData} from './utils.js'

const url = 'http://localhost:8080';
class MessagesList {
  init (element) {
    this.render(element)
  }
  render (element) {
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
        const messageList = data;
        let fragment = document.createDocumentFragment()
        for (let message of messageList) {
          // messageCard - should be separate class.....but lazy
          let messageWrapper = document.createElement('div');
          // too lazy to figure out each JS element & every class name
          messageWrapper.innerHTML = `<div class="card border-dark mb-3">
              <div class="card-header"><i class="fa fa-user fa-lg"></i> ${message.sender}</div>
              <div class="card-body text-dark">
                <h5 class="card-title"><a href="#">${message.title}</a></h5>
                <p class="card-text">${message.message}</p>
              </div>
            </div>`
          // add to document fragment
          fragment.appendChild(messageWrapper)
        }
        element.innerHTML = ""
        element.appendChild(fragment)
      })
      .catch(error => console.log('error is', error));
  }
}

let messageList = new MessagesList()
messageList.init(document.getElementById("messageList"))
