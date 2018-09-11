const {CardFactory} = require('botbuilder');
const jsonGenerator = require('./../../../helpers/AdaptiveCards/jsonGenerator.js');
const jsonGeneratorActionShowCard = require('./../../../helpers/AdaptiveCards/jsonGeneratorActionShowCard.js');
const jsonGeneratorFact = require('./../../../helpers/AdaptiveCards/jsonGeneratorFact');
const jsonGeneratorFactSet = require('./../../../helpers/AdaptiveCards/jsonGeneratorFactSet');


class MainDialog {
    async onTurn(dc, userTasks) {
        const bodyArray = [];
        const actionArray = [];
        let speakString = "";

        let currentActionSubmit;

        for (let i = 0; i < userTasks.length; i++) {
            let body = [];
            speakString += `${userTasks[i]}, `;
            currentActionSubmit = jsonGeneratorActionShowCard.generateActionSubmitWithoutAction(this.title = userTasks[i],
                this.body = body);
            actionArray.push(currentActionSubmit);
        }
        speakString = speakString.slice(0,-2);
        const speak = jsonGenerator.generateSpeak(`Following user tasks are waiting on user input: ${speakString}`);

        const card = jsonGenerator.generateCard(this.speak = speak,
            this.body = bodyArray,
            this.actions = actionArray);

        await dc.context.sendActivity({
            text: 'Here are all waiting UserTasks:',
            attachments: [CardFactory.adaptiveCard(card)]
        });
    }
}

module.exports = MainDialog;