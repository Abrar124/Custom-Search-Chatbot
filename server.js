const express = require("express");
const bodyParser = require("body-parser");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { Payload } = require('dialogflow-fulfillment');
const { BasicCard, Button, Image } = require('actions-on-google');
const { LinkOutSuggestion } = require('actions-on-google')
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
        const link = "http://google.com/search?q=";
        const linkUrl = link + Question;
        // agent.add(`Your search results is: ${Question}`);


        let payload = {
            "richContent": [
                [
                  {
                    "type": "button",
                    "icon": {
                      "type": "chevron_right",
                      "color": "#FF9800"
                    },
                    "text": "Button text",
                    "link": "https://example.com",
                    "event": {
                      "name": "",
                      "languageCode": "",
                      "parameters": {}
                    }
                  }
                ]
              ]
        }
    
        agent.add(new Payload(agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }))
    
        // let params = {
        //     current_intent_name: "Search"
        // }
    
        // Context.setContext(agent, params)


        
        // agent.requestSource = agent.ACTIONS_ON_GOOGLE;
        // const conv = agent.conv();
        // conv.ask('Here are the results for your question:');
        // conv.ask(`${Question}`);
        // conv.ask(
        //     new LinkOutSuggestion({
        //         name: 'Click to see the results',
        //         url: linkUrl
        //     })
        // );
        // agent.add(conv);

        // console.log("Results Successfull");

    }

    function fallback(agent) {
        const Question = agent.parameters.question;
        console.log("Question is:", Question);
        const link = "http://google.com/search?q=";
        const linkUrl = link + Question;

        agent.requestSource = agent.ACTIONS_ON_GOOGLE;
        const conv = agent.conv();
        conv.ask('Here are the results for your question:');
        conv.ask(`${Question}`);
        conv.ask(
            new LinkOutSuggestion({
                name: 'Click to see the results',
                url: linkUrl
            })
        );
        agent.add(conv);

        console.log("Results Successfull");
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