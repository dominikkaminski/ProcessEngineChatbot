const {DialogContainer} = require('botbuilder-dialogs');
const ConnectionToProcessEngine = require('./../../helpers/ProcessEngine/connectionToProcessEngine.js');
const UserTasksDialog = require('./UserTasksDialog');

class ProcessEngineUserTasks extends DialogContainer {
    constructor(userState) {
        // Dialog ID of 'reserve_table' will start when class is called in the parent
        super('processEngineUserTasks');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('processEngineUserTasks', [
            async function (dc) {
                const user = userState.get(dc.context);
                const url = user.processEngine.url;
                try {
                    const userTasks = await ConnectionToProcessEngine.getAllUserTasksAsArray(url);
                    if (userTasks.length > 0) {
                        await userTasksDialog.onTurn(dc, userTasks);
                    } else {
                        await dc.context.sendActivity('There are no UserTasks...');
                    }
                } catch (err) {
                    console.log(err);
                    await dc.context.sendActivity(`Failed to get UserTasks.`);
                }
                await dc.end();
            },
        ]);

        // Defining the prompt used in this conversation flow
        const userTasksDialog = new UserTasksDialog();
    }
}
exports.ProcessEngineUserTasks = ProcessEngineUserTasks;