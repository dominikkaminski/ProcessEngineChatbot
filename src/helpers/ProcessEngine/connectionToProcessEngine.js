const request = require('request-promise-native');

exports.getProcessModels = function async(url) {
    const options = {
        uri: `${url}/api/management/v1/process_models`,
        method: "GET",
        headers: {
            authorization: 'Bearer ZHVtbXlfdG9rZW4=',
        },
        json: true,
    };
    return request(options);
};
