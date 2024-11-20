"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPRepository = void 0;
const OTPModel_1 = require("../database/models/OTPModel");
class OTPRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OTPModel_1.OTPModel.findOne({ email });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield OTPModel_1.OTPModel.deleteOne({ _id: id });
        });
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield OTPModel_1.OTPModel.create(data);
        });
    }
}
exports.OTPRepository = OTPRepository;
