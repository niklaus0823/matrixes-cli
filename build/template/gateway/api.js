"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utility = require("../../lib/Utility");
const Printer_1 = require("../../lib/Printer");
const fieldInfo_1 = require("../fieldInfo");
var TplGatewayApi;
(function (TplGatewayApi) {
    TplGatewayApi.print = (methodInfo, requestMethodFieldInfo, responseMethodFieldInfo) => {
        const printer = new Printer_1.Printer(0);
        printer.printLn(`import * as Mock from 'mockjs';`);
        printer.printLn(`import {GatewayApiBase, GatewayContext, MiddlewareNext, joi, joiType} from 'matrixes-lib';`);
        Object.keys(methodInfo.protoMsgImportPath).forEach((importPath) => {
            printer.printLn(`import {${methodInfo.protoMsgImportPath[importPath].join(', ')}} from '${importPath}';`);
        });
        printer.printEmptyLn();
        printer.printLn(`interface RequestParams {`);
        printer.printLn(`body: ${methodInfo.requestTypeStr}.AsObject;`, 1);
        printer.printLn(`}`);
        printer.printEmptyLn();
        printer.printLn(`class ${Utility.ucFirst(methodInfo.methodName)} extends GatewayApiBase {`);
        printer.printEmptyLn();
        printer.printLn(`constructor() {`, 1);
        printer.printLn(`super();`, 2);
        printer.printLn(`this.method = '${methodInfo.options.method}';`, 2);
        printer.printLn(`this.uri = '${methodInfo.options.uri}';`, 2);
        printer.printLn(`this.type = 'application/json; charset=utf-8';`, 2);
        printer.printLn(`this.schemaDefObj = {`, 2);
        const requestMethodFieldNames = Object.keys(requestMethodFieldInfo);
        if (requestMethodFieldNames.length > 0) {
            printer.printLn(`body: joi.object().keys({`, 3);
            requestMethodFieldNames.forEach((fieldName) => {
                let fieldInfo = requestMethodFieldInfo[fieldName];
                fieldInfo_1.TplFieldInfo.printJoiValidate(printer, fieldInfo, 4);
            });
            printer.printLn(`})`, 3);
        }
        else {
            printer.printLn(`body: joi.object()`, 3);
        }
        printer.printLn(`};`, 2);
        printer.printLn(`}`, 1);
        printer.printEmptyLn();
        printer.printLn(`public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<${methodInfo.responseTypeStr}.AsObject> {`, 1);
        printer.printLn(`return Promise.resolve((new ${methodInfo.responseTypeStr}()).toObject());`, 2);
        printer.printLn(`}`, 1);
        printer.printEmptyLn();
        printer.printLn(`public async handleMock(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<${methodInfo.responseTypeStr}.AsObject> {`, 1);
        printer.printLn(`const response = new ${methodInfo.responseTypeStr}();`, 2);
        printer.printEmptyLn();
        const responseMethodFieldNames = Object.keys(responseMethodFieldInfo);
        if (responseMethodFieldNames.length > 0) {
            responseMethodFieldNames.forEach((fieldName) => {
                let fieldInfo = responseMethodFieldInfo[fieldName];
                fieldInfo_1.TplFieldInfo.printMockResponse(printer, fieldInfo, 2, 'response');
            });
        }
        printer.printEmptyLn();
        printer.printLn(`return Promise.resolve(response.toObject());`, 2);
        printer.printLn(`}`, 1);
        printer.printLn(`}`);
        printer.printEmptyLn();
        printer.printLn(`export const api = new ${Utility.ucFirst(methodInfo.methodName)}();`);
        return printer.getOutput();
    };
})(TplGatewayApi = exports.TplGatewayApi || (exports.TplGatewayApi = {}));
