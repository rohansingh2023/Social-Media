import mongoose from "mongoose";

export interface IConversation {
  members: any[];
}

export interface IConversationModel extends IConversation, mongoose.Document {}

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IConversationModel>(
  "Conversation",
  ConversationSchema
);
