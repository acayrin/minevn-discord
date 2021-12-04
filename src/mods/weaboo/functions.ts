import fetch from "node-fetch";
import { __tags } from "./endpoints";

// combine all tags from all endpoints
export const __all: string[] = [];
Object.keys(__tags).forEach((key) =>
    __tags[key].forEach((tag: string) => {
        if (!__all.includes(tag)) __all.push(tag);
    })
);

/**
 * Get a random image from any endpoint (with user defined tag)
 *
 * @param {string} what Tag to search for
 * @returns {Promise<string>} URL of the image, undefined if not found
 */
export const __random = async (what?: string): Promise<string> => {
    // store which endpoint has user defined tag
    const from: string[] = [];

    // if a tag is defined
    if (what) {
        Object.keys(__tags).forEach((url) => {
            if (__tags[url].includes(what)) from.push(url);
        });
    }

    // use a random url
    const url = what
        ? from[Math.floor(Math.random() * from.length)]
        : Object.keys(__tags)[
              Math.floor(Math.random() * Object.keys(__tags).length)
          ];

    // use user's defined tag or a random one
    const tag =
        what || __tags[url][Math.floor(Math.random() * __tags[url].length)];

    // try to fetch the image, return undefined if fail
    try {
        const img = JSON.parse(await (await fetch(`${url}${tag}`)).text());
        return img["url"] || img["image"];
    } catch (e) {
        return undefined;
    }
};
