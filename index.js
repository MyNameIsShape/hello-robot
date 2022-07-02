//hello-robot npm package

//Load nlp.js (natural language processing
const { NlpManager } = require('node-nlp');

//Set up your package!
module.exports = {};

module.exports.initialized = false;
module.exports.isReady = false;

//hellorobot.init
//  returns a promise that resolves to the trained chat model
module.exports.init = function() {
	
	module.exports.initialized = true;
	
	//Instantiate the NLP manager
	module.exports.manager = new NlpManager({ languages: ['en'], forceNER: true, nlu: { log: false } });
	
	// Adds intents
	module.exports.manager.addDocument('en', 'server initialization status', 'server.status');
	module.exports.manager.addDocument('en', 'server status', 'server.status');
	
	module.exports.manager.addDocument('en', 'goodbye', 'server.status');
	module.exports.manager.addDocument('en', 'bye bye', 'greetings.bye');
	module.exports.manager.addDocument('en', 'see you later', 'greetings.bye');
	module.exports.manager.addDocument('en', 'hello', 'greetings.hello');
	module.exports.manager.addDocument('en', 'hi', 'greetings.hello');
	module.exports.manager.addDocument('en', 'greetings', 'greetings.hello');

	// Add Answers
	module.exports.manager.addAnswer('en', 'server.status', 'The server is ready.');	
	module.exports.manager.addAnswer('en', 'greetings.bye', 'Goodbye.');
	module.exports.manager.addAnswer('en', 'greetings.bye', 'See you, code cowboy.');
	module.exports.manager.addAnswer('en', 'greetings.hello', 'Hey!');
	module.exports.manager.addAnswer('en', 'greetings.hello', 'Greetings!');
	
	
	// Return the promise and yield to Async code
	return new Promise(async function(resolve) {
		await module.exports.manager.train();
		module.exports.manager.save();
		var msg = "Model not ready.";
		msg = await module.exports.manager.process('en', 'server initialization status');
		//console.log("Model ready.");
		module.exports.isReady = true;
		resolve(msg);
	});
		
}

//hellorobot.run
  //Takes an input string and returns a promise for an answer string from the model
module.exports.run = function(input) {
	return new Promise(
		async function(resolve) {
		if(!module.exports.isReady) { 
			if(!module.exports.initialized) {
				module.exports.initialized = true;
				await module.exports.init();
			}
			await module.exports.isReady == true;
		}
		const resp = module.exports.manager.process(this.input);
		resolve(resp);
	}.bind({input: input})
	);
}

//hellorobot.test
  //Runs a unit test.  
module.exports.test = async function() {
	
	var msg = await module.exports.run("server status")
	console.log(msg.answer);
}