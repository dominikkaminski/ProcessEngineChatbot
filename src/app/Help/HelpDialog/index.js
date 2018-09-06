const {CardFactory} = require('botbuilder');
const jsonGenerator = require('./../../../helpers/AdaptiveCards/jsonGenerator.js');
const jsonGeneratorActionSubmit = require('./../../../helpers/AdaptiveCards/jsonGeneratorActionSubmit.js');


class MainDialog {
    async onTurn(dc, botCapabilities) {
        const speak = jsonGenerator.generateSpeak("Test");

        const bodyArray = [];
        const actionArray = [];

        let currentActionSubmit;

        for (let i = 0; i < botCapabilities.length; i++) {
            currentActionSubmit = jsonGeneratorActionSubmit.generateActionSubmitWithValue(this.title = botCapabilities[i],
                                                                                          this.data = botCapabilities[i]);
            actionArray.push(currentActionSubmit);
        }

        const card = jsonGenerator.generateCard(this.speak = speak,
                                                this.body = bodyArray,
                                                this.actions = actionArray);

        await dc.context.sendActivity({
            text: 'Hello \uD83D\uDC4B - How can I help you?',
            attachments: [CardFactory.adaptiveCard(card)]
        });
    }
}

module.exports = MainDialog;