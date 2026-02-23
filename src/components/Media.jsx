import React, { useState } from "react";
import { useChat } from "../store/useChat";
import { Images, Quote, X } from "lucide-react";

export default function Media({ setOpenMedia }) {
  const { selectedUser, messages } = useChat();
  const [visibleCount, setVisibleCount] = useState(5);
  console.log(selectedUser?.coverPic);
  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };
  const images = messages
    .filter((m) => m.images.length > 0)
    .flatMap((m) => m.images);
  const visibleImages = images.slice(0, visibleCount);

  return (
    <div className="w-full md:w-96 border-l border-base-300">
      <div className=" rounded-xl  space-y-2">
        <div className="flex gap-4 items-center p-4">
          <button
            className="btn btn-primary"
            onClick={() => setOpenMedia(false)}
          >
            <X />
          </button>
          <h3 className="text-lg">Contact Info</h3>
        </div>
        <div className="flex flex-col items-center gap-4 ">
          <div className="relative px-4 w-full">
            <img
              src={
                selectedUser?.coverPic ||
                "https://res.cloudinary.com/dlnhmifmn/image/upload/v1771801386/pexels-joyston-judah-331625-933054_zhhyk7.jpg"
              }
              alt="cover"
              className="rounded-md object-cover border-4 w-full h-32"
            />

            <img
              src={selectedUser?.profilePic || "/default.jpg"}
              alt="avatar"
              className="size-28 absolute bottom-[-30px] left-1/2 -translate-x-1/2  rounded-full object-cover border-4 border-green-600"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2  ">
          <h1 className="text-2xl font-semibold text-center  mt-5">
            <span>{selectedUser?.fullName}</span>
          </h1>
          <div className="flex flex-col border-b pb-4 border-base-300">
            <h1 className="text-md font-semibold mb-1 flex gap-2 items-center px-4 ">
              <Quote size={15} />
              <span> About</span>
            </h1>
            <p className="px-4 italic">"{selectedUser?.bio || "No bio yet"}"</p>
          </div>
          <div className="flex flex-col">
            <h1 className="text-md font-semibold mb-1 flex gap-2 items-center px-4 ">
              <Images size={15} />
              <span>Media</span>
            </h1>
            <div>
              <div className="grid grid-cols-4 p-4 gap-4 overflow-y-auto max-h-48">
                {visibleImages.length > 0 ? (
                  visibleImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`img-${i}`}
                      className="object-cover  rounded-md"
                    />
                  ))
                ) : (
                  <p className="col-span-4 text-center">No photos were sent</p>
                )}
              </div>

              {visibleCount < images.length && (
                <div className="flex justify-center mt-4">
                  <button onClick={loadMore} className="btn">
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
