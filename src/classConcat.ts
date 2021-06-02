import join, { Strings } from "./join";

export type { Strings as ClassNames };

const classConcat = join.bind(null, " ");

export default classConcat;
