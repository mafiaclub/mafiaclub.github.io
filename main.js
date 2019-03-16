// we use github as a prefix because this reduces latency on updates
var prefix = 'https://raw.githubusercontent.com/mafiaclub/mafiaclub.github.io/master';

var tierFileFor = function(tierID) {
  return 'tiers/' + tierID + '.json';
}


// Takes a json object of all of the role data and a role name and produces
// the object representing that role, with additional information.
// Returns undefined if the role is not defined.
var getRoleData = function(allRoleData, roleName) {
  return allRoleData.find(x => x.name === roleName);
}

var toArray = function(x) {
  if (x === undefined) {
    return [];
  } else {
    return [x];
  }
}

// https://stackoverflow.com/questions/7753448/how-do-i-escape-quotes-in-html-attribute-values
function quoteattr(s, preserveCR) {
    preserveCR = preserveCR ? '&#13;' : '\n';
    return ('' + s) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        /*
        You may add other replacements here for HTML only
        (but it's not necessary).
        Or for XML, only if the named entities are defined in its DTD.
        */
        .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
        .replace(/[\r\n]/g, preserveCR);
}
