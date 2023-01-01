import { ClassNames } from "./classConcat";
import type { HTMLAttributes } from "react";

type HTMLProps = Partial<Pick<HTMLAttributes<"span">, "style"> & {
    className: ClassNames,
}>;

export default HTMLProps;
