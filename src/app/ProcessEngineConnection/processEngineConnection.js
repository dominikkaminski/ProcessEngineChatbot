const {DialogContainer, TextPrompt, ConfirmPrompt} = require('botbuilder-dialogs');
const ConnectionToProcessEngine = require('./../../helpers/ProcessEngine/connectionToProcessEngine.js');
const FindEntities = require('./../../helpers/LUIS/findEntities.js');

class ProcessEngineConnection extends DialogContainer {
    constructor(userState) {
        // Dialog ID of 'checkIn' will start when class is called in the parent
        super('processEngineConnection');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('processEngineConnection', [

            async function (dc, args) {
                // Create a new local processEngine state object
                dc.activeDialog.state.processEngine = {};

                // Check if entities are submitted
                const locations = FindEntities.findEntities('ProcessEngineLocationURL', args.entities);

                // If entities are submitted, save them an continue to next steo
                if (locations !== undefined && locations.length > 0) {
                    dc.activeDialog.state.processEngine.url = locations[0];
                    await dc.continue();
                } else {
                    await dc.context.sendActivity("What is the URL of your ProcessEngine?");
                }
            },
            async function (dc, url){
                let processedUrl;

                if (dc.activeDialog.state.processEngine.url !== undefined) {
                    processedUrl = ProcessEngineConnection.processUrl(dc.activeDialog.state.processEngine.url);
                } else {
                    processedUrl = ProcessEngineConnection.processUrl(url);
                }

                if (processedUrl !== undefined) {
                    // Save the url
                    dc.activeDialog.state.processEngine.url = processedUrl;
                    await dc.prompt('confirmPrompt', `Is ${processedUrl} the URL you want to connect to?`);
                } else {
                    await dc.context.sendActivity(`The URL you provided is invalid. Please provide a valid one!`);
                    await dc.continue();
                }


            },
            async function (dc, response){
                if (response === true) {
                    await dc.context.sendActivity(`Thanks! I'm trying to connect now..`);

                    try {
                        await ConnectionToProcessEngine.getProcessModels(dc.activeDialog.state.processEngine.url);
                    } catch (err) {
                        console.log(err);
                        await dc.context.sendActivity(`Failed to connect, please define an other ProcessEngine URL.`);
                        dc.activeDialog.state.processEngine.url = null;
                        await dc.continue();
                        return;
                    }
                    await dc.context.sendActivity(`Connection successful!`);

                    // Save dialog's state object to the parent's state object
                    const user = userState.get(dc.context);
                    user.processEngine = dc.activeDialog.state.processEngine;

                    await dc.end();
                } else {
                    dc.activeDialog.state.processEngine.url = null;
                    await dc.continue();
                }
            }
        ]);
        // Defining the prompt used in this conversation flow
        this.dialogs.add('textPrompt', new TextPrompt());
        this.dialogs.add('confirmPrompt', new ConfirmPrompt());
    }

    static processUrl(rawUrl) {
        let url = rawUrl;
        const containPort = ProcessEngineConnection.containsPort(url);

        // Remove trailing slash
        if (url.endsWith("/")) {
            url = url.substring(0, -1);
        }

        /* Help the user and format the url for him.
            Wanted: f.e. http://1.2.3.4:8000
         */

        // Given: localhost
        if (url === "localhost") {
            return "http://localhost:8000"
        }

        // Given: f.e. http://localhost
        if ((url.startsWith("http://") || url.startsWith("https://")) && !containPort) {
            return `${url}:8000`;
        }

        // Given f.e. http://localhost:8000
        if ((url.startsWith("http://") || url.startsWith("https://")) && containPort) {
            return url;
        }

        // Given f.e. 1.2.3.4:8000
        if (containPort) {
            return `http://${url}`;
        }

        // Given f.e. 1.2.3.4
        return `http://${url}:8000`;
    }

    static containsPort(url) {
        const regex = /[:](\d{1,5})/g
        return url.match(regex);
    }
}
exports.ProcessEngineConnection = ProcessEngineConnection;
