import Eris from "eris";

// eris permissions keys
const list = [...(Object.keys(Eris.Constants.Permissions) as Array<keyof typeof Eris.Constants.Permissions>)] as const;
type types = typeof list[number];

// eris permissions values
const values = Eris.Constants.Permissions;

// discord role permission values
const perm_types = ["allow", "deny", "default"] as const;
type discord = typeof perm_types[number];

export default values;
export type { types, discord };
