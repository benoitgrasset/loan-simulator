import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { Button } from "./Button";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Dialog = ({ open, title, onClose, children }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-white p-5 text-gray-900 shadow-2xl backdrop:bg-gray-950/40 opacity-0 scale-[0.96] open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-[0.96] motion-safe:transition-[opacity,scale,display,overlay] motion-safe:transition-discrete motion-safe:duration-200 motion-safe:ease-out"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-lg font-semibold text-gray-800">
          {title}
        </h2>
        <Button
          onClick={onClose}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {children}
    </dialog>
  );
};
