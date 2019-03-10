// Initialize Firebase
var config = {
    apiKey: "AIzaSyA3OO-ZJhR7hdegoIFGqV7JweuO9AYjj68",
    authDomain: "train-scheduler-464dc.firebaseapp.com",
    databaseURL: "https://train-scheduler-464dc.firebaseio.com",
    projectId: "train-scheduler-464dc",
    storageBucket: "train-scheduler-464dc.appspot.com",
    messagingSenderId: "326081272920"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#addTrain").on("click", function(event) {
event.preventDefault();

  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var startTime = $("#trainTime").val().trim();
  var frequency = $("#frequency").val().trim();

  //Creates local "temporary" object for holding train data
  var newTrain = {
      name: trainName,
      destination: destination,
      start: startTime,
      frequency: frequency
};
  
  function currentTime() {
    var current = moment().format('LTS');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
  };

  currentTime();

  // Upload new train data
  database.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  alert("Your Train has been added");

  // Clear text boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#startTime").val("");
  $("#frequency").val("");
});
  
  database.ref().on("child_added", function(childSnapshot) {
    var startTimeConverted = moment(childSnapshot.val().start, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    var minToArrival = childSnapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;
  
    var newrow = $("<tr>").append(
    $("<td>" + childSnapshot.val().name + "</td>"),
    $("<td>" + childSnapshot.val().destination + "</td>"),
    $("<td>" + childSnapshot.val().frequency + "</td>"),
    $("<td>" + moment(nextTrain).format("LT") + "</td>"),
    $("<td>" + minToArrival + "</td>")
    );
    // newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));
  
    // if (minToArrival < 6) {
    //   newrow.addClass("info");
    // }
  
    $("#trainTable > tbody").append(newrow);
  });
  
//   $(document).on("click", ".arrival", function() {
//     keyref = $(this).attr("data-key");
//     database.ref().child(keyref).remove();
//     window.location.reload();
//   });
  
  setInterval(function() {
    window.location.reload();
  }, 60000);