
  var config = {
    apiKey: "AIzaSyD_H-ht_PMVxCqMkSNJ_VE5syp6RzLw8vI",
    authDomain: "train-time-3efe9.firebaseapp.com",
    databaseURL: "https://train-time-3efe9.firebaseio.com",
    projectId: "train-time-3efe9",
    storageBucket: "train-time-3efe9.appspot.com",
    messagingSenderId: "766441275349"
  };
  firebase.initializeApp(config);
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var frequency = "";
let firstArrival = "";
let minutesAway  = "";

//Show and update current time. 
function displayRealTime() {
    setInterval(function(){
        $('#currentTime').html(moment().format('hh:mm A'))
      }, 1000);
    }
    displayRealTime();
//=======================================================================

//Create new train=============================
$("#submitButton").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();
    
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    firstArrival = $("#firstArrival").val().trim();
 
    database.ref('/users').once('value')
        .then((snapshot) => {
            const users = snapshot.val() || [];
            users.push({
                trainName, destination, frequency, firstArrival, 
                // nextArrival: firebase.database.ServerValue.TIMESTAMP
            });
        
            database.ref('/users').set(users);
        
        });
    }); 

database.ref('/users').orderByChild("dateAdded").on("child_added", function (snapshot) {
    const users = snapshot.val();

    var tr = $('<tr>');
    tr.append(`
  <td>${users.trainName}</td>
  <td>${users.destination}</td>
  <td>${users.frequency}</td>
  <td>${users.firstArrival}</td>`)
  
  $('#trainList').append(tr);

var now = moment();
// formats the first train time value stored in the variable of firstTrain
var firstTrainTime = moment.unix(users.firstArrival).format("HH:mm");

// First Time (pushed back 1 year to make sure it comes before current time) 
var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

// the difference between time in minutes   
var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");

var remainder =(diffTime) % (users.frequency);

var minutesAway = Math.abs(users.frequency - remainder);

// minutesAway is added to the current time and stored in the nextArrival variable 
var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");

console.log("The next train arrives at " + nextArrival);

//Next Arrival logs to console, cannot figure out how to get it to log to the html....
var tr = tr.append(`<td>${nextArrival}</td>`)

$('#trainList').append(tr);
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);


});


  



