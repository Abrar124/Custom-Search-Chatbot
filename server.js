const express = require("express");
const bodyParser = require("body-parser");
const { Card, Suggestion } = require("dialogflow-fulfillment");
var request = require("request");

const { WebhookClient } = require("dialogflow-fulfillment");
const expressApp = express().use(bodyParser.json());

expressApp.post("/webhook", function (request, response, next) {
    const agent = new WebhookClient({ request: request, response: response });

    function welcome(agent) {
        agent.add(`Welcome to custom search.`);
        agent.add(`What can I search for you today?`);

    }

    function Search(agent) {
        const Question = agent.parameters.question;
        console.log("Question is:", Question);
        const linkUrl = "http://google.com/search?q=";
        const linkUrl1 = linkUrl + Question;
        // agent.add(`Your search results is: ${Question}`);
        agent.add(new Suggestion(`Basic room`));
        agent.add(new Suggestion(`Standard room`));
        // agent.add(
        //     new Card({
        //         title: `${Question}`,
        //         buttonText: "Click to see the results",
        //         buttonUrl: linkUrl1
        //     })
        // );

        console.log("Results Successfull");

    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }
    let intentMap = new Map();
    intentMap.set("Search", Search);
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    agent.handleRequest(intentMap);

});
expressApp.listen(process.env.PORT || 3000, function () {
    console.log("app is running in 3000");
});