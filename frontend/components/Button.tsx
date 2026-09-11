"use client";

import React from "react";

interface ButtonProps {
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  variant = "default",
  size = "default",
  className = "",
  children,
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseClasses = "flex items-center justify-center gap-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    default: "bg-primary-600 text-primary-foreground hover:bg-primary-700",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-hover hover:bg-destructive/90",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-xs",
    lg: "h-11 px-8 text-sm",
    icon: "h-10 w-10 p-0",
  };

  const classes = `${baseClasses} ${variantClasses[variant || "default"]} ${sizeClasses[size || "default"]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}