exports.generateHeader = function() {
    return {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
    };
};
exports.generateSpeak = function(speak) {
    return {
        "speak": speak,
    };
};
exports.generateBody = function(body) {
    return {
        "body": body,
    };
};
exports.generateActions = function(actions) {
    return {
        "actions": actions,
    };
};
exports.generateCard = function(speak,
                                body,
                                actions) {
    const header = this.generateHeader();
    let jsonString = "";

    jsonString += "{";
    jsonString += `${JSON.stringify(header).slice(1, -1)} `;

    if (speak !== undefined) {
        jsonString += `,${JSON.stringify(speak).slice(1, -1)} `;
    }
    if (body !== undefined) {
        const body_generated = this.generateBody(body);
        jsonString += `,${JSON.stringify(body_generated).slice(1, -1)}`;
    }
    if (actions !== undefined) {
        const actions_generated = this.generateActions(actions);
        jsonString += `,${JSON.stringify(actions_generated).slice(1, -1)}`;
    }
    jsonString += "}";
    //console.log(jsonString);
    return JSON.parse(jsonString);
};