import { useEffect } from "react";
import { createPortal } from "react-dom";
const ImagePreview = ({
  images,
  currentIndex,
  setCurrentIndex,
  setPreviewImages,
}) => {
  const handleClose = () => setPreviewImages([]);
  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images]);

  return createPortal(
    <div
      className="fixed inset-0 bg-neutral/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt="Preview"
          className="max-h-[80vh] max-w-[90vw] rounded-md"
        />
      </div>
    </div>,
    document.body,
  );
};

export default ImagePreview;
