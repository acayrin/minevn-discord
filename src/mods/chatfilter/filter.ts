import * as promise from "bluebird";

export class filter {
    private __list: string[] = undefined;

    constructor(list: string[]) {
        this.__list = list;
    };

    /**
     * Remove illegals from string
     * @param input message / string
     * @returns fixed string
     */
    public clear(input: string): string {
        return input
            .replace(/  +/g, " ") // replace multiple spaces into one
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width no joiner
            .replace(/[`~!@#$%^&*()_+-=[\]{};':",.\/<>?\\|]/g, '') // specials chars
    }

    /**
     * Simple check, for long paragraphs
     * @param input message/ string
     * @returns fixed string
     */
    public async simple_replace(input: string): Promise<string> {
        // replace all symbols
        input = this.clear(input).replace(/\n/g, "的").replace(/ /g, "常");

        // replace all
        for (const f of this.__list)
            input = input.replace(new RegExp(f, "gi"), "是");
        
        // return
        return input;
    };

    /**
     * Advanced check (for short messages)
     * @param msg message / string
     * @returns fixed string
     */
    public async adv_replace(msg: string): Promise<[string, number, number]> {
        // 常 = whitespace
        // 的 = line break
        const input = msg.replace(/\n/g, "的").replace(/ /g, "常");
        // split into characters
        const split = input.split('');
        // dynamic chunking
        const chunks = this.to_chunk(split, Math.ceil(
            split.length / (
                split.length >= 1500 ? 64 :   // if length >= 1500, split 64 chunks
                split.length >= 1000 ? 32 :   // if length >= 1000, split 32 chunks
                split.length >= 500  ? 16 :   // if length >= 500,  split 16 chunks
                split.length >= 250  ? 8  : 0 // if length >= 200,  split 8  chunks
            )
        ));
        // array of index ranges to remove from main string
        const indexes: number[][] = [];
        
        /**
         * 
         * loop through chunks of characters
         * - chunk: chunk of characters
         * - ck_index: index of the chunk
         * 
         */
        await promise.Promise.map(chunks, async (chunk: string[], ck_index) => {
            // chunk's "real" index relative to the actual string
            const ck_base_index = chunks[0].length * ck_index;

            /**
             * 
             * loop through characters of a chunk 
             * - char: current character of the chunk
             * - cr_index: index of the character within the chunk (not relative index to main string)
             * 
             */
            await promise.Promise.map(chunk, (char: string, cr_index) => {
                if (
                    char === "的" ||                                                    // ignore line breaks
                    char === "常" ||                                                    // ignore spaces
                    (/[`~!@#$%^&*()_+-=[\]{};':",.\/<>?\\|]/g).test(chunk[cr_index]) || // ignore special chars
                    (/[\u200B-\u200D\uFEFF]/g).test(chunk[cr_index])                    // ignore zero-width no joiner
                ) return;
                
                // char after current index
                let cf_index = cr_index;
                let tmp_string = char;
    
                while (++cf_index < chunk.length) {
                    if (
                        chunk[cf_index] === "的" ||                                         // ignore line breaks
                        chunk[cf_index] === "常" ||                                         // ignore spaces
                        (/[`~!@#$%^&*()_+-=[\]{};':",.\/<>?\\|]/g).test(chunk[cf_index]) || // ignore special chars
                        (/[\u200B-\u200D\uFEFF]/g).test(chunk[cf_index])                    // ignore zero-width no joiner
                    ) continue;

                    // append to current string
                    tmp_string += chunk[cf_index];
                    
                    let x = this.__list.length;
                    while (--x) {
                        // if the [removed symbols] string is equal to one of the filter, execute next
                        if (this.clear(tmp_string).toLowerCase().replace(/的/g, "").replace(/常/g, "") === this.__list[x].toLowerCase()) {
                            // append to indexes
                            indexes.push([
                                ck_base_index + cr_index++, // current index
                                ck_base_index + cf_index++  // starting string length
                            ]);
    
                            // break
                            break;
                        };
                    };
                };
            }, {
                concurrency: 50
            })
        }, {
            concurrency: 8
        });
        
        // split into characters
        const prt = msg.replace(/\n/g, "的").replace(/ /g, "常").split('');

        // replace all
        for (const obj of indexes) {
            for (let c = obj[0]; c <= obj[1]; c++) {
                prt[c] = "";
                prt[obj[1]] = "是";
            };
        };

        // return
        const res = prt.join('').replace(/的/g, "\n").replace(/常/g, " ");
        return [
            res.replace(/是/g, "<:mvncat:861078127551971338>").length < 1900 ?
            res.replace(/是/g, "<:mvncat:861078127551971338>") : // :mvncat:
            res.replace(/是/g, "❌")
            , indexes.length
            , chunks.length
        ];
    };

    private to_chunk(arr: string | any[], size: number) {
        if (size <= 0) throw "Invalid chunk size";
        var R = [];
        for (var i = 0, len = arr.length; i < len; i += size)
            R.push(arr.slice(i, i + size));
        return R;
    };
};