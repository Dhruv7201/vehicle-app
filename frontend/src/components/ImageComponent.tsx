import React, { useState, useEffect } from "react";
import Loading from "../assets/loading.svg";
import { toast } from "react-toastify";

interface ImageProps {
  path: string;
}

const ImageComponent: React.FC<ImageProps> = ({ path }) => {
  const [hovered, setHovered] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingEnlarged, setLoadingEnlarged] = useState(true);
  const [error, setError] = useState(false);

  const url = import.meta.env.VITE_API_URL + "/get_image?path=" + path;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && enlarged) {
        handleCloseClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enlarged]);

  const handleImageClick = () => {
    setEnlarged(true);
  };

  const handleCloseClick = () => {
    setEnlarged(false);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleCloseClick();
    }
  };

  return (
    <>
      <div
        className="relative w-96 h-96"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          filter: enlarged ? "brightness(50%)" : "none",
        }}
      >
        {error && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <p className="text-white">Failed to load image</p>
          </div>
        )}
        <img
          src={url}
          onClick={handleImageClick}
          className="cursor-pointer w-full h-full"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setHovered(false);
            setError(true);
            toast.error("Failed to load image");
          }}
        />
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <img src={Loading} alt="Loading" className="h-6 w-6" />
          </div>
        )}
        {hovered && (
          <div
            className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={handleImageClick}
          >
            <img
              src="https://img.icons8.com/ios/452/visible.png"
              alt="View"
              className="h-6 w-6"
            />
          </div>
        )}
      </div>
      {enlarged && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-black bg-opacity-70 cursor-pointer z-10 w-full h-full"
          onClick={handleOverlayClick}
        >
          <div
            className="relative max-w-screen-2xl max-h-screen-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={url}
              alt="Enlarged Image"
              className="max-w-full max-h-full cursor-default"
              onLoad={() => setLoadingEnlarged(false)}
              onError={() => {
                setLoadingEnlarged(false);
                setError(true);
                toast.error("Failed to load image");
              }}
            />
          </div>
          <button
            onClick={handleCloseClick}
            className="absolute top-2 right-4 text-white text-4xl bg-transparent border-none cursor-pointer focus:outline-none z-20"
          >
            &times;
          </button>
          {loadingEnlarged && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
              <img src={Loading} alt="Loading" className="h-6 w-6" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageComponent;
