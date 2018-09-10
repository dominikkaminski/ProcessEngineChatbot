const {CardFactory} = require('botbuilder');
const jsonGenerator = require('./../../../helpers/AdaptiveCards/jsonGenerator.js');
const jsonGeneratorActionShowCard = require('./../../../helpers/AdaptiveCards/jsonGeneratorActionShowCard.js');
const jsonGeneratorFact = require('./../../../helpers/AdaptiveCards/jsonGeneratorFact');
const jsonGeneratorFactSet = require('./../../../helpers/AdaptiveCards/jsonGeneratorFactSet');


class MainDialog {
    async onTurn(dc, processModels) {
        const speak = jsonGenerator.generateSpeak("Here is a list of ProcessModels.");

        const bodyArray = [];
        const actionArray = [];

        let currentActionSubmit;

        for (let i = 0; i < processModels.length; i++) {
            let facts = [];
            let body = [];

            for (let process in processModels[i]) {

                switch(process) {
                    // Do not display XML in Card
                    case "xml": continue;

                }
                const currentFact = jsonGeneratorFact.generateFact(this.title = process,
                                                                   this.value = processModels[i][process]);
                facts.push(currentFact);
            }
            body.push(jsonGeneratorFactSet.generateFactSet(this.facts = facts));
            currentActionSubmit = jsonGeneratorActionShowCard.generateActionSubmitWithoutAction(this.title = processModels[i]['id'],
                                                                                                this.body = body);
            actionArray.push(currentActionSubmit);
        }

        const card = jsonGenerator.generateCard(this.speak = speak,
            this.body = bodyArray,
            this.actions = actionArray);

        await dc.context.sendActivity({
            text: 'Here are all deployed ProcessModels:',
            attachments: [CardFactory.adaptiveCard(card)]
        });
    }
}

module.exports = MainDialog;