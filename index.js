
var Rbac = require('./lib/Rbac.js').Rbac;
if (typeof window !== 'undefined'){
    window.Rbac = Rbac;
}
module.exports = Rbac;

