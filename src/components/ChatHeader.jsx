import { X } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { useChat } from "../store/useChat";
import { useEffect, useState } from "react";

const ChatHeader = ({ setOpenMedia }) => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers, userAuth, socket } = useAuth();
  const isOnline = onlineUsers.includes(selectedUser?._id);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        setIsTyping(true);
      }
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [selectedUser, socket]);
  return (
    <div
      className={`px-2.5 py-4 border-b  border-base-300 cursor-pointer`}
      onClick={() => setOpenMedia(true)}
      style={{ backgroundColor: userAuth?.theme + "88" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/default.jpg"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p
              className={`text-sm ${!isOnline ? "text-base-content/70" : "text-green-600"}`}
            >
              {isOnline ? (
                isTyping ? (
                  <div className="flex items-center gap-1">
                    <p className="text-base-content/70">typing</p>

                    <span className="h-1 w-1 rounded-full bg-base-content/70 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1 w-1 rounded-full bg-base-content/70 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1 w-1 rounded-full bg-base-content/70 animate-bounce [animation-delay:300ms]" />
                  </div>
                ) : (
                  "Online"
                )
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(null);
            setOpenMedia(false);
          }}
          className="btn btn-primary"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
