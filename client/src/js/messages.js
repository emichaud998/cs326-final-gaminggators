'use strict';
import {postData, getData} from './utils.js';

(function () {
  "use strict";

  function MessagesPagination() {

    let messagesList = [
      {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Joe_Redfield', title: 'Hi Chris_Redfield!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Joe_Redfield', title: 'Hi Chris_Redfield!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Joe_Redfield', title: 'Hi Chris_Redfield!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Joe_Redfield', title: 'Hi Chris_Redfield!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Joe_Redfield', title: 'Hi Chris_Redfield!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Jill_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Jill_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Jill_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Jill_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      {id : '0001', sender : 'Jill_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
    ];

    const prevButton = document.getElementById('button_prev');
    const nextButton = document.getElementById('button_next');
    const clickPageNumber = document.querySelectorAll('.clickPageNumber');

    let current_page = 1;
    let records_per_page = 5;

    this.init = function () {
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
          messagesList = data;
          changePage(1);
          pageNumbers();
          selectedPage();
          clickPage();
          addEventListeners();
        })
        .catch(error => {
          console.log('error is', error);
        });
      changePage(1);
      pageNumbers();
      selectedPage();
      clickPage();
      addEventListeners();
    }

    let addEventListeners = function () {
      prevButton.addEventListener('click', prevPage);
      nextButton.addEventListener('click', nextPage);
    }

    let selectedPage = function () {
      let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber');
      for (let i = 0; i < page_number.length; i++) {
        if (i == current_page - 1) {
          page_number[i].style.opacity = "1.0";
        }
        else {
          page_number[i].style.opacity = "0.5";
        }
      }
    }

    let checkButtonOpacity = function () {
      current_page == 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
      current_page == numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
    }

    let changePage = function (page) {
      const listContainer = document.getElementById('messagesList');

      if (page < 1) {
        page = 1;
      }
      if (page > (numPages() - 1)) {
        page = numPages();
      }

      listContainer.innerHTML = "";
      render(listContainer);
      checkButtonOpacity();
      selectedPage();
    }

    let prevPage = function () {
      if (current_page > 1) {
        current_page--;
        changePage(current_page);
      }
    }

    let nextPage = function () {
      if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
      }
    }

    let clickPage = function () {
      document.addEventListener('click', function (e) {
        if (e.target.nodeName == "LI" && e.target.classList.contains("clickPageNumber")) {
          current_page = e.target.textContent;
          changePage(current_page);
        }
      });
    }

    let pageNumbers = function () {
      let pageNumber = document.getElementById('page_number');
      pageNumber.innerHTML = "";

      for (let i = 1; i < numPages() + 1; i++) {
        pageNumber.innerHTML += `<li class="page-item clickPageNumber"><a class="page-link" href="#">${i}</a></li>`
      }
    }

    let numPages = function () {
      return Math.ceil(messagesList.length / records_per_page);
    }

    let render = function(element) {
      const fragment = document.createDocumentFragment();
      for (let i = (current_page - 1) * records_per_page; i < (current_page * records_per_page) && i < messagesList.length; i++) {
        const message = messagesList[i];
        console.log(message);
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
