/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

import * as msRest from "ms-rest-js";
import * as Models from "botframework-schema";
import * as Mappers from "./generated/models/mappers";
import { ConnectorClient } from "./generated/connectorClient";
import { MicrosoftAppCredentials } from "./auth/microsoftAppCredentials";

const WebResource = msRest.WebResource;

/** Exposes methods for calling the channels OAuth Methods. */
export class OAuthApiClient {
  private readonly client: ConnectorClient;
  /**
   * Create a Conversations.
   * @param {ConnectorClient} client Reference to the service client.
   */
  constructor(client: ConnectorClient) {
    this.client = client;
  }

  /**
   * @summary GetUserToken
   *
   * Attempts to retrieve the token for a user that's in a signin flow.
   * 
   * @param {string} userId Id of the user being authenticated.
   *
   * @param {string} connectionName Name of the auth connection to use.
   *
   * @param {string} [magicCode] Optional user entered code to validate.
   *
   * @param {RequestOptionsBase} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  async getUserTokenWithHttpOperationResponse(userId: string, connectionName: string, magicCode?: string, options?: msRest.RequestOptionsBase): Promise<msRest.HttpOperationResponse> {
    let client = this.client;

    // Construct URL
    let baseUrl = this.client.baseUri;
    let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + `api/usertoken/GetToken`;
    let queryParamsArray: Array<any> = [];
    queryParamsArray.push('userId=' + encodeURIComponent(userId));
    queryParamsArray.push('connectionName=' + encodeURIComponent(connectionName));
    if (magicCode !== null && magicCode !== undefined) {
      queryParamsArray.push('code=' + encodeURIComponent(magicCode));
    }
    requestUrl += '?' + queryParamsArray.join('&');

    // Create HTTP transport objects
    let httpRequest = new WebResource();
    httpRequest.method = 'GET';
    httpRequest.url = requestUrl;
    httpRequest.headers = {};
    // Set Headers
    httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
    if(options && options.customHeaders) {
        for(let headerName in options.customHeaders) {
          if (options.customHeaders.hasOwnProperty(headerName)) {
            httpRequest.headers[headerName] = options.customHeaders[headerName];
          }
        }
      }
  
    // Send Request
    let operationRes: msRest.HttpOperationResponse;
    try {
      operationRes = await client.pipeline(httpRequest);
      let response = operationRes.response;
      let statusCode = response.status;
      if (statusCode !== 200) {
        let error = new msRest.RestError(operationRes.bodyAsText as string);
        error.statusCode = response.status;
        error.request = msRest.stripRequest(httpRequest);
        error.response = msRest.stripResponse(response);
        let parsedErrorResponse = operationRes.bodyAsJson as { [key: string]: any };
        try {
          if (parsedErrorResponse) {
            let internalError = null;
            if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
            error.code = internalError ? internalError.code : parsedErrorResponse.code;
            error.message = internalError ? internalError.message : parsedErrorResponse.message;
          }
          if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
            let resultMapper = Mappers.ErrorResponse;
            error.body = client.serializer.deserialize(resultMapper, parsedErrorResponse, 'error.body');
          }
        } catch (defaultError) {
          error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                           `- "${operationRes.bodyAsText}" for the default response.`;
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
      // Deserialize Response
      if (statusCode === 200) {
        let parsedResponse = operationRes.bodyAsJson as { [key: string]: any };
        try {
          if (parsedResponse !== null && parsedResponse !== undefined) {
            let resultMapper = Mappers.ConversationsResult;
            operationRes.bodyAsJson = client.serializer.deserialize(resultMapper, parsedResponse, 'operationRes.bodyAsJson');
          }
        } catch (error) {
          let deserializationError = new msRest.RestError(`Error ${error} occurred in deserializing the responseBody - ${operationRes.bodyAsText}`);
          deserializationError.request = msRest.stripRequest(httpRequest);
          deserializationError.response = msRest.stripResponse(response);
          return Promise.reject(deserializationError);
        }
      }

    } catch(err) {
      return Promise.reject(err);
    }

    return Promise.resolve(operationRes);
  }

  /**
   * @summary SignOutUser
   *
   * Signs the user out with the token server.
   *
   * @param {string} userId Id of the user to sign out.
   *
   * @param {string} connectionName Name of the auth connection to use.
   *
   * @param {RequestOptionsBase} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  async signOutUserWithHttpOperationResponse(userId: string, connectionName: string, options?: msRest.RequestOptionsBase): Promise<msRest.HttpOperationResponse> {
    let client = this.client;

    // Construct URL
    let baseUrl = this.client.baseUri;
    let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + `api/usertoken/SignOut`;
    let queryParamsArray: Array<any> = [];
    queryParamsArray.push('userId=' + encodeURIComponent(userId));
    queryParamsArray.push('connectionName=' + encodeURIComponent(connectionName));
    requestUrl += '?' + queryParamsArray.join('&');

    // Create HTTP transport objects
    let httpRequest = new WebResource();
    httpRequest.method = 'DELETE';
    httpRequest.url = requestUrl;
    httpRequest.headers = {};
    // Set Headers
    httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
    if(options && options.customHeaders) {
        for(let headerName in options.customHeaders) {
          if (options.customHeaders.hasOwnProperty(headerName)) {
            httpRequest.headers[headerName] = options.customHeaders[headerName];
          }
        }
      }
  
    // Send Request
    let operationRes: msRest.HttpOperationResponse;
    try {
      operationRes = await client.pipeline(httpRequest);
      let response = operationRes.response;
      let statusCode = response.status;
      if (statusCode !== 200) {
        let error = new msRest.RestError(operationRes.bodyAsText as string);
        error.statusCode = response.status;
        error.request = msRest.stripRequest(httpRequest);
        error.response = msRest.stripResponse(response);
        let parsedErrorResponse = operationRes.bodyAsJson as { [key: string]: any };
        try {
          if (parsedErrorResponse) {
            let internalError = null;
            if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
            error.code = internalError ? internalError.code : parsedErrorResponse.code;
            error.message = internalError ? internalError.message : parsedErrorResponse.message;
          }
          if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
            let resultMapper = Mappers.ErrorResponse;
            error.body = client.serializer.deserialize(resultMapper, parsedErrorResponse, 'error.body');
          }
        } catch (defaultError) {
          error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                           `- "${operationRes.bodyAsText}" for the default response.`;
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
      // Deserialize Response
      if (statusCode === 200) {
        let parsedResponse = operationRes.bodyAsJson as { [key: string]: any };
        try {
          if (parsedResponse !== null && parsedResponse !== undefined) {
            let resultMapper = Mappers.ConversationsResult;
            operationRes.bodyAsJson = client.serializer.deserialize(resultMapper, parsedResponse, 'operationRes.bodyAsJson');
          }
        } catch (error) {
          let deserializationError = new msRest.RestError(`Error ${error} occurred in deserializing the responseBody - ${operationRes.bodyAsText}`);
          deserializationError.request = msRest.stripRequest(httpRequest);
          deserializationError.response = msRest.stripResponse(response);
          return Promise.reject(deserializationError);
        }
      }

    } catch(err) {
      return Promise.reject(err);
    }

    return Promise.resolve(operationRes);
  }

  /**
   * @summary GetSignInLink
   *
   * Gets a signin link from the token server that can be sent as part of a SigninCard. 
   *
   * @param {Models.ConversationReference} conversation conversation reference for the user signing in.
   *
   * @param {string} connectionName Name of the auth connection to use.
   *
   * @param {RequestOptionsBase} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  async getSignInLinkWithHttpOperationResponse(conversation: Models.ConversationReference, connectionName: string, options?: msRest.RequestOptionsBase): Promise<msRest.HttpOperationResponse> {
    let client = this.client;

    // Construct state object
    const state = {
      ConnectionName: connectionName,
      Conversation: conversation,
      MsAppId: (this.client.credentials as MicrosoftAppCredentials).appId
    };
    const finalState = Buffer.from(JSON.stringify(state)).toString('base64');

    // Construct URL
    let baseUrl = this.client.baseUri;
    let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + `api/botsignin/getsigninurl`;
    let queryParamsArray: Array<any> = [];
    queryParamsArray.push('state=' + encodeURIComponent(finalState));
    requestUrl += '?' + queryParamsArray.join('&');

    // Create HTTP transport objects
    let httpRequest = new WebResource();
    httpRequest.method = 'GET';
    httpRequest.url = requestUrl;
    httpRequest.headers = {};
    // Set Headers
    if(options && options.customHeaders) {
        for(let headerName in options.customHeaders) {
          if (options.customHeaders.hasOwnProperty(headerName)) {
            httpRequest.headers[headerName] = options.customHeaders[headerName];
          }
        }
      }
  
    // Send Request
    let operationRes: msRest.HttpOperationResponse;
    try {
      operationRes = await client.pipeline(httpRequest);
      let response = operationRes.response;
      let statusCode = response.status;
      if (statusCode !== 200) {
        let error = new msRest.RestError(operationRes.bodyAsText as string);
        error.statusCode = response.status;
        error.request = msRest.stripRequest(httpRequest);
        error.response = msRest.stripResponse(response);
        let parsedErrorResponse = operationRes.bodyAsJson as { [key: string]: any };
        try {
          if (parsedErrorResponse) {
            let internalError = null;
            if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
            error.code = internalError ? internalError.code : parsedErrorResponse.code;
            error.message = internalError ? internalError.message : parsedErrorResponse.message;
          }
          if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
            let resultMapper = Mappers.ErrorResponse;
            error.body = client.serializer.deserialize(resultMapper, parsedErrorResponse, 'error.body');
          }
        } catch (defaultError) {
          error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                           `- "${operationRes.bodyAsText}" for the default response.`;
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }

    } catch(err) {
      return Promise.reject(err);
    }

    return Promise.resolve(operationRes);
  }

  /**
   * @summary EmulateOAuthCards
   *
   * Tells the token service to emulate the sending of OAuthCards.
   *
   * @param {boolean} emulate If `true` the token service will emulate the sending of OAuthCards.
   *
   * @param {RequestOptionsBase} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  async emulateOAuthCardsWithHttpOperationResponse(emulate: boolean, options?: msRest.RequestOptionsBase): Promise<msRest.HttpOperationResponse> {
    let client = this.client;

    // Construct URL
    let baseUrl = this.client.baseUri;
    let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + `api/usertoken/emulateOAuthCards`;
    let queryParamsArray: Array<any> = [];
    queryParamsArray.push('emulate=' + (!!emulate).toString());
    requestUrl += '?' + queryParamsArray.join('&');

    // Create HTTP transport objects
    let httpRequest = new WebResource();
    httpRequest.method = 'POST';
    httpRequest.url = requestUrl;
    httpRequest.headers = {};
    // Set Headers
    if(options && options.customHeaders) {
        for(let headerName in options.customHeaders) {
          if (options.customHeaders.hasOwnProperty(headerName)) {
            httpRequest.headers[headerName] = options.customHeaders[headerName];
          }
        }
      }
  
    // Send Request
    let operationRes: msRest.HttpOperationResponse;
    try {
      operationRes = await client.pipeline(httpRequest);
      let response = operationRes.response;
      let statusCode = response.status;
      if (statusCode !== 200) {
        let error = new msRest.RestError(operationRes.bodyAsText as string);
        error.statusCode = response.status;
        error.request = msRest.stripRequest(httpRequest);
        error.response = msRest.stripResponse(response);
        let parsedErrorResponse = operationRes.bodyAsJson as { [key: string]: any };
        try {
          if (parsedErrorResponse) {
            let internalError = null;
            if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
            error.code = internalError ? internalError.code : parsedErrorResponse.code;
            error.message = internalError ? internalError.message : parsedErrorResponse.message;
          }
          if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
            let resultMapper = Mappers.ErrorResponse;
            error.body = client.serializer.deserialize(resultMapper, parsedErrorResponse, 'error.body');
          }
        } catch (defaultError) {
          error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                           `- "${operationRes.bodyAsText}" for the default response.`;
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }

    } catch(err) {
      return Promise.reject(err);
    }

    return Promise.resolve(operationRes);
  }
  
  /**
   * @summary GetUserToken
   *
   * Attempts to retrieve the token for a user that's in a logging flow.
   * 
   * @param {string} userId Id of the user being authenticated.
   *
   * @param {string} connectionName Name of the auth connection to use.
   *
   * @param {string} [magicCode] Optional user entered code to validate.
   *
   * @param {RequestOptionsBase} [options] Optional Parameters.
   */
  getUserToken(userId: string, connectionName: string, magicCode?: string, options?: msRest.RequestOptionsBase): Promise<Models.TokenResponse> {
    return this.getUserTokenWithHttpOperationResponse(userId, connectionName, magicCode, options).then((operationRes: msRest.HttpOperationResponse) => {
      return Promise.resolve(operationRes.bodyAsJson as Models.TokenResponse);
    }).catch((err: Error) => {
      return Promise.reject(err);
    });
  }

