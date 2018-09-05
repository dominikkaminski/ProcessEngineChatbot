const { DialogContainer, TextPrompt } = require('botbuilder-dialogs');
const ConnectionToProcessEngine = require('./../../helpers/ProcessEngine/connectionToProcessEngine.js');

class ProcessEngineProcessModels extends DialogContainer {
    constructor(userState) {
        // Dialog ID of 'reserve_table' will start when class is called in the parent
        super('processEngineProcessModels');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('processEngineProcessModels', [
            async function (dc, args) {
                const user = userState.get(dc.context);
                const url = user.processEngine.url;
                try {
                    const body = await ConnectionToProcessEngine.getProcessModels(url);
                    const processModels = body['processModels'];
                    if (processModels.length > 0) {
                        let listOfProcessModelIDs = "**Deployed ProcessModes:**";
                        for (let i = 0; i < processModels.length; i++) {
                            listOfProcessModelIDs += `\n- ${processModels[i]['id']}`;
                        }
                        await dc.context.sendActivity(listOfProcessModelIDs);
                    } else {
                        await dc.context.sendActivity('There are no ProcessModels...');
                    }
                } catch (err) {
                    console.log(err);
                    await dc.context.sendActivity(`Failed to get ProcessModels.`);
                }
                await dc.end();
            },
        ]);

        // Defining the prompt used in this conversation flow
        this.dialogs.add('textPrompt', new TextPrompt());
    }
}
exports.ProcessEngineProcessModels = ProcessEngineProcessModels;