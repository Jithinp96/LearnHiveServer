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
exports.ConversationRepository = void 0;
const ConversationModel_1 = require("../database/models/ConversationModel");
const TutorModel_1 = require("../database/models/TutorModel");
const StudentModel_1 = require("../database/models/StudentModel");
class ConversationRepository {
    findByParticipants(participant1, participant2) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ConversationModel_1.ConversationModel.findOne({
                participants: { $all: [participant1, participant2] }
            }).exec();
        });
    }
    createConversation(participants) {
        return __awaiter(this, void 0, void 0, function* () {
            const newConversation = new ConversationModel_1.ConversationModel({ participants });
            return yield newConversation.save();
        });
    }
    addMessageToConversation(conversationId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ConversationModel_1.ConversationModel.findByIdAndUpdate(conversationId, { $push: { messages: messageId } }, { new: true }).exec();
        });
    }
    getUserConversations(currentUserId, currentUserRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const userConversations = yield ConversationModel_1.ConversationModel.find({ participants: currentUserId })
                .lean()
                .exec();
            const otherParticipants = [];
            for (const conversation of userConversations) {
                // Find the participant ID that isn't the currentUserId
                const otherParticipantId = conversation.participants.find((id) => id.toString() !== currentUserId);
                if (!otherParticipantId)
                    continue;
                // Fetch the name based on the currentUserRole
                let otherParticipant;
                if (currentUserRole === "Student") {
                    otherParticipant = yield TutorModel_1.TutorModel.findById(otherParticipantId)
                        .select("name profileImage role")
                        .lean();
                }
                else if (currentUserRole === "Tutor") {
                    otherParticipant = yield StudentModel_1.StudentModel.findById(otherParticipantId)
                        .select("name profileImage role")
                        .lean();
                }
                // Only add to result if the other participant was found
                if (otherParticipant) {
                    otherParticipants.push({
                        _id: otherParticipantId.toString(),
                        name: otherParticipant.name,
                        profileImage: otherParticipant.profileImage,
                        role: otherParticipant.role
                    });
                }
            }
            //   console.log("Other participants details: ", otherParticipants);
            return otherParticipants;
        });
    }
    getAllConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ConversationModel_1.ConversationModel.find({})
                .populate("messages")
                .lean()
                .exec();
        });
    }
}
exports.ConversationRepository = ConversationRepository;
