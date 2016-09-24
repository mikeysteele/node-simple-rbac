
# Node Simple RBAC
(Role Based Access Control)

# Description

Loosely inspired by ZF-FR RBAC and Zfc-RBAC for Zend Framework.
Supports multiple providers (In Memory, Object) and you can extend with your own, as well as assertions


# InMemory Example

```js

var Rbac = require('./index.js');
var assertions = {
 'permission2': function (rbac, user, resource, resolve,reject) {
        resolve(user.username === resource.author);
  }

}


var rbac = new Rbac({
    assertions: assertions,
    roles: {
        role_a: [ 
          'permission1', 'permission2'
        ]
    } 
});




var user = {
    username: 'michael',
    role: 'role_a'

}


var user2 = {
    username: 'james',
    role: 'role_a'

}
var article = {
    author: 'michael'

}

rbac.IsGranted(user, 'permission1').then(function (access) {
    if (!access) {
        console.log('unauthorised');
    } else {
        console.log('ok!')
    }

});

rbac.IsGranted(user, 'permission2', article).then(function (access) {
    if (!access) {
        console.log('not asserted');
    } else {
        console.log('asserted!')
    }

});


rbac.IsGranted(user2, 'permission2',article).then(function (access) {
    if (!access) {
        console.log('not asserted');
    } else {
        console.log('asserted!')
    }

});

```










