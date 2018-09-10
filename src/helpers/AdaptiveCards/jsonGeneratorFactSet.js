/**
 * The FactSet Item makes it simple to display a series of facts (e.g. name/value pairs) in a tabular form.
 * http://adaptivecards.io/explorer/FactSet.html
 * @param facts: JSONArray
 * The array of Facts
 * @param id: string
 * A unique Id associated with the element
 * @param spacing: string
 * Controls the amount of spacing between this element and the previous element.
 * @param separator: boolean
 * 	The Separator object type describes the look and feel of a separation line between two elements.
 */
exports.generateFactSet = function(facts,
                                   id,
                                   spacing,
                                   separator) {
    let jsonArray = {};

    jsonArray["type"] = "FactSet";
    jsonArray["facts"] = facts;

    if (id !== undefined) {
        jsonArray["id"] = id;
    }
    if (spacing !== undefined) {
        jsonArray["spacing"] = spacing;
    }
    if (separator !== undefined) {
        jsonArray["separator"] = separator;
    }

    return jsonArray;
};