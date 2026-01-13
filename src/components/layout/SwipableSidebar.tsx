"use client";

import React, { useState, FC, SVGProps } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

// An icon for the trigger button
const HamburgerIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const SIDEBAR_WIDTH = 288; // w-72 in Tailwind
const SWIPE_CONFIDENCE_THRESHOLD = 10000;

// Framer Motion variants for the sidebar animation
const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  closed: {
    x: -SIDEBAR_WIDTH,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// Variants for the backdrop overlay
const backdropVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

export function SwipableSidebar() {
  const [open, setOpen] = useState<boolean>(false);

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Calculate swipe confidence using velocity and offset
    const swipe = Math.abs(info.offset.x) * info.velocity.x;

    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      // A confident swipe left should close the sidebar
      setOpen(false);
    } else if (info.offset.x < -SIDEBAR_WIDTH / 2) {
      // If dragged more than halfway, close it
      setOpen(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
          <HamburgerIcon />
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                variants={backdropVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 bg-black/50"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                className="fixed inset-y-0 left-0 h-full w-72 bg-white p-6 shadow-xl focus:outline-none"
              >
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Navigation
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-gray-600">
                  Swipe left to close this panel.
                </Dialog.Description>
                <nav className="mt-8">
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="block p-2 rounded-md hover:bg-gray-100"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block p-2 rounded-md hover:bg-gray-100"
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block p-2 rounded-md hover:bg-gray-100"
                      >
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
                <Dialog.Close asChild>
                  <button
                    className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-200"
                    aria-label="Close"
                  >
                    X
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
