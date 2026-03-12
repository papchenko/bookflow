import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { supabase } from "../../../supabase";
import { FaRegCopy } from "react-icons/fa";

const DonateModal = ({ isOpen, setIsOpen }) => {

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  if (!isOpen) return null;

const handleSubmit = async (e) => {
  e.preventDefault();

  const { error } = await supabase
    .from("donations")
    .insert([
      {
        name: donorName,
        email: donorEmail || null,
        amount: amount ? Number(amount) : null
      }
    ]);

    if (error) {
        toast.error("Failed to record donation");
        console.error(error);
        return;
    }

    toast.success("Thank you for supporting the project!");

    setDonorName("");
    setDonorEmail("");
    setAmount("");
    setIsOpen(false);
    };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="
        bg-white
        dark:bg-gray-800
        w-full
        max-w-md
        p-6
        rounded-xl
        shadow-xl
        relative
        text-gray-700
        dark:text-white
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Confirm Donation
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
          >
            <FaTimes className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="text-xl mb-3">
        <p className="text-sm opacity-70 pb-1">card number</p>
        <div className="text-gray-700 font-semibold dark:text-white rounded flex justify-start gap-8 items-center">
        <span style={{letterSpacing:"2px"}}>4790 7299 2893 6954</span>
        <FaRegCopy className="cursor-pointer"
            onClick={()=>{navigator.clipboard.writeText("4790729928936954");toast.success("Card copied!");}}/>
        </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          After sending support to our card, confirm your donation here.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-1">

          <input
            type="text"
            placeholder="Your name"
            required
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="px-3 py-2 rounded border dark:border-gray-600 bg-transparent"
          />

          <input
            type="email"
            placeholder="Your email (optional)"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="px-3 py-2 rounded border dark:border-gray-600 bg-transparent"
          />
            <div className="relative">
            <input
                type="number"
                placeholder="Donation amount"
                value={amount}
                min="1"
                onChange={(e) => setAmount(e.target.value)}
                className="px-3 py-2 pr-10 rounded border w-full dark:border-gray-600 bg-transparent"
            />
            <span className="absolute right-3 top-2 text-gray-700">₴</span>
            </div>
          <button
            type="submit"
            className="bg-[var(--accept-color)] hover:bg-[var(--accept-color-hover) text-white py-2 rounded"
          >
            Confirm Donation
          </button>

        </form>
      </div>
    </div>
  );
};

export default DonateModal;