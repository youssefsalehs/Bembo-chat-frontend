import { useEffect, useRef, useState } from "react";
import { useChat } from "../store/useChat";
import { EllipsisVertical, Image, Send, SmilePlusIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../store/useAuth";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [attachMenu, setAttachMenu] = useState(false);
  const { userAuth, socket } = useAuth();
  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);

  const { sendMsg, isSendingMsgs, selectedUser } = useChat();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    setImages((prev) => [...prev, ...validFiles]);

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("text", text.trim());

      images.forEach((img) => formData.append("images", img));

      await sendMsg(formData);

      setText("");
      setImages([]);
      setImagePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setOpenEmoji(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  useEffect(() => {
    if (text.length > 0)
      socket.emit("typing", { receiverId: selectedUser._id });
    return () => socket.emit("stopTyping", { receiverId: selectedUser._id });
  }, [socket, selectedUser._id, text]);

  return (
    <div
      className="p-4 w-full "
      style={{ backgroundColor: userAuth?.theme + "88" }}
    >
      {imagePreviews.length > 0 && (
        <div className="mb-3 flex gap-2 flex-wrap">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={() => removeImage(index)}
                type="button"
                disabled={isSendingMsgs}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="text"
            className="w-full input text-xl input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSendingMsgs}
          />

          <input
            type="file"
            accept="image/*"
            multiple
            id="file"
            className="hidden"
            ref={fileInputRef}
            disabled={isSendingMsgs}
            onChange={handleImageChange}
          />

          <span
            className="sm:hidden relative cursor-pointer"
            onClick={() => setAttachMenu((s) => !s)}
            disabled={isSendingMsgs}
          >
            <EllipsisVertical />

            {attachMenu && (
              <section
                className="absolute flex flex-col gap-2 top-[-110px] right-[10px] bg-base-200 rounded-lg w-40 p-2"
                onClick={(e) => e.stopPropagation()}
                disabled={isSendingMsgs}
              >
                <label
                  htmlFor="file"
                  className="py-2 hover:bg-base-300 text-center cursor-pointer"
                >
                  Upload
                </label>

                <p
                  disabled={isSendingMsgs}
                  className="py-2 hover:bg-base-300 text-center cursor-pointer"
                  onClick={() => {
                    setOpenEmoji(true);
                    setAttachMenu(false);
                  }}
                >
                  Emoji
                </p>
              </section>
            )}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              className="hidden sm:flex btn btn-circle btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSendingMsgs}
            >
              <Image size={20} />
            </button>
          </div>
        </div>

        <div ref={emojiRef} className="relative">
          <button
            type="button"
            className="hidden sm:flex btn btn-circle btn-primary"
            onClick={() => setOpenEmoji((o) => !o)}
            disabled={isSendingMsgs}
          >
            <SmilePlusIcon size={22} />
          </button>

          {openEmoji && (
            <div className="absolute bottom-[60px] left-[-210px] ">
              <EmojiPicker
                width={250}
                height={400}
                onEmojiClick={(emojiObject) => {
                  setText((t) => t + emojiObject.emoji);
                  setOpenEmoji(false);
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn  btn-primary"
          disabled={(!text.trim() && images.length === 0) || isSendingMsgs}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
