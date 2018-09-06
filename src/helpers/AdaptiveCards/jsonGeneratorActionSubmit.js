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
exports.generateActionSubmitWithValue = function(title,
                                                 data) {
    let jsonArray = {};

    jsonArray["type"] = "Action.Submit";
    jsonArray["title"] = title;

    const data_value = {
        "value": data,
    };
    if (data !== undefined) {
        jsonArray["data"] = data;
    }
    return jsonArray;
};