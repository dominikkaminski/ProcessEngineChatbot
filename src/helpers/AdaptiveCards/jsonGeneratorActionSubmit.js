/**
 * Generate a Submit Action Adaptive Card.
 * http://adaptivecards.io/explorer/Action.Submit.html
 * @param title: string
 * Label for button or link that represents this action
 * @param data: object
 * Initial data that input fields will be combined with. This is essentially 'hidden' properties
 */
exports.generateActionSubmit = function(title,
                                        data) {
    let jsonArray = {};

    jsonArray["type"] = "Action.Submit";
    jsonArray["title"] = title;

    if (data !== undefined) {
        jsonArray["data"] = data;
    }
    return jsonArray;
};