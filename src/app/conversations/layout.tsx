import SideBar from "@/components/SideBar";
import { ConversationList } from "./components/ConversationList";
import { getConversations } from "../action/getConversations";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const conversations = await getConversations()
  return (
    //@ts-expect-error Server Component
    <SideBar>
      <div className=" h-full">
        <ConversationList initialItems={conversations} />
        {children}
      </div>
    </SideBar>
  )
}
