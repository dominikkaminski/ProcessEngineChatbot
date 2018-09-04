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
                // Save the url
                dc.activeDialog.state.processEngine.url = url;
                await dc.prompt('confirmPrompt', `Is ${url} you want to connect to?`);
            },
            async function (dc, response){
                // Save the room number
                if (response === true) {
                    await dc.context.sendActivity(`Thanks! I'm trying to connect now..`);

                    try {
                        await ProcessEngineConnection.connectToProcessEngine(dc.activeDialog.state.processEngine.url);
                    } catch (err) {
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
     async connectToProcessEngine(url) {
        const options = {
            uri: `http://${url}:8000/api/management/v1/process_models`,
            method: "GET",
            headers: {
                authorization: 'Bearer ZHVtbXlfdG9rZW4=',
            },
            json: true,
        };
        let statusCode = null;
        return request(options);
     }
}
exports.ProcessEngineConnection = ProcessEngineConnection;