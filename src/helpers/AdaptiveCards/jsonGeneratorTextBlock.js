/**
 * Generate a TextBlock Adaptive Card.
 * http://adaptivecards.io/explorer/TextBlock.html
 *
 * @param text: string
 *  The actual text to display
 * @param color: string
 *  Controls the color of TextBlock Item
 *  Allowed values: "default", "dark", "light", "accent", "good", "warning", "attention"
 * @param horizontalAlignment:string
 *  Controls how Items are horizontally positioned within their container.
 *  Allowed values: "left", "center", "right"
 * @param isSubtle: boolean
 *  Indicates whether the color of the text should be slightly toned down to appear less prominent
 * @param maxLines: number
 *  When Wrap is true, you can specify the maximum number of lines to allow the textBlock to use.
 * @param size: string
 *  Controls size of the text.
 *  Allowed values: "small", "default", "medium", "large", "extraLarge"
 * @param weight: string
 *  Controls the weight of TextBlock Items
 *  Allowed values: "lighter", "default", "bolder"
 * @param wrap: boolean
 *  True if be is allowed to wrap
 * @param id: string
 *  A unique Id associated with the element
 * @param spacing: string
 *  Controls the amount of spacing between this element and the previous element.
 *  Allowed values: "none", "small", "default", "medium", "large", "extraLarge", "padding"
 * @param separator: boolean
 *  The Separator object type describes the look and feel of a separation line between two elements.
 * @returns {Array}
 */
exports.generateTextBlock =  function(text,
                                      color,
                                      horizontalAlignment,
                                      isSubtle,
                                      maxLines,
                                      size,
                                      weight,
                                      wrap,
                                      id,
                                      spacing,
                                      separator) {
    let jsonArray = {};

    jsonArray["type"] = "TextBlock";
    jsonArray["text"] = text;

    if (color !== undefined) {
        jsonArray["color"] = color;
    }
    if (horizontalAlignment !== undefined) {
        jsonArray["horizontalAlignment"] = horizontalAlignment;
    }
    if (isSubtle !== undefined) {
        jsonArray["isSubtle"] = isSubtle;
    }
    if (maxLines !== undefined) {
        jsonArray["maxLines"] = maxLines;
    }
    if (size !== undefined) {
        jsonArray["size"] = size;
    }
    if (weight !== undefined) {
        jsonArray["weight"] = weight;
    }
    if (wrap !== undefined) {
        jsonArray["wrap"] = wrap;
    }
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