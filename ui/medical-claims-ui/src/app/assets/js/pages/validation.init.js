/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * File: Validation Js
 */

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    
  
      const form = document.getElementById('form-validation');
      const username = document.getElementById('username');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const password2 = document.getElementById('password2');
  
      //Show input error messages
      function showError(input, message) {
          const formControl = input.parentElement;
          console.log(formControl.children);
          formControl.children[1].classList.add('error');
          const small = formControl.querySelector('small');
          small.innerText = message;
          small.classList.add('error');
          small.classList.remove('success');        
  
      }
  
      //show success colour
      function showSucces(input) {
          const formControl = input.parentElement;
          formControl.children[1].classList.remove('error');
          formControl.children[1].classList.add('success');
          const small = formControl.querySelector('small');
          small.classList.add('success');
          small.classList.remove('error');
  
      }
  
      //check email is valid
      function checkEmail(input) {
          const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(re.test(input.value.trim())) {
              showSucces(input)
          }else {
              showError(input,'Email is not invalid');
          }
      }
  
  
      //checkRequired fields
      function checkRequired(inputArr) {
          inputArr.forEach(function(input){
              if(input.value.trim() === ''){
                  showError(input,`${getFieldName(input)} is required`)
              }else {
                  showSucces(input);
              }
          });
      }
  
  
      //check input Length
      function checkLength(input, min ,max) {
          if(input.value.length < min) {
              showError(input, `${getFieldName(input)} must be at least ${min} characters`);
          }else if(input.value.length > max) {
              showError(input, `${getFieldName(input)} must be les than ${max} characters`);
          }else {
              showSucces(input);
          }
      }
  
      //get FieldName
      function getFieldName(input) {
          return input.id.charAt(0).toUpperCase() + input.id.slice(1);
      }
  
      // check passwords match
      function checkPasswordMatch(input1, input2) {
          if(input1.value !== input2.value) {
              showError(input2, 'Passwords do not match');
          }
      }
  
  
      //Event Listeners
      form.addEventListener('submit',function(e) {
          e.preventDefault();
  
          checkRequired([username, email, password, password2]);
          checkLength(username,3,15);
          checkLength(password,6,25);
          checkEmail(email);
          checkPasswordMatch(password, password2);
      });
  })()



  function validate(){
    var name = document.getElementById("name").value;
    var subject = document.getElementById("subject").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    var error_message = document.getElementById("error_message");
    
    error_message.style.padding = "10px";
    
    var text;
    if(name.length < 5){
      text = "Please Enter valid Name";
      error_message.innerHTML = text;
      return false;
    }
    if(subject.length < 10){
      text = "Please Enter Correct Subject";
      error_message.innerHTML = text;
      return false;
    }
    if(isNaN(phone) || phone.length != 10){
      text = "Please Enter valid Phone Number";
      error_message.innerHTML = text;
      return false;
    }
    if(email.indexOf("@") == -1 || email.length < 6){
      text = "Please Enter valid Email";
      error_message.innerHTML = text;
      return false;
    }
    if(message.length <= 140){
      text = "Please Enter More Than 140 Characters";
      error_message.innerHTML = text;
      return false;
    }
    alert("Form Submitted Successfully!");
    return true;
  }