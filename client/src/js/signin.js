'use strict';
import {postData} from 'utils.js'

const url = 'http://localhost:8080';

window.addEventListener("load", async function () {
  document.getElementById('signin-btn').addEventListener('click', () => {
    postData(`${url}/user/login`, {'username': userID,'password': starCount})
      .then(response => {
        const status = response.status;
        const data = response.json();
        console.log(response.status);
        console.log(response.json());
        alert(data)
      });
  });
});