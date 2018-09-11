/**
 * Generate a Submit Action Adaptive Card.
 * http://adaptivecards.io/explorer/Action.Submit.html
 * @param title: string
 * Label for button or link that represents this action
 * @param body: JSONArray
 * Contains the hidden text.
 */
exports.generateActionSubmitWithoutAction = function(title,
                                                     body) {
    let jsonArray = {};

    jsonArray["type"] = "Action.ShowCard";
    jsonArray["title"] = title;

    if (body !== undefined) {
        jsonArray["card"] = {
            "type": "AdaptiveCard",
            "body": body,
        };
    }
    return jsonArray;
};