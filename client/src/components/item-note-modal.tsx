import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, StickyNote } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ItemNoteModalProps {
  itemName: string;
  initialNote: string;
  onClose: () => void;
  onSave: (note: string) => void;
}

export default function ItemNoteModal({ itemName, initialNote, onClose, onSave }: ItemNoteModalProps) {
  const { isDark } = useTheme();
  const [note, setNote] = useState(initialNote);

  function handleSave() {
    onSave(note);
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.5)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-sm rounded-2xl p-5"
          style={{ background: isDark ? "#141414" : "#fff", border: "1px solid var(--bb-border)" }}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <StickyNote size={16} style={{ color: "var(--bb-gold)" }} className="flex-shrink-0" />
              <div className="min-w-0">
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Add a Note
                </h3>
                <p className="text-xs truncate" style={{ color: "var(--bb-text-dim)" }}>
                  {itemName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0"
              style={{ color: "var(--bb-text-dim)" }}
              aria-label="Close"
              data-testid="button-close-item-note"
            >
              <X size={18} />
            </button>
          </div>

          <textarea
            autoFocus
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. no onions, extra spicy, less oil…"
            rows={3}
            maxLength={200}
            className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
            style={{
              background: isDark ? "#1a1a1a" : "#f7f4ee",
              border: "1px solid var(--bb-border)",
              color: "var(--bb-text)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            data-testid="textarea-item-note"
          />

          <button
            onClick={handleSave}
            className="w-full mt-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm"
            style={{ background: "var(--bb-gold)", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
            data-testid="button-save-item-note"
          >
            Save Note
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
