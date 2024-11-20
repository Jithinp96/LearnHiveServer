"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusEnum = void 0;
var HttpStatusEnum;
(function (HttpStatusEnum) {
    HttpStatusEnum[HttpStatusEnum["OK"] = 200] = "OK";
    HttpStatusEnum[HttpStatusEnum["CREATED"] = 201] = "CREATED";
    HttpStatusEnum[HttpStatusEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusEnum[HttpStatusEnum["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusEnum[HttpStatusEnum["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusEnum[HttpStatusEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusEnum[HttpStatusEnum["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusEnum || (exports.HttpStatusEnum = HttpStatusEnum = {}));
