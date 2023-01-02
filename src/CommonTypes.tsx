import type React from "react";

export type FormControlChangeHandler = (e: Parameters<React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>[0]) => void;
