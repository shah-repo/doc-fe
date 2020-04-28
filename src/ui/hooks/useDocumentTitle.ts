import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title || "Enlil";
    return () => {
      document.title = "Enlil";
    };
  }); };

export default useDocumentTitle;
