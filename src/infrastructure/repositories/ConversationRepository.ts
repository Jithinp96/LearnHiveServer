import mongoose from "mongoose";

import { IConversation } from "../../domain/entities/IConversation";
import { IConversationRepository } from "../../domain/interfaces/IConversationRepository";
import { ConversationModel } from "../database/models/ConversationModel";

import { TutorModel } from "../database/models/TutorModel";
import { StudentModel } from "../database/models/StudentModel";

export class ConversationRepository implements IConversationRepository {
    async findByParticipants(participant1: string, participant2: string) {
        return await ConversationModel.findOne({
            participants: { $all: [participant1, participant2] }
        }).exec();
    }

    async createConversation(participants: string[]): Promise<mongoose.Document> {
        const newConversation = new ConversationModel({ participants });
        return await newConversation.save();
    }

    async addMessageToConversation(conversationId: string, messageId: string) {
        return await ConversationModel.findByIdAndUpdate(
            conversationId,
            { $push: { messages: messageId } },
            { new: true }
        ).exec();
    }



    async getUserConversations(currentUserId: string, currentUserRole: string): Promise<{ _id: string; name: string, profileImage: string, role: string }[]> {
          const userConversations = await ConversationModel.find({ participants: currentUserId })
              .lean<IConversation[]>()
              .exec();
      
          const otherParticipants = [];
      
          for (const conversation of userConversations) {
              // Find the participant ID that isn't the currentUserId
              const otherParticipantId = conversation.participants.find(
                  (id: string) => id.toString() !== currentUserId
              );
      
              if (!otherParticipantId) continue;
      
              // Fetch the name based on the currentUserRole
              let otherParticipant;
              if (currentUserRole === "Student") {
                  otherParticipant = await TutorModel.findById(otherParticipantId)
                      .select("name profileImage role")
                      .lean();
              } else if (currentUserRole === "Tutor") {
                  otherParticipant = await StudentModel.findById(otherParticipantId)
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
      }
      



    async getAllConversations(): Promise<IConversation[]> {
        return await ConversationModel.find({})
            .populate("messages")
            .lean<IConversation[]>()
            .exec();
    }
}
