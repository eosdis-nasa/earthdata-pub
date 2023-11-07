import fetch from "node-fetch";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const rolesNameObject = {
    data_producer: "Data Producer",
    data_poc: "Data Point of Contact",
    manager: "DAAC Data Manager",
    coordinator: "DAAC Data Coordinator",
    observer: "DAAC Observer",
    admin: "Administrator"
};

const userRolesObject = {
    admin: "75605ac9-bf65-4dec-8458-93e018dcca97",
    observer: "4be6ca4d-6362-478b-8478-487a668314b1",
    coordinator: "2aa89c57-85f1-4611-812d-b6760bb6295c",
    manager: "a5b4947a-67d2-434e-9889-59c2fad39676",
    data_poc: "29ccab4b-65e2-4764-83ec-77375d29af39",
    data_producer: "804b335c-f191-4d26-9b98-1ec1cb62b97d",
};

const userGroupsObject= {
    root_group: "4daa6b22-f015-4ce2-8dac-8b3510004fca",
    asdc: "bf07c445-8217-4f97-827a-82838cce36fb",
    asf_daac: "b9e586c8-f602-4eae-98e1-5b406cd15ad2",
    cddis: "fbc74dbc-4704-4b3e-b06a-43a78d6e7685",
    ges_disc: "2385734f-f834-41dc-946c-11e23af6f3d6",
    ghrc_daac: "e31d5a49-261a-4678-88e1-548ffb82df68",
    laads_daac: "a0cda6f0-cc7d-4317-a3bb-115d51e713cc",
    lp_daac: "d148c374-1b07-46a1-b06b-bee67c7c6447",
    nsidc: "7004aeee-34ea-4f68-a27b-eb34efc993f3",
    ob_daac: "65ba2a19-b296-4f2b-bf0c-4c1e8f226298",
    ornl_daac: "89816689-5375-4c81-a30c-bf6ed12d30fb",
    po_daac: "e847900e-90e2-47f8-85c6-94e06bcbcca0",
    sedac: "f0a89bc6-707f-4a34-8041-1593934c2e42",
    unassigned: "5be24b44-d66b-4396-9266-a9d066000d9e"
};

/**
 * Get EDPub Authentication Token for desired role and group permissions
 * @param  {Array} roles Array containing desired role short names
 * @param  {Array} groups Array containing desired group short names
 * @return {String} A string containing the authentication token for the desired role/group permissions
 */
async function getEDPubToken(roles, groups) {
    const data = {
        email: "fake@test.com",
        name: roles.map((role) => {
            return rolesNameObject[role];
        }).join(', '),
        new_user: true,
        state: "dashboard",
        user_groups: groups.map((group) => {
            return userGroupsObject[group];
        }),
        user_roles: roles.map((role) => {
            return userRolesObject[role];
        })
    }
    let response = await fetch(`http://localhost:8080/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(( data ) => data.json());
    const user_code = response.redirect.match(/.*\?(.*)&.*/)[1]
    response =  await fetch(`http://localhost:8080/api/token?${user_code}&state=dashboard`).then(
        ( data ) => data.json());
    return `Bearer ${response.token}`;
}

/**
 * Returns this script's help output
 * @return {String} A string containing the authentication token for the desired role/group permissions
 */
function logScriptHelp() {
    return `usage: get_edpub_token.py[-h]
                          [-r {admin,observer,coordinator,manager,data_poc,data_producer}]
                          [-g {root_group,asdc,asf_daac,cddis,ges_disc,ghrc_daac,laads_daac,lp_daac,nsidc,ob_daac,
                               ornl_daac,po_daac,sedac,unassigned}]

Get authorization token for EDPub API. Without roles/groups defined via the command line arguments, the authenticaiton 
token provided will have the 'admin' role and 'root_group' group. To add multiple roles/groups you will need to use
the appropriate flags multiple times (see example).

optional arguments:
  -h, --help            show this help message and exit
  -r {admin,observer,coordinator,manager,data_poc,data_producer},
  --role {admin,observer,coordinator,manager,data_poc,data_producer}
                        Name of desired user role
  -g {root_group,asdc,asf_daac,cddis,ges_disc,ghrc_daac,laads_daac,lp_daac,nsidc,ob_daac,ornl_daac,po_daac,sedac,
      unassigned},
  --group {root_group,asdc,asf_daac,cddis,ges_disc,ghrc_daac,laads_daac,lp_daac,nsidc,ob_daac,ornl_daac,po_daac,sedac,
           unassigned}
                        Name of desired user group
                        
examples:
  node get_edpub_token.js
  node get_edpub_token.js -r admin
  node get_edpub_token.js -r 'admin'
  node get_edpub_token.js -r admin -r coordinator
  node get_edpub_token.js -r admin -r coordinator -g root_group
  node get_edpub_token.js -r admin -r coordinator -g ornl_daac -g ghrc_daac
  node get_edpub_token.js --role admin -r coordinator --group ornl_daac -g ghrc_daac
  `;
}

const roles = (argv.r && argv.role) ? [].concat(argv.r).concat(argv.role) : argv.r ? argv.r : argv.role ?
    argv.role : ['admin'];
const groups = (argv.g && argv.group) ? [].concat(argv.g).concat(argv.group) : argv.g ? argv.g : argv.group ?
    argv.group : ['root_group'];


const console_output = argv.h ? logScriptHelp() : await getEDPubToken([].concat(roles), [].concat(groups));
console.log(console_output);
