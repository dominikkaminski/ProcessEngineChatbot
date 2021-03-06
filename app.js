// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const {BotFrameworkAdapter, BotStateSet, ConversationState, UserState} = require("botbuilder");
const {LuisRecognizer} = require("botbuilder-ai");
const {CosmosDbStorage} = require("botbuilder-azure");
const {DialogSet, OAuthPrompt} = require("botbuilder-dialogs");
const restify = require("restify");

const ConnectionToProcessEngine = require('./src/helpers/ProcessEngine/connectionToProcessEngine.js');

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
    appId: process.env.LuisRecognizerAppId,
    // replace subscriptionKey with your Authoring Key
    // your key is at https://www.luis.ai under User settings > Authoring Key
    subscriptionKey: process.env.LuisRecognizerSubscriptionKey,
    // The serviceEndpoint URL begins with "https://<region>.api.cognitive.microsoft.com", where region is the region associated with the key you are using. Some examples of regions are `westus`, `westcentralus`, `eastus2`, and `southeastasia`.
    serviceEndpoint: process.env.LuisRecognizerServiceEndpoint
});
/*
// Create Memory storage
const memoryStorage = new MemoryStorage();

// Create Azure Table storage
const storageAccessKeyAzureTables = "111yn7XgH7NaE6GvAXQDVO4UbCQdN2mosJetD5quck/d/FBDzYT2ZtwR4r0eOFr9L7Ip0vc6gmKXZBfTpWfpvA=="; // Obtain from Azure Portal
const hostAzureTables = "https://processenginebota70b.table.core.windows.net";

const userStorage = new TableStorage({
    tableName: "userStorage",
    storageAccessKey: storageAccessKeyAzureTables,
    host: hostAzureTables
});
*/

// Add state middleware
const conversationCosmosDbStorage = new CosmosDbStorage({
        databaseId: process.env.DatabaseIdCosmosDbStorage,
        collectionId: "conversationStorage",
        authKey: process.env.AuthKeyCosmosDbStorage,
        serviceEndpoint: process.env.ServiceEndpointCosmosDbStorage
     });
const conversationState = new ConversationState(conversationCosmosDbStorage);

const userCosmosDbStorage = new CosmosDbStorage({
    databaseId: process.env.DatabaseIdCosmosDbStorage,
    collectionId: "userStorage",
    authKey: process.env.AuthKeyCosmosDbStorage,
    serviceEndpoint: process.env.ServiceEndpointCosmosDbStorage
});
const userState = new UserState(userCosmosDbStorage);

adapter.use(new BotStateSet(conversationState, userState));
adapter.use(luisRecognizer);

// List all Bot capabilities to guide the user
const botCapabilities = [
    'Connecting to a ProcessEngine',
    'List ProcessModels',
    'List UserTasks',
];

// Listen for incoming requests
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        const isMessage = context.activity.type === 'message';

        // State will store all of your information
        const conversationContext = conversationState.get(context);

        const dc = dialogs.createContext(context, conversationContext);
        // Continue the current dialog if one is currently active
        await dc.continue();

        // Getting the user info from the state
        const userStateContext = userState.get(dc.context);

        if (!context.responded && isMessage) {
            // Retrieve the LUIS results from our LUIS application
            const luisResults = luisRecognizer.get(context);

            // Extract the top intent from LUIS and use it to select which dialog to start
            // "NotFound" is the intent name for when no top intent can be found.
            const topIntent = LuisRecognizer.topIntent(luisResults, "NotFound");

            switch (topIntent) {
                case "ProcessEngineConnection": {
                    if (ConnectionToProcessEngine.hasProcessEngineAddress(userStateContext)) {
                        await dc.context.sendActivity('I have understood, that you want to connect to a ProcessEngine.');
                        await dc.begin('processEngineConnectionPrompt', luisResults);
                    } else {
                        await dc.context.sendActivity(`You are already connected to ${userStateContext.processEngine.url}.`);
                    }
                    break;
                }

                case "ProcessEngineProcessModels": {
                    if (ConnectionToProcessEngine.hasProcessEngineAddress(userStateContext)) {
                        await dc.context.sendActivity('I have understood, that you want to list your ProcessModels. \n\nBut first, you have to connect to a ProcessEngine.');
                        await dc.begin('processEngineConnectionPrompt');
                    } else {
                        await dc.begin('processEngineProcessModelsPrompt');
                    }
                    break;
                }

                case "ProcessEngineUserTasks": {
                    if (ConnectionToProcessEngine.hasProcessEngineAddress(userStateContext)) {
                        await dc.context.sendActivity('I have understood, that you want to list your UserTasks. \n\nBut first, you have to connect to a ProcessEngine.');
                        await dc.begin('processEngineConnectionPrompt');
                    } else {
                        await dc.begin('processEngineUserTasksPrompt');
                    }
                    break;
                }

                case "Greetings": {
                    await dc.begin('greetingsPrompt');
                    break;
                }

                case "Login": {
                    await dc.begin('loginPrompt');
                    break;
                }

                case "Logout": {
                    await adapter.signOutUser(context, 'IdentityServerv4');
                    break;
                }

                case "Help": {
                    await dc.begin('helpPrompt');
                    break;
                }

                default: {
                    if (ConnectionToProcessEngine.hasProcessEngineAddress(userStateContext)) {
                        await dc.context.sendActivity(`I did not understand 😟\n\n Your are not connected to a ProcessEngine.\n If you want to connect to one, please say 'Connect to a ProcessEngine'.`);
                    } else {
                        await dc.context.sendActivity(`I did not understand 😟 \n\n Please ask for help.`);
                    }
                    break;
                }
            }
        }
    });

});
const dialogs = new DialogSet();

// Importing the dialogs
const processEngineConnection = require("./src/app/ProcessEngineConnection/processEngineConnection");
dialogs.add('processEngineConnectionPrompt', new processEngineConnection.ProcessEngineConnection(userState));

const processEngineProcessModels = require("./src/app/ProcessEngineProcessModels/processEngineProcessModels");
dialogs.add('processEngineProcessModelsPrompt', new processEngineProcessModels.ProcessEngineProcessModels(userState));

const processEngineUserTasks = require("./src/app/ProcessEngineUserTasks/processEngineUserTasks");
dialogs.add('processEngineUserTasksPrompt', new processEngineUserTasks.ProcessEngineUserTasks(userState));

const greetings = require("./src/app/Greetings/greetings");
dialogs.add('greetingsPrompt', new greetings.Greetings(userState, botCapabilities));

const help = require("./src/app/Help/help");
dialogs.add('helpPrompt', new help.Help(userState, botCapabilities));

const login = require("./src/app/Login/login");
dialogs.add('loginPrompt', new login.Login(userState, botCapabilities));