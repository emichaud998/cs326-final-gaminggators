'use strict'
import {postData} from './utils.js'

const url = 'http://localhost:8080';
class MessagesList {
  init (element) {
    this.render(element)
  }
  render (element) {
    function getMessageData() {
      // set username and userID
      const username, userID;
      if (typeof(Storage) !== "undefined") {
        username = localStorage.getItem("userID");
        userID = localStorage.getItem("username");
      } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
      }
      return await postData(`${url}/user/messages`, {'username': username,'userID': userID})
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            return Promise.reject('HTTP STATUS CODE: ' + response.status)
          }
        })
        .then(data => {
          return data;
        })
        .catch(error => console.log('error is', error));
    }
    let messageList = getMessageData()
    let messageList = [
      { id: 1, title: 'Breakfast Burrito', calories: 150 },
      { id: 2, title: 'Turkey Sandwich', calories: 600 },
      { id: 3, title: 'Roasted Chicken', calories: 725 }
    ]
    let fragment = document.createDocumentFragment()
    for (let message of messageList) {
      // messageCard - should be separate class.....
      let messageWrapper = document.createElement('li');
      // too lazy to figure out each JS element & every class name
      messageWrapper.innerHTML = `<div class="card border-dark mb-3">
          <div class="card-header"><i class="fa fa-user fa-lg"></i>Friend Username</div>
          <div class="card-body text-dark">
            <h5 class="card-title"><a href="#">${message.title}</a></h5>
            <p class="card-text">Custom text from friend. Hey dude, what's up. Check out this game. You should add this one to your wishlist too.</p>
          </div>
        </div>`
      // add to document fragment
      fragment.appendChild(messageWrapper)
    }
    element.appendChild(fragment)
  }
}

let messageList = new MessagesList()
messageList.init(document.getElementById("messageList"))
