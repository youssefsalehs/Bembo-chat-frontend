import { useChat } from "../store/useChat";
import { useContext, useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuth } from "../store/useAuth";
import ImagePreview from "./ImagePreview";
import { PreviewContext } from "../PreviewProvider";

const ChatContainer = ({ setOpenMedia }) => {
  const { messages, getMsgs, isMsgsLoading, selectedUser } = useChat();
  const { userAuth } = useAuth();
  const { setPreviewImages, setCurrentIndex } = useContext(PreviewContext);

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMsgs(selectedUser?._id);
  }, [selectedUser?._id, getMsgs]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const openImagePreview = (images, index = 0) => {
    setPreviewImages(images);
    setCurrentIndex(index);
  };

  if (isMsgsLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
      <ChatHeader setOpenMedia={setOpenMedia} />
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ backgroundColor: userAuth?.theme }}
      >
        {messages?.map((message) => (
          <div
            key={message?._id}
            className={`chat ${
              message?.senderId === userAuth?._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message?.senderId === userAuth?._id
                      ? userAuth?.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div
              className={`chat-bubble ${
                message?.senderId === userAuth?._id
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content"
              } py-4 flex flex-col`}
            >
              {message?.images?.length > 0 && message?.images?.length > 1 ? (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {message.images.map((img, index) => (
                    <img
                      onClick={() => openImagePreview(message.images, index)}
                      key={index}
                      src={img}
                      alt="Attachment"
                      className="w-16 h-16 md:w-32 md:h-32 object-cover rounded-md cursor-pointer"
                    />
                  ))}
                </div>
              ) : (
                message?.images?.length > 0 && (
                  <div>
                    <img
                      onClick={() => openImagePreview(message.images, 0)}
                      src={message.images[0]}
                      alt="Attachment"
                      className=" h-16 md:h-32 object-cover rounded-md cursor-pointer"
                    />
                  </div>
                )
              )}
              {message?.text && <p>{message?.text}</p>}
            </div>
            <div className="chat-footer mt-1">
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.createdAt).toLocaleString()}
              </time>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
