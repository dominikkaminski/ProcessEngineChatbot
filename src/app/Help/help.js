const {DialogContainer, TextPrompt, ChoicePrompt} = require('botbuilder-dialogs');

class Help extends DialogContainer {
    constructor(userState, botCapabilities) {
        // Dialog ID of 'reserve_table' will start when class is called in the parent
        super('help');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('help', [
            async function (dc, args) {
                // List all Bot capabilities to guide the user


                await dc.prompt('choicePrompt', 'Hello 👋 \n\nHow can I help you?', botCapabilities);
            },
            async function(dc, choice){
                switch(choice.value){
                    case "Connecting to a ProcessEngine":
                        await dc.begin('processEngineConnectionPrompt');
                        break;
                    case "Show ProcessModels":
                        if(!userState.get(dc.context).processEngine || !userState.get(dc.context).processEngine.url){
                            await dc.context.sendActivity('I have understood, that you want to list your ProcessModels. \n\nBut first, you have to connect to a ProcessEngine.');
                            await dc.begin('processEngineConnectionPrompt');
                        } else {
                            await dc.begin('processEngineProcessModelsPrompt');
                        }
                        break;
                    default:
                        await dc.context.sendActivity("Sorry, i don't understand that command. Please choose an option from the list below.");
                        break;
                }
            }
        ]);

        // Defining the prompt used in this conversation flow
        this.dialogs.add('textPrompt', new TextPrompt());
        this.dialogs.add('choicePrompt', new ChoicePrompt());

        const processEngineConnection = require("./../ProcessEngineConnection/processEngineConnection");
        this.dialogs.add('processEngineConnectionPrompt', new processEngineConnection.ProcessEngineConnection(userState));

        const processEngineProcessModels = require("./../ProcessEngineProcessModels/processEngineProcessModels");
        this.dialogs.add('processEngineProcessModelsPrompt', new processEngineProcessModels.ProcessEngineProcessModels(userState));

    }
}
exports.Help = Help;