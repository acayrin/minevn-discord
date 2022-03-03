import { Logger } from "../../core/utils";
import fetch from "node-fetch";

export class database {
    public static async loadDB(url: string): Promise<string[]> {
        // logger
        const __logger = new Logger();
        const f1 = await fetch(url);
        const f2 = await f1.text();
        const json = JSON.parse(f2);

        // database
        let db: any[] = [];
        Object.keys(json).forEach(key => {
            // merge the database
            db = db.concat(json[key]);
            // logging
            __logger.log(`[Filter] DB :: Added '${key}' [${json[key].length}]`);
        });

        // add additional checks
        for (const check of db) {
            // addtional count
            let _c = 0;

            // sticky cuss words
            if (/ +/g.test(check)) {
                // remove spaces from check string
                db.push(check.replace(/ +/g, ''));
                _c++;

                // vietnamese
                // TO_DO
                /*
                if (this.__reg_A(check)) { db.push(this.__reg_A(check.replace(/ +/g, ''))), _c++ };
                if (this.__reg_D(check)) { db.push(this.__reg_D(check.replace(/ +/g, ''))), _c++ };
                if (this.__reg_I(check)) { db.push(this.__reg_I(check.replace(/ +/g, ''))), _c++ };
                */
            };

            // vietnamese
            // TO_DO
            /*
            if (this.__reg_A(check)) { db.push(this.__reg_A(check)), _c++ };
            if (this.__reg_D(check)) { db.push(this.__reg_D(check)), _c++ };
            if (this.__reg_I(check)) { db.push(this.__reg_I(check)), _c++ };
            */

            // logging
            __logger.debug(`[Filter] DB :: Added '${check}' (${_c} additions)`);
        };

        // logging
        __logger.log(`[Filter] DB :: Loaded [${db.length}] entries`);

        // return the database
        return db;
    };

    /**
     * Check for input whether contains "đ" or "Đ" and convert them into "d"
     * @param input input string
     * @returns fixed string
     */
    private static __reg_D(input: string): string {
        const reg = new RegExp(/đ|Đ+/g);
        if (reg.test(input))
            return input.replace(reg, 'd');
        return undefined;
    };

    /**
     * Check for input whether contains "í", "ị", "Í" or "Ị" and convert them into "i"
     * @param input input string
     * @returns fixed string
     */
    private static __reg_I(input: string): string {
        const reg = new RegExp(/í|Í|ị|Ị|ĩ|Ĩ+/g)
        if (reg.test(input))
            return input.replace(reg, 'i');
        return undefined;
    };

    /**
     * Check for input whether contains "ặ" or "Ặ" and convert them into "a"
     * @param input input string
     * @returns fixed string
     */
    private static __reg_A(input: string): string {
        const reg = new RegExp(/ặ|Ặ/g)
        if (reg.test(input))
            return input.replace(reg, 'a');
        return undefined;
    };
}