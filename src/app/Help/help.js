const {DialogContainer} = require('botbuilder-dialogs');
const HelpDialog = require('./HelpDialog');

class Help extends DialogContainer {
    constructor(userState, botCapabilities) {
        super('help');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('help', [
            async function (dc) {
                await helpDialog.onTurn(dc, botCapabilities);
            },
        ]);

        // Defining the prompt used in this conversation flow
        const helpDialog = new HelpDialog();
    }
}
exports.Help = Help;