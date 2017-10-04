// Initialize Firebase
var config = {
	apiKey: "AIzaSyDQW_Jey4zr_kCpEHROy-DA1d1O9KJYlRE",
	authDomain: "train-time-36f1e.firebaseapp.com",
    databaseURL: "https://train-time-36f1e.firebaseio.com",
    projectId: "train-time-36f1e",
    storageBucket: "train-time-36f1e.appspot.com",
    messagingSenderId: "378576262033"
};
firebase.initializeApp(config);

//Global var
var database = firebase.database().ref("/train-data");
var train={
	name: "",
	destination: "",
	time: 0,
	frequency: 0
};
var time={
	arrival: "",
	minAway: ""
}
function calculateFirstTrain(firstTime, tFrequency){
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    time.minAway = tMinutesTillTrain;
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    time.arrival = nextTrain;
}
function displayTrain(){
	database.on("child_added", function(snapshot){
		calculateFirstTrain(snapshot.val().time, snapshot.val().frequency)
		var row = $("<tr>");
		var colom = $("<td>").text(snapshot.val().name);
		row.append(colom);
		var colom = $("<td>").text(snapshot.val().destination);
		row.append(colom);
		var colom = $("<td>").text(snapshot.val().frequency);
		row.append(colom);
		var colom = $("<td>").text(moment(time.arrival).format(("hh:mmA")));
		row.append(colom);
		var colom = $("<td>").text(time.minAway);
	    //console.log(moment(convertedDate).format("MMM Do, YYYY hh:mm:ss"));
		row.append(colom);
		$("#table-body").append(row);
	})

}
$(document).ready(function(){
	displayTrain();
	$(document).on("click","#submit", function(){
		//Prevent page from refreshing
		event.preventDefault();
		//Store all the train info
		train.name= $("#train-Name").val().trim();
		train.destination= $("#destination").val().trim();
		train.time= $("#train-Time").val().trim();
		train.frequency= $("#frequency").val().trim();
		if(train.name != "" && train.destination != "" && train.time > 0 && train.frequency != 0){
			database.push(train)
			$("#train-Name").val("");
			$("#destination").val("");
			$("#train-Time").val("");
			$("#frequency").val("");
		}
	});
});