const request = require('request-promise-native');
const token = 'Bearer ZHVtbXlfdG9rZW4=';

exports.hasProcessEngineAddress = function (userStateContext) {
    return !(userStateContext.processEngine !== undefined && userStateContext.processEngine.url !== undefined);
};

exports.getProcessModels = async function (url) {
    if (url === undefined || typeof url !== "string") {
        console.error("Please provide a string as url for getProcessModels function.");
        return;
    }

    const options = {
        uri: `${url}/api/management/v1/process_models`,
        method: "GET",
        headers: {
            authorization: token,
        },
        json: true,
    };
    return request(options);
};

exports.getUserTask = async function (url, processModelId) {
    if (url === undefined || typeof url !== "string") {
        console.error("Please provide a string as url for getUserTask function.");
        return;
    }
    if (processModelId === undefined || typeof processModelId !== "string") {
        console.error("Please provide a string as processModelId for getUserTask function.");
        return;
    }

    const options = {
        uri: `${url}/api/management/v1/process_models/${processModelId}/user_tasks`,
        method: "GET",
        headers: {
            authorization: token,
        },
        json: true,
    };
    return request(options);
};

exports.getAllUserTasksAsArray = async function (url) {
    if (url === undefined || typeof url !== "string") {
        console.error("Please provide a string as url for getAllUserTasks function.");
        return;
    }
    const userTasks = [];
    const processModelsReq = await this.getProcessModels(url);
    const processModels = processModelsReq['processModels'];

    for (let i = 0; i < processModels.length; i++) {
        const processModelId = processModels[i]['id'];
        const currentUserTaskReq = await this.getUserTask(url, processModelId);
        const currentUserTask = currentUserTaskReq['userTasks'];
        for (let userTask in currentUserTask) {
            const currentUserTaskId = currentUserTask[userTask]['id'];
            userTasks.push(currentUserTaskId);
        }
    }
    return userTasks;
};