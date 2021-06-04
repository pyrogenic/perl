import upperFirst from "lodash/upperFirst";
import words from "lodash/words";

export default function titleCase(str?: string) {
    return words(str).map(upperFirst).join(" ");
}
