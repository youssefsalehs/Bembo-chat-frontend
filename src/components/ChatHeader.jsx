import { X } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { useChat } from "../store/useChat";

const ChatHeader = ({ setOpenMedia }) => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers, userAuth } = useAuth();

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
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
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
