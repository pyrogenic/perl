export default function minimize(a: string | undefined): string | undefined {
    return a?.replace(/^\W*((an?|the) )?/i, "");
}
