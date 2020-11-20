/*
  I used a JS class to manage the state, so the component would rerender after the API call.

  Pagination wrapper requires the knowledge about when to rerender (a pain to set up propagation w/o library),
  therefore, I wrote the pagination with access to the data.
*/

'use strict';
import {postData, getData} from './utils.js';

(function () {
  class MessagesPagination {
    constructor() {
      this.messagesList = [
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},

        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},

        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},

        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},

        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
        {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
      ];
      this.current_page = 1;
      this.records_per_page = 5;
      /*
      fix for possibly binding issue:
      
      this.init = this.init.bind(this);      
      this.addEventListeners = this.addEventListeners.bind(this);
      this.prevPage = this.prevPage.bind(this);
      this.nextPage = this.nextPage.bind(this);
      this.pageNumbers = this.pageNumbers.bind(this);
      this.clickPage = this.clickPage.bind(this);
      this.deleteItem = this.deleteItem.bind(this);
      this.selectedPage = this.selectedPage.bind(this);
      this.changePage = this.changePage.bind(this);
      this.checkButtonOpacity = this.checkButtonOpacity.bind(this);
      this.numPages = this.numPages.bind(this);
      this.render = this.render.bind(this);
      */
    }
    init() {
      

      // core functionality executes after data is retrieved
      /*
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
          this.messagesList = [
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
    
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
    
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
    
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
    
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
            {id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'},
          ];
          console.log('error is', error);
        });
      */
      this.changePage(1);
      this.pageNumbers();
      this.selectedPage();
      this.clickPage();
      this.addEventListeners();
    }

    addEventListeners() {
      const prevButton = document.getElementById('button_prev');
      const nextButton = document.getElementById('button_next');
      prevButton.addEventListener('click', this.prevPage);
      nextButton.addEventListener('click', this.nextPage);
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

    pageNumbers() {
      let pageNumber = document.getElementById('page_number');
      pageNumber.innerHTML = "";

      for (let i = 1; i < this.numPages() + 1; i++) {
        pageNumber.innerHTML += "<span class='clickPageNumber'>" + i + "</span>";
      }
    }
    
    clickPage() {
      document.addEventListener('click', function (e) {
        if (e.target.nodeName == "SPAN" && e.target.classList.contains("clickPageNumber")) {
          console.log(this);
          console.log("BLAH");
          this.current_page = e.target.textContent;
          this.changePage(this.current_page);
        }
      });
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
      const listContainer = document.getElementById('messageList');
      // error check page for bounds 1 and end of messages
      if (page < 1) {
        page = 1;
      }
      if (page > (this.numPages() - 1)) {
        page = this.numPages();
      }

      // rerender list
      listContainer.innerHTML = "";
      this.render(listContainer);
      // change opacity based on current page
      this.checkButtonOpacity();
      this.selectedPage();
    }

    checkButtonOpacity() {
      const prevButton = document.getElementById('button_prev');
      const nextButton = document.getElementById('button_next');
      this.current_page == 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
      this.current_page == this.numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
    }

    numPages() {
      return Math.ceil(this.messagesList.length / this.records_per_page);
    }
    
    render(element) {
      const messagesList = this.messagesList;
      const current_page = this.current_page;
      const records_per_page = this.rr
      const fragment = document.createDocumentFragment();
      for (let i = (current_page - 1) * records_per_page; i < (current_page * records_per_page) && i < messagesList.length; i++) {
        const message = messageList[i];
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