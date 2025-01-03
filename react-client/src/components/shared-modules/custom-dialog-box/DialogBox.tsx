import React from "react";
import { motion } from 'framer-motion';

interface DialogProps {
  title: string;
  description?: string;
  extraButtons?: JSX.Element[];
  onOk: () => void;
  isOpen: boolean;
  onClose: () => void; // Optional for closing the dialog from outside
}

const DialogBox: React.FC<DialogProps> = ({
  title,
  description,
  extraButtons,
  onOk,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null; 
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white p-3 rounded-lg shadow-lg w-96"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl bg-red-600 rounded-full py-1 px-3 font-bold text-white hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {description && <p className="mt-2 text-gray-700 text-sm">{description}</p>}

        <div className="mt-4 flex justify-center space-x-4">
          {extraButtons}
          <button
            onClick={onOk}
            className="px-4 py-2 bg-[#FF8080] text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DialogBox
