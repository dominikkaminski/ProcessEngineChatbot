"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var Constants;
(function (Constants) {
    /**
     * TO CHANNEL FROM BOT: Login URL
     */
    Constants.ToChannelFromBotLoginUrl = "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token";
    /**
     * TO CHANNEL FROM BOT: OAuth scope to request
     */
    Constants.ToChannelFromBotOAuthScope = "https://api.botframework.com/.default";
    /**
     * TO BOT FROM CHANNEL: Token issuer
     */
    Constants.ToBotFromChannelTokenIssuer = "https://api.botframework.com";
    /**
     * TO BOT FROM CHANNEL: OpenID metadata document for tokens coming from MSA
     */
    Constants.ToBotFromChannelOpenIdMetadataUrl = "https://login.botframework.com/v1/.well-known/openidconfiguration";
    /**
     * TO BOT FROM EMULATOR: OpenID metadata document for tokens coming from MSA
     */
    Constants.ToBotFromEmulatorOpenIdMetadataUrl = "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration";
    /**
     * Allowed token signing algorithms. Tokens come from channels to the bot. The code
     * that uses this also supports tokens coming from the emulator.
     */
    Constants.AllowedSigningAlgorithms = ["RS256", "RS384", "RS512"];
    /**
     * "azp" Claim.
     * Authorized party - the party to which the ID Token was issued.
     * This claim follows the general format set forth in the OpenID Spec.
     *     http://openid.net/specs/openid-connect-core-1_0.html#IDToken
     */
    Constants.AuthorizedParty = "azp";
    /**
     * Audience Claim. From RFC 7519.
     *     https://tools.ietf.org/html/rfc7519#section-4.1.3
     * The "aud" (audience) claim identifies the recipients that the JWT is
     * intended for.  Each principal intended to process the JWT MUST
     * identify itself with a value in the audience claim.If the principal
     * processing the claim does not identify itself with a value in the
     * "aud" claim when this claim is present, then the JWT MUST be
     * rejected.In the general case, the "aud" value is an array of case-
     * sensitive strings, each containing a StringOrURI value.In the
     * special case when the JWT has one audience, the "aud" value MAY be a
     * single case-sensitive string containing a StringOrURI value.The
     * interpretation of audience values is generally application specific.
     * Use of this claim is OPTIONAL.
     */
    Constants.AudienceClaim = "aud";
    /**
     * Issuer Claim. From RFC 7519.
     *     https://tools.ietf.org/html/rfc7519#section-4.1.1
     * The "iss" (issuer) claim identifies the principal that issued the
     * JWT.  The processing of this claim is generally application specific.
     * The "iss" value is a case-sensitive string containing a StringOrURI
     * value.  Use of this claim is OPTIONAL.
     */
    Constants.IssuerClaim = "iss";
    /**
     * From RFC 7515
     *     https://tools.ietf.org/html/rfc7515#section-4.1.4
     * The "kid" (key ID) Header Parameter is a hint indicating which key
     * was used to secure the JWS. This parameter allows originators to
     * explicitly signal a change of key to recipients. The structure of
     * the "kid" value is unspecified. Its value MUST be a case-sensitive
     * string. Use of this Header Parameter is OPTIONAL.
     * When used with a JWK, the "kid" value is used to match a JWK "kid"
     * parameter value.
     */
    Constants.KeyIdHeader = "kid";
    /**
     * Token version claim name. As used in Microsoft AAD tokens.
     */
    Constants.VersionClaim = "ver";
    /**
     * App ID claim name. As used in Microsoft AAD 1.0 tokens.
     */
    Constants.AppIdClaim = "appid";
    /**
     * Service URL claim name. As used in Microsoft Bot Framework v3.1 auth.
     */
    Constants.ServiceUrlClaim = "serviceurl";
})(Constants = exports.Constants || (exports.Constants = {}));
//# sourceMappingURL=constants.js.map