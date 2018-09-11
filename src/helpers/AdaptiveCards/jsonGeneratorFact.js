/**
 * Describes a Fact in a FactSet as a key/value pair
 * http://adaptivecards.io/explorer/Fact.html
 * @param title: string
 * The title of the fact
 * @param value: string
 * The value of the fact
 */
exports.generateFact = function(title,
                                value) {
    let processed_value = value;

    if (typeof value === "object") {
        processed_value = JSON.stringify(value)
    }

    return {
        "title": title,
        "value": processed_value
    };
};