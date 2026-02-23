import React, { useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../store/useAuth";

export default function PreviewMsgs() {
  const { userAuth, updateProfile } = useAuth();
  console.log(userAuth?.theme);
  const [chatBg, setChatBg] = useState(userAuth?.theme || "#f3f3f3");
  console.log(chatBg);
  const PREVIEW_MESSAGES = [
    {
      id: 1,
      content:
        "you can choose color for your bg from the color picker on the top right",
      isSent: false,
    },
    {
      id: 2,
      content:
        "When you click submit this bg will be applied to your chat only",
      isSent: true,
    },
  ];

  return (
    <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
      <div className="p-4 bg-base-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-center flex-1">Preview</h3>
          {/* Color Picker */}
          <input
            type="color"
            value={chatBg}
            onChange={(e) => setChatBg(e.target.value)}
            className="w-10 h-10 rounded"
            title="Change chat background"
          />
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
            <div
              className="px-4 py-3 border-b  bg-base-100"
              style={{ backgroundColor: chatBg + "88" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                  Y
                </div>
                <div>
                  <h3 className="font-medium text-sm">Youssef</h3>
                  <p className="text-xs text-base-content/70">Online</p>
                </div>
              </div>
            </div>

            <div
              className="p-4 space-y-4 min-h-[200px] max-h-[350px] overflow-y-auto "
              style={{ backgroundColor: chatBg }}
            >
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isSent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                      message.isSent
                        ? "bg-primary text-primary-content"
                        : "bg-base-200"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-[10px] mt-1.5 ${
                        message.isSent
                          ? "text-primary-content/70"
                          : "text-base-content/70"
                      }`}
                    >
                      12:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="p-4 border-t border-base-300 bg-base-100"
              style={{ backgroundColor: chatBg + "88" }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1 text-sm h-[3rem]"
                  placeholder="This is a preview"
                  readOnly
                />
                <button
                  className="btn btn-primary flex justify-center items-center"
                  onClick={() => updateProfile({ theme: chatBg })}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
