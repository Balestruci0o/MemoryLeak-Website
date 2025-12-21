export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  description: string;
  category: "build" | "walkthrough" | "demo" | "showcase";
  duration?: string; // For videos
}

export interface GalleryState {
  activeIndex: number;
  isModalOpen: boolean;
  modalItem: GalleryItem | null;
  isMuted: boolean;
}
