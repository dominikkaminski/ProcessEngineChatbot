const { DialogContainer } = require('botbuilder-dialogs');
const ConnectionToProcessEngine = require('./../../helpers/ProcessEngine/connectionToProcessEngine.js');
const ProcessModelsDialog = require('./ProcessModelsDialog');

class ProcessEngineProcessModels extends DialogContainer {
    constructor(userState) {
        // Dialog ID of 'reserve_table' will start when class is called in the parent
        super('processEngineProcessModels');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('processEngineProcessModels', [
            async function (dc) {
                const user = userState.get(dc.context);
                const url = user.processEngine.url;
                try {
                    const body = await ConnectionToProcessEngine.getProcessModels(url);
                    const processModels = body['processModels'];
                    if (processModels.length > 0) {
                        await processModelsDialog.onTurn(dc, processModels);
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
        const processModelsDialog = new ProcessModelsDialog();
    }
}
exports.ProcessEngineProcessModels = ProcessEngineProcessModels;