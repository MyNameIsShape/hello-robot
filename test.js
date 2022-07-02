//hellorobot / test.js
//Ask the robot for the server status
var hellorobot = require("./index.js");
var run = async function() {
	//console.log(hellorobot);
	var msg = await hellorobot.run("server status")
	console.log(msg.answer);
}
run();