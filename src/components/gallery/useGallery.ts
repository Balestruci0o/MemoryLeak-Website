import { useState, useCallback, useEffect } from "react";
import { GalleryItem, GalleryState } from "./types";

// Gallery items with placeholder paths - user will add real assets later
export const galleryItems: GalleryItem[] = [
  {
    id: "img-01",
    type: "image",
    src: "/assets/XOR_z_NAND.png",
    title: "Logic Gate Foundation",
    description: "Building the basic AND, OR, NOT gates from another gates",
    category: "build",
  },
  {
    id: "vid-01",
    type: "video",
    src: "src/assets/Full-adder.mp4",
    poster: "src/assets/Full-adder.png",
    title: "Full Adder Walkthrough",
    description: "Step-by-step construction of a binary full adder circuit",
    category: "walkthrough",
    duration: "1:34",
  },
  {
    id: "img-02",
    type: "image",
    src: "/assets/gallery/gallery_img_02.png",
    title: "ALU Architecture",
    description: "The complete Arithmetic Logic Unit design",
    category: "showcase",
  },
  {
    id: "vid-02",
    type: "video",
    src: "/assets/gallery/gallery_vid_02.mp4",
    poster: "/assets/gallery/gallery_vid_02_poster.png",
    title: "Register Operations",
    description: "Demonstrating data storage and retrieval",
    category: "demo",
    duration: "1:30",
  },
  {
    id: "img-03",
    type: "image",
    src: "src/assets/D-latch.png",
    title: "Memory Systems",
    description: "RAM architecture and memory addressing",
    category: "build",
  },
  {
    id: "img-04",
    type: "image",
    src: "/assets/gallery/gallery_img_04.png",
    title: "Binary Calculator",
    description: "Interactive binary arithmetic operations",
    category: "showcase",
  },
  {
    id: "vid-03",
    type: "video",
    src: "src/assets/Signal-flow.mp4",
    poster: "src/assets/D-latch.png",
    title: "Signal Propagation",
    description: "Watch signals flow through connected gates",
    category: "demo",
    duration: "0:15",
  },
  {
    id: "img-05",
    type: "image",
    src: "/assets/gallery/gallery_img_05.png",
    title: "Multiplexer Design",
    description: "4-to-1 multiplexer circuit implementation",
    category: "build",
  },
  {
    id: "img-06",
    type: "image",
    src: "src/assets/Decoder.png",
    title: "Decoder Circuit",
    description: "Binary decoder for address selection",
    category: "showcase",
  },
  {
    id: "vid-04",
    type: "video",
    src: "/assets/gallery/gallery_vid_04.mp4",
    poster: "/assets/gallery/gallery_vid_04_poster.png",
    title: "CLI Computer Demo",
    description: "The complete computer executing commands",
    category: "demo",
    duration: "3:15",
  },
  {
    id: "img-07",
    type: "image",
    src: "src/assets/Clock-generator.png",
    title: "Clock Generator",
    description: "Oscillator circuit for timing signals",
    category: "build",
  },
  {
    id: "img-08",
    type: "image",
    src: "/assets/gallery/gallery_img_08.png",
    title: "Control Unit",
    description: "Instruction decoder and control logic",
    category: "showcase",
  },
  {
    id: "img-09",
    type: "image",
    src: "/assets/gallery/gallery_img_09.png",
    title: "Complete System",
    description: "All components working together",
    category: "showcase",
  },
];

export const useGallery = () => {
  const [state, setState] = useState<GalleryState>({
    activeIndex: 0,
    isModalOpen: false,
    modalItem: null,
    isMuted: true,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const openModal = useCallback((item: GalleryItem) => {
    setState((prev) => ({
      ...prev,
      isModalOpen: true,
      modalItem: item,
    }));
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      modalItem: null,
    }));
    document.body.style.overflow = "";
  }, []);

  const navigateModal = useCallback((direction: "next" | "prev") => {
    if (!state.modalItem) return;

    const currentIndex = galleryItems.findIndex((item) => item.id === state.modalItem?.id);
    let newIndex: number;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % galleryItems.length;
    } else {
      newIndex = currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1;
    }

    setState((prev) => ({
      ...prev,
      modalItem: galleryItems[newIndex],
    }));
  }, [state.modalItem]);

  const toggleMute = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  }, []);

  const setActiveIndex = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      activeIndex: index,
    }));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isModalOpen) return;

      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowRight":
          navigateModal("next");
          break;
        case "ArrowLeft":
          navigateModal("prev");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isModalOpen, closeModal, navigateModal]);

  return {
    ...state,
    galleryItems,
    prefersReducedMotion,
    openModal,
    closeModal,
    navigateModal,
    toggleMute,
    setActiveIndex,
  };
};
