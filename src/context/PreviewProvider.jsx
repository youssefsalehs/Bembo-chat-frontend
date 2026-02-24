import React, { createContext, useState } from "react";
export const PreviewContext = createContext();

export default function PreviewProvider({ children }) {
  const [previewImages, setPreviewImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <PreviewContext.Provider
      value={{ previewImages, setPreviewImages, currentIndex, setCurrentIndex }}
    >
      {children}
    </PreviewContext.Provider>
  );
}
