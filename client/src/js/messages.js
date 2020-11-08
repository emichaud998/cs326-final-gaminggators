class Messages {
  init (element) {
    this.render(element)
  }
  render (element) {
    function getMessageData() {
      const url = 'http://localhost:8080' + '/';
      fetch(`${url}/user/messages`, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({userID: currentUserID, userName: currentUserID})
      });
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
      /*
        <li class="list-group-item">
          <div class="card border-dark mb-3">
            <div class="card-header"><i class="fa fa-user fa-lg"></i>Friend Username</div>
            <div class="card-body text-dark">
              <h5 class="card-title"><a href="#">Wishlist update</a></h5>
              <p class="card-text">Custom text from friend. Hey dude, what's up. Check out this game. You should add this one to your wishlist too.</p>
            </div>
          </div>
        </li>
      */
    }
    element.appendChild(fragment)
  }
}

let messageList = new MessagesList()
MessagesList.init(document.getElementById("messageList"))