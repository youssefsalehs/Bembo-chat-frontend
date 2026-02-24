import { useState } from "react";
import { useChat } from "../store/useChat";
import NoChat from "../components/NoChat";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import Media from "../components/Media";

export default function HomePage() {
  const { selectedUser } = useChat();
  const [openMedia, setOpenMedia] = useState(false);
  return (
    <div className="min-h-screen bg-base-200 ">
      <div className="flex items-center justify-center pt-16  h-full">
        <div className="bg-base-100 rounded-lg shadow-xl w-full h-[calc(100vh-4em)]">
          <div className="flex rounded-lg h-full overflow-hidden">
            <Sidebar />
            {!selectedUser ? (
              <NoChat />
            ) : (
              <ChatContainer setOpenMedia={setOpenMedia} />
            )}
            {openMedia && <Media setOpenMedia={setOpenMedia} />}
          </div>
        </div>
      </div>
    </div>
  );
}
