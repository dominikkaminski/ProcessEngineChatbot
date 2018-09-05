const {MessageFactory} = require("botbuilder");
const {DialogContainer, TextPrompt} = require('botbuilder-dialogs');

class Help extends DialogContainer {
    constructor(userState, botCapabilities) {
        // Dialog ID of 'reserve_table' will start when class is called in the parent
        super('help');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('help', [
            async function (dc, args) {
                // List all Bot capabilities to guide the user


                await dc.prompt('textPrompt', 'Hello 👋 \n\nHow can I help you?');
                await dc.context.sendActivity(MessageFactory.suggestedActions(botCapabilities));
            },
            async function(dc, choice){
                switch(choice){
                    case "Connecting to a ProcessEngine":
                        await dc.replace('processEngineConnectionPrompt');
                        break;
                    default:
                        await dc.context.sendActivity("Sorry, i don't understand that command. Please choose an option from the list below.");
                        break;
                }
            }
        ]);

        // Defining the prompt used in this conversation flow
        this.dialogs.add('textPrompt', new TextPrompt());

        const processEngineConnection = require("./../ProcessEngineConnection/processEngineConnection");
        this.dialogs.add('processEngineConnectionPrompt', new processEngineConnection.ProcessEngineConnection(userState));

    }
}
exports.Help = Help;