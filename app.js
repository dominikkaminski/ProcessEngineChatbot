// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const {LuisRecognizer} = require ("botbuilder-ai");

const {BotFrameworkAdapter, ConversationState, UserState, BotStateSet, MessageFactory, MemoryStorage} = require("botbuilder");
const {DialogSet} = require("botbuilder-dialogs");
const restify = require("restify");
var azure = require('botbuilder-azure');

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Create model
const luisRecognizer = new LuisRecognizer({
    // This appID is for a public app that's made available for demo purposes
    // You can use it by providing your LUIS subscription key
    appId: '0437a628-00e8-476e-a172-dcbc573994f3',
    // replace subscriptionKey with your Authoring Key
    // your key is at https://www.luis.ai under User settings > Authoring Key
    subscriptionKey: '0ce7760643bd4d6a81e3229e5bfd471d',
    // The serviceEndpoint URL begins with "https://<region>.api.cognitive.microsoft.com", where region is the region associated with the key you are using. Some examples of regions are `westus`, `westcentralus`, `eastus2`, and `southeastasia`.
    serviceEndpoint: 'https://westus.api.cognitive.microsoft.com'
});

// Add state middleware
const storage = new MemoryStorage();
const convoState = new ConversationState(storage);
const userState = new UserState(storage);

adapter.use(new BotStateSet(convoState, userState));
adapter.use(luisRecognizer);

// Listen for incoming requests
/**server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context) => {
        const isMessage = context.activity.type === 'message';

        // Create dialog context
        const state = conversationState.get(context);
        const dc = dialogs.createContext(context, state);

        if (!isMessage) {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }

        // Check to see if anyone replied.
        if (!context.responded) {
            await dc.continue();
            // if the dialog didn't send a response
            if (!context.responded && isMessage) {


                await luisRecognizer.recognize(context).then(async () =>
                    {
                        // Retrieve the LUIS results from our LUIS application
                        const luisResults = luisRecognizer.get(context);

                        // Extract the top intent from LUIS and use it to select which dialog to start
                        // "NotFound" is the intent name for when no top intent can be found.
                        const topIntent = LuisRecognizer.topIntent(luisResults, "NotFound");

                        switch (topIntent)
                        {
                            case "ProcessEngineConnection": {
                                await context.sendActivity("Top intent is ProcessEngineConnection ");
                                await dc.begin('reserveTable', luisResults);
                                break;
                            }

                            case "Greetings": {
                                await context.sendActivity("Top intent is Greeting");
                                break;
                            }

                            default: {
                                await dc.begin('default', topIntent);
                                break;
                            }
                        }

                    }, (err) => {
                        // there was some error
                        console.log(err);
                    }
                );
            }
        }
    });
}); **/

// Listen for incoming requests
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        const isMessage = context.activity.type === 'message';

        // State will store all of your information
        const convo = convoState.get(context);
        const user = userState.get(context); // userState will not be used in this example

        const dc = dialogs.createContext(context, convo);
        // Continue the current dialog if one is currently active
        await dc.continue();

        // Getting the user info from the state
        const userinfo = userState.get(dc.context);

        if (!context.responded && isMessage) {
            // Retrieve the LUIS results from our LUIS application
            const luisResults = luisRecognizer.get(context);

            // Extract the top intent from LUIS and use it to select which dialog to start
            // "NotFound" is the intent name for when no top intent can be found.
            const topIntent = LuisRecognizer.topIntent(luisResults, "NotFound");

            switch (topIntent)
            {
                case "ProcessEngineConnection": {
                    if(!userinfo.processEngine || !userinfo.processEngine.url){
                        await dc.begin('processEngineConnectionPrompt');
                    }else{
                        await dc.context.sendActivity(`You are already connected to ${userinfo.processEngine.url}.`);
                    }
                    break;
                }

                case "Greetings": {
                    await dc.context.sendActivity("Top intent is Greeting");
                    break;
                }

                default: {
                    if(!userinfo.processEngine){
                        await dc.context.sendActivity(`Hello 👋 \n\n Your are not connected to a ProcessEngine.\n If you want to connect to one, please say 'Connect to a ProcessEngine'.`);
                    }else{
                        await dc.context.sendActivity(`Hello 👋`);
                    }
                    break;
                }
            }
        };
    });
});
const dialogs = new DialogSet();
dialogs.add('mainMenu', [
    async function (dc, args) {
        const menu = ["Reserve Table", "Wake Up"];
        await dc.context.sendActivity(MessageFactory.suggestedActions(menu));
    },
    async function (dc, result){
        // Decide which module to start
        switch(result){
            case "Reserve Table":
                await dc.begin('reservePrompt');
                break;
            case "Wake Up":
                await dc.begin('checkInPrompt');
                break;
            default:
                await dc.context.sendActivity("Sorry, i don't understand that command. Please choose an option from the list below.");
                break;
        }
    },
    async function (dc, result){
        await dc.replace('mainMenu'); // Show the menu again
    }

]);

// Importing the dialogs
const processEngineConnection = require("./src/ProcessEngineConnection/processEngineConnection");
dialogs.add('processEngineConnectionPrompt', new processEngineConnection.ProcessEngineConnection(userState));

const reserve_table = require("./src/Greetings/greetings");
dialogs.add('reservePrompt', new reserve_table.ReserveTable(userState));
