import { useModal } from "./ModalContext";

export default function ContactModal() {
  const { activeModal, closeModal } = useModal();
  const isOpen = activeModal === "contact";

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`} onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h1>Contact Us</h1>
      </div>
    </div>
  );
}