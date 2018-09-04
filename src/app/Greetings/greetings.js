const { DialogContainer, TextPrompt } = require('botbuilder-dialogs');

class Greetings extends DialogContainer {
    constructor(userState, botCapabilities) {
        // Dialog ID of 'reserve_table' will start when class is called in the parent
        super('greetings');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('greetings', [
            async function (dc, args) {
                const prompt =
`Hello 👋 
\nHow can I help you?
\nAt first you have to connect to a ProcessEngine. You can do this by say 
**Connect to a ProcessEngine**
\nFurther capabilities are:
- ${botCapabilities.slice(1,).toString().replace(",", "<br />- ")}`;
                await dc.prompt('textPrompt',  prompt);
                // End the dialog
                await dc.end();
            },
        ]);

        // Defining the prompt used in this conversation flow
        this.dialogs.add('textPrompt', new TextPrompt());
    }
}
exports.Greetings = Greetings;