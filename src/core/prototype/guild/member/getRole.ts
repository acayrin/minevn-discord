import Eris from 'eris';

declare module 'eris' {
  export interface Member {
    /**
		 * @description Get a role of this user
		 * @author acayrin
		 * @param {string} query
		 * @returns {Eris.Role | undefined}
		 * @memberof Member
		 */
    getRole(query: string): Eris.Role | undefined;
  }
}

Eris.Member.prototype.getRole = function (this: Eris.Member, query: string) {
  for (const r of this.roles) {
    const role = this.guild.getRole(r);

    if (role) {
      if (role.id.toString().includes(query)) {
        return role;
      } else if (role.name.includes(query)) {
        return role;
      }
    }
  }

  return undefined;
};
