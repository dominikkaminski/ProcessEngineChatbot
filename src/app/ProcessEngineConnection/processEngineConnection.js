const { DialogContainer, TextPrompt, ConfirmPrompt } = require('botbuilder-dialogs');
const request = require('request-promise-native');


class ProcessEngineConnection extends DialogContainer {
    constructor(userState) {
        // Dialog ID of 'checkIn' will start when class is called in the parent
        super('processEngineConnection');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('processEngineConnection', [
            async function (dc) {
                // Create a new local processEngine state object
                dc.activeDialog.state.processEngine = {};
                await dc.context.sendActivity("What is the URL of your ProcessEngine?");
            },
            async function (dc, url){
                const processedUrl = ProcessEngineConnection.processUrl(url);

                if (processedUrl !== undefined) {
                    // Save the url
                    dc.activeDialog.state.processEngine.url = processedUrl;
                    await dc.prompt('confirmPrompt', `Is ${processedUrl} th URL you want to connect to?`);
                } else {
                    await dc.context.sendActivity(`The URL you provided is invalid. Pleas provice a valid one!`);
                    await dc.continue();
                }


            },
            async function (dc, response){
                // Save the room number
                if (response === true) {
                    await dc.context.sendActivity(`Thanks! I'm trying to connect now..`);

                    try {
                        await ProcessEngineConnection.connectToProcessEngine(dc.activeDialog.state.processEngine.url);
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
    static async connectToProcessEngine(url) {
        const options = {
            uri: `${url}/api/management/v1/process_models`,
            method: "GET",
            headers: {
                authorization: 'Bearer ZHVtbXlfdG9rZW4=',
            },
            json: true,
        };
        return request(options);
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
