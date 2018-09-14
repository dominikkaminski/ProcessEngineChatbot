const { DialogContainer, OAuthPrompt } = require('botbuilder-dialogs');

class Login extends DialogContainer {
    constructor(userState) {
        // Dialog ID of 'reserve_table' will start when class is called in the parent
        super('login');

        // Defining the conversation flow using a waterfall model
        this.dialogs.add('login', [
            async function (dc) {
                await dc.begin('loginPrompt');
            },
            async function (dc, token) {
                if (token) {
                    // Continue with task needing access token
                    const user = userState.get(dc.context);
                    user.token = token.token;
                    await dc.context.sendActivity(`Your token is: ` + token.token);
                    await dc.end();
                } else {
                    await dc.context.sendActivity(`Sorry... We couldn't log you in. Try again later.`);
                    await dc.end();
                }
            },
        ]);

        // Defining the prompt used in this conversation flow
        this.dialogs.add('loginPrompt', new OAuthPrompt({
            connectionName: 'IdentityServerv4',
            text: "Please Sign In",
            title: "Sign In",
            timeout: 300000        // User has 5 minutes to login
        }));
    }
}
exports.Login = Login;