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
    src: "/assets/Full-adder.mp4",
    poster: "/assets/Full-adder.png",
    title: "Full Adder Walkthrough",
    description: "Step-by-step construction of a binary full adder circuit",
    category: "walkthrough",
    duration: "1:34",
  },
  {
    id: "img-02",
    type: "image",
    src: "/assets/ALU.png",
    title: "ALU Architecture",
    description: "The complete Arithmetic Logic Unit design",
    category: "showcase",
  },
  {
    id: "img-03",
    type: "image",
    src: "/assets/D-latch.png",
    title: "Basic Memory Element",
    description: "D-latch storing a single bit using logic gates",
    category: "build",
  },
  {
    id: "vid-02",
    type: "video",
    src: "",
    poster: "/assets/gallery_vid_02_poster.png",
    title: "Interactive Circuit Building",
    description: "Creating and modifying logic circuits in real time",
    category: "demo",
    duration: "1:30",
  },
  {
    id: "img-04",
    type: "image",
    src: "/assets/counter.png",
    title: "Binary Counter",
    description: "Digital circuit that counts in binary with each clock pulse.",
    category: "showcase",
  },
  {
    id: "vid-03",
    type: "video",
    src: "/assets/Signal-flow.mp4",
    poster: "/assets/D-latch.png",
    title: "Signal Propagation",
    description: "Watch signals flow through connected gates",
    category: "demo",
    duration: "0:15",
  },
  {
    id: "img-05",
    type: "image",
    src: "/assets/maskoty.png",
    title: "Learning with the Mascot",
    description: "Our mascot explaining how a simple memory circuit works",
    category: "demo",
  },
  {
    id: "img-06",
    type: "image",
    src: "/assets/Decoder.png",
    title: "Decoder Circuit",
    description: "Binary decoder for address selection",
    category: "showcase",
  },
  {
    id: "vid-04",
    type: "video",
    src: "",
    poster: "/assets/gallery_vid_04_poster.png",
    title: "Assembly  Demo",
    description: "The complete computer executing commands",
    category: "demo",
    duration: "3:15",
  },
  {
    id: "img-07",
    type: "image",
    src: "/assets/Clock-generator.png",
    title: "Clock Generator",
    description: "Oscillator circuit for timing signals",
    category: "build",
  },
  {
    id: "img-08",
    type: "image",
    src: "/assets/components.png",
    title: "Rich Component Library",
    description: "Wide range of logic gates, switches, buses and building blocks",
    category: "showcase",
  },
  {
    id: "vid-05",
    type: "video",
    src: "/assets/AI-demo.mp4",
    poster: "/assets/AI-demo.png",
    title: "AI Learning Assistant",
    description: "Meet our AI helper guiding you through building and optimizing digital logic circuits in real time, supporting your learning journey.",
    category: "demo",
    duration: "0:28",
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
