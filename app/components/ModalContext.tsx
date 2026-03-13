import React, { createContext, useContext, useState, useEffect } from "react";
import { Film } from "../page";

type ModalType = "video" | "contact" | null;

interface ModalContextValue {
  activeModal: ModalType;
  selectedFilm: Film | null;
  openVideoModal: (film: Film) => void;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}


const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeModal]);

  return (
    <ModalContext.Provider value={{
      activeModal,
      selectedFilm,
      openVideoModal: (film) => { setSelectedFilm(film); setActiveModal("video"); },
      openModal: setActiveModal,
      closeModal: () => { setActiveModal(null); setSelectedFilm(null); },
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}