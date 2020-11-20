'use strict';
import {postData, getData} from './utils.js';

(function () {
  "use strict";

  class MessagesPagination {
    constructor() {
      this.messagesList = [{id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'}];;
      this.current_page = 1;
      this.records_per_page = 5;
    }
    init() {
      function pageNumbers() {
        let pageNumber = document.getElementById('page_number');
        pageNumber.innerHTML = "";
  
        for (let i = 1; i < this.numPages() + 1; i++) {
          pageNumber.innerHTML += "<span class='clickPageNumber'>" + i + "</span>";
        }
      }
      function clickPage() {
        document.addEventListener('click', function (e) {
          if (e.target.nodeName == "SPAN" && e.target.classList.contains("clickPageNumber")) {
            this.current_page = e.target.textContent;
            this.changePage(this.current_page);
          }
        });
      }
      function addEventListeners() {
        const prevButton = document.getElementById('button_prev');
        const nextButton = document.getElementById('button_next');
        prevButton.addEventListener('click', prevPage);
        nextButton.addEventListener('click', nextPage);
      }

      // core functionality executes after data is retrieved
      getData('/user/messages')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return Promise.reject('HTTP STATUS CODE: ' + response.status);
          }
        })
        .then(data => {
          console.log(this.messagesList)
          this.messagesList = data;
          this.changePage(1);
          pageNumbers();
          this.selectedPage();
          clickPage();
          addEventListeners();
        })
        .catch(error => {
          console.log(this.messagesList)
          console.log('error is', error);
        });
      
      console.log(this.messagesList)
      this.changePage(1);
      pageNumbers();
      this.selectedPage();
      clickPage();
      addEventListeners();
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

    selectedPage() {
      let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber');
      for (let i = 0; i < page_number.length; i++) {
        if (i == this.current_page - 1) {
          page_number[i].style.opacity = "1.0";
        }
        else {
          page_number[i].style.opacity = "0.5";
        }
      }
    }

    changePage(page) {
      function checkButtonOpacity() {
        const prevButton = document.getElementById('button_prev');
        const nextButton = document.getElementById('button_next');
        this.current_page == 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
        this.current_page == this.numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
      }
      const listContainer = document.getElementById('messageList');
      
      if (page < 1) {
        page = 1;
      }
      if (page > (this.numPages() - 1)) {
        page = this.numPages();
      }

      // rerender list
      listContainer.innerHTML = "";
      this.render(listContainer);
      checkButtonOpacity();
      this.selectedPage();
    }

    prevPage() {
      if (this.current_page > 1) {
        this.current_page--;
        this.changePage(this.current_page);
      }
    }

    nextPage() {
      if (this.current_page < this.numPages()) {
        this.current_page++;
        this.changePage(this.current_page);
      }
    }

    numPages() {
      return Math.ceil(this.messagesList.length / this.records_per_page);
    }
    
    render(element) {
      const fragment = document.createDocumentFragment();
      for (let i = (this.current_page - 1) * this.records_per_page; i < (this.current_page * this.records_per_page) && i < this.messageList.length; i++) {
        const message = messageList[i];
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
          deleteItem(element, message.id);
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
  let pagination = new MessagesPagination();
  pagination.init();
})();