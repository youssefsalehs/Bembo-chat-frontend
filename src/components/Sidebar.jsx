import { useEffect, useState } from "react";
import { useChat } from "../store/useChat";

import SidebarSkeleton from "./SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuth } from "../store/useAuth";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChat();
  const { onlineUsers } = useAuth();
  const [showOnline, setShowOnline] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (showOnline) {
      setFilteredUsers(
        users?.filter((user) => onlineUsers?.includes(user._id)),
      );
    } else {
      setFilteredUsers(users);
    }
  }, [showOnline, users, onlineUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-3 flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="w-fit self-start  flex gap-2 items-center">
          <input
            type="checkbox"
            id="filter"
            checked={showOnline}
            className="toggle"
            onChange={(e) => setShowOnline(e.target.checked)}
          />

          <label htmlFor="filter" className="hidden lg:flex text-lg">
            online users
          </label>
        </div>
        <div className="hidden sm:flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search users..."
            className="input w-full input-primary"
            onChange={(e) => {
              const search = e.target.value.toLowerCase();
              const baseList = showOnline
                ? users.filter((u) => onlineUsers.includes(u._id))
                : users;

              const filtered = baseList.filter(
                (u) =>
                  u.fullName.toLowerCase().includes(search) ||
                  u.email.toLowerCase().includes(search),
              );

              setFilteredUsers(filtered);
            }}
          />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers?.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user?.profilePic || "/default.jpg"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers?.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full "
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers?.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers?.length === 0 && (
          <p className=" w-full p-3 flex items-center gap-3">
            {showOnline ? "No online users" : "No users registered in the app"}
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
