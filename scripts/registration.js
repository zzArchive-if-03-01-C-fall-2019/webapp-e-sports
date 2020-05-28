
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBZwDVWbWjLlTQwO3XjAgi0LcQw_cENf14",
    authDomain: "form-93de0.firebaseapp.com",
    databaseURL: "https://form-93de0.firebaseio.com",
    projectId: "form-93de0",
    storageBucket: "form-93de0.appspot.com",
    messagingSenderId: "1073140011216",
    appId: "1:1073140011216:web:58af86ff66baf99bd7ced5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();

    function signUp(){

var email = document.getElementById("email");
var password = document.getElementById("password");

const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
promise.catch(e => alert(e.message));

alert("Signed Up");
}


function signIn(){

var email = document.getElementById("email");
var password = document.getElementById("password");

const promise = auth.signInWithEmailAndPassword(email.value, password.value);
promise.catch(e => alert(e.message));

}


function signOut(){

auth.signOut();
alert("Signed Out");

}



auth.onAuthStateChanged(function(user){

if(user){

var email = user.email;
alert("Active User " + email);

//Take user to a different or home page

//is signed in

}else{

alert("No Active User");
//no user is signed in
}



});
