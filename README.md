
# Node Simple RBAC
(Role Based Access Control)

# Description

Loosely inspired by ZF-FR RBAC and Zfc-RBAC for Zend Framework.
* Supports multiple providers. In Memory, Object, as well as Custom.
* Supports assertions to protect resources
* Promise Based

# Installation
npm install node-simple-rbac or clone the git repo

# Configuration
see examples

# Assertions

Assertions can be used to see if a specific user has access to a specific resource after the permission is checked. For example, when editing an article, we can see if the user is the author or a superuser
```js
function assertion(rbac, user, resource, resolve,reject) {
        try{
            rbac.IsGranted(user, 'superuser').then(function (access) {
                if (access){
                    return resolve(true);
                }
                resolve(user.username === resource.author.username);
            })
            
        }catch(e){
            reject(e);
        }
}
```

Assertions can be supplied in an object keyed by the permission name
```js
var assertions = {
    'permission2': function (rbac, user, resource, resolve,reject) {
            resolve(user.username === resource.author.username);
    },
    'permission3': function (rbac, user, resource, resolve,reject) {
            resolve(user.company === resource.comp);
    }
}

```

# InMemory Provider

Simplest implemtation where roles are permissions are held in an object in memory. This is enabled by default

```js
var Rbac = require('node-simple-rbac');
var assertions = {
    'permission2': function (rbac, user, article, resolve,reject) {
            resolve(user.username === article.author.username);
    }
}

var rbac = new Rbac({
    assertions: assertions,
    provider: {
        roles: {
            role_a: [ 
                'permission1', 
                'permission2'
            ],
            role_b: [ 
                'permission2'
            ]
        } 
    }	
});

var user = {
    username: 'michael',
    role: 'role_a'
};

var user2 = {
    username: 'james',
    role: 'role_b'

};

var article = {
    author: {
        username: 'michael'
    }
};

rbac.IsGranted(user, 'permission1').then(function (access) {
    console.log(access); //true

});
rbac.IsGranted(user2, 'permission1').then(function (access) {
    console.log(access); //false

});
rbac.IsGranted(user, 'permission2', article).then(function (access) {
    console.log(access); //true
});


rbac.IsGranted(user2, 'permission2',article).then(function (access) {
    console.log(access); //false
});

```


# Object Provider

The object provider is useful if your authentication is done upstream (for example using a web service) and your user object already has the roles and permissions attached
```js

var Rbac = require('node-simple-rbac');

var rbac = new Rbac({
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
rbac.IsGranted(user, 'permission1').then(function (access) {
    console.log(access); //true
});
```
# Custom Providers

A custom provider is any object with a getPermissions method which takes a user object and returns a list of promise which resolves an array of permissions.
For example, you could use sequelize

```js
var User = require('../models').User;
var customProvider = {};
customProvider.getPermissions = function (user) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            where: {
                username: user.username
            },
            include: {
                model: models.Role,
                include: {
                    model: models.Permission

                }
            }
        }).then(function (user) {
            if (!user) {
                return reject('user not found');
            }
            resolve(user.Role.Permissions.map(function (value) {
                return value.name;
            }));
        });
    });
};

var rbac = new Rbac({
    
    provider: {
        type: customProvider
    }	
});



