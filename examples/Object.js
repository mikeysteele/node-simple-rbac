var Rbac = require('../index.js');
var assertions = {
    'permission2': function (rbac, user, article, resolve,reject) {
            resolve(user.username === article.author.username);
    }
}
 
var rbac = new Rbac({
    assertions: assertions,
    provider: {
        type: 'ObjectProvider',
        roleKey: 'role',
        permissionKey:  'permissions',
        permissionName: 'name',
    }	
});
 
var user = {
    username: 'michael',
    role: {
        name: 'role_a',
        permissions: [
            {
                name: 'permission1'
            },
            {
                name: 'permission2'
            }
        ]
    }
 
}
 
var user2 = {
    username: 'james',
    role: {
        name: 'role_b',
        permissions: [
         
            {
                name: 'permission2'
            }
        ]
    }
 
};
 
var article = {
    author: {
        username: 'michael'
    }
};
 
rbac.IsGranted(user, 'permission1').then(function (access) {
    console.log(access); //true 
 
},function(e){
    console.log(e);
};);
rbac.IsGranted(user2, 'permission1').then(function (access) {
    console.log(access); //false 
 
});
rbac.IsGranted(user, 'permission2', article).then(function (access) {
    console.log(access); //true 
});
 
 
rbac.IsGranted(user2, 'permission2',article).then(function (access) {
    console.log(access); //false 
});