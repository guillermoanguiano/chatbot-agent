import { useRef, useState, useEffect } from "react";

interface UseChatScrollReturn {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  showScrollButton: boolean;
  scrollToBottom: () => void;
  isScrolledToBottom: boolean;
}

export function useChatScroll(): UseChatScrollReturn {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const isScrolledToBottom = () => {
    if (!scrollAreaRef.current) return true;

    const { scrollHeight, scrollTop, clientHeight } = scrollAreaRef.current;
    return Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
  };

  const handleScroll = () => {
    setShowScrollButton(!isScrolledToBottom());
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
      return () => scrollArea.removeEventListener("scroll", handleScroll);
    }
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return {
    scrollAreaRef,
    showScrollButton,
    scrollToBottom,
    isScrolledToBottom: isScrolledToBottom(),
  };
}