  /**
   * @summary SignOutUser
   *
   * Signs the user out with the token server.
   *
   * @param {string} userId Id of the user to sign out.
   *
   * @param {string} connectionName Name of the auth connection to use.
   *
   * @param {RequestOptionsBase} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   */
  async signOutUser(userId: string, connectionName: string, options?: msRest.RequestOptionsBase): Promise<void> {
    return this.signOutUserWithHttpOperationResponse(userId, connectionName, options).then((operationRes: msRest.HttpOperationResponse) => {
      return Promise.resolve();
    }).catch((err: Error) => {
      return Promise.reject(err);
    });
  }

  /**
   * @summary GetSignInLink
   *
   * Gets a signin link from the token server that can be sent as part of a SigninCard. 
   *
   * @param { Models.ConversationReference} conversation conversation reference for the user signing in.
   *
   * @param {string} connectionName Name of the auth connection to use.
   *
   * @param {RequestOptionsBase} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   */
  async getSignInLink(conversation: Models.ConversationReference, connectionName: string, options?: msRest.RequestOptionsBase): Promise<string> {
    return this.getSignInLinkWithHttpOperationResponse(conversation, connectionName, options).then((operationRes: msRest.HttpOperationResponse) => {
      return Promise.resolve(operationRes.bodyAsText);
    }).catch((err: Error) => {
      return Promise.reject(err);
    });
  }

  /**
   * @summary EmulateOAuthCards
   *
   * Tells the token service to emulate the sending of OAuthCards for a channel.
   *
   * @param {boolean} emulate If `true` the token service will emulate the sending of OAuthCards.
   *
   * @param {RequestOptionsBase} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   */
  async emulateOAuthCards(emulate: boolean, options?: msRest.RequestOptionsBase): Promise<void> {
    return this.emulateOAuthCardsWithHttpOperationResponse(emulate, options).then((operationRes: msRest.HttpOperationResponse) => {
      return Promise.resolve();
    }).catch((err: Error) => {
      return Promise.reject(err);
    });
  }
}
