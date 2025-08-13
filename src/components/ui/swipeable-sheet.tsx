"use client";

import React, { useState, useEffect } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SwipeableSheetProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root> {
  side?: "top" | "bottom" | "left" | "right";
}

const SwipeableSheet = ({
  open: controlledOpen,
  onOpenChange,
  side = "right",
  ...props
}: SwipeableSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return <SheetPrimitive.Root open={open} onOpenChange={setOpen} {...props} />;
};

const SwipeableSheetTrigger = SheetPrimitive.Trigger;

const SwipeableSheetClose = SheetPrimitive.Close;

const SwipeableSheetPortal = SheetPrimitive.Portal;

const SwipeableSheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
SwipeableSheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

interface SwipeableSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SwipeableSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SwipeableSheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const [open, setOpen] = useState(true);

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (side === "right" && info.offset.x > 100) {
      setOpen(false);
    } else if (side === "left" && info.offset.x < -100) {
      setOpen(false);
    } else if (side === "top" && info.offset.y < -100) {
        setOpen(false);
    } else if (side === "bottom" && info.offset.y > 100) {
        setOpen(false);
    }
  };

  const variants = {
    open: { x: 0, y: 0 },
    closed: { 
        x: side === 'left' ? '-100%' : side === 'right' ? '100%' : 0,
        y: side === 'top' ? '-100%' : side === 'bottom' ? '100%' : 0,
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <SwipeableSheetPortal>
          <SwipeableSheetOverlay />
          <SheetPrimitive.Content
            ref={ref}
            asChild
            {...props}
          >
            <motion.div
              className={cn(sheetVariants({ side }), className)}
              initial="closed"
              animate="open"
              exit="closed"
              variants={variants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag={side === "left" || side === "right" ? "x" : "y"}
              dragConstraints={ side === 'right' ? { left: 0, right: 0 } : {left: 0, right: 0}}
              onDragEnd={onDragEnd}
            >
              {children}
              <SwipeableSheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SwipeableSheetClose>
            </motion.div>
          </SheetPrimitive.Content>
        </SwipeableSheetPortal>
      )}
    </AnimatePresence>
  );
});
SwipeableSheetContent.displayName = SheetPrimitive.Content.displayName;

const SwipeableSheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SwipeableSheetHeader.displayName = "SheetHeader";

const SwipeableSheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
SwipeableSheetFooter.displayName = "SheetFooter";

const SwipeableSheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SwipeableSheetTitle.displayName = SheetPrimitive.Title.displayName;

const SwipeableSheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SwipeableSheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  SwipeableSheet,
  SwipeableSheetPortal,
  SwipeableSheetOverlay,
  SwipeableSheetTrigger,
  SwipeableSheetClose,
  SwipeableSheetContent,
  SwipeableSheetHeader,
  SwipeableSheetFooter,
  SwipeableSheetTitle,
  SwipeableSheetDescription,
};
