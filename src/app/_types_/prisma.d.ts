import { Conversation, Message, User } from "@prisma/client";
declare module "@prisma/client" {

  export type FullMessageType = Message & {
    sender: User,
    seen: User[]
  }

  export type FullConversationType = Conversation & {
    messages: FullMessageType[]
    users: User[]
  }
}


