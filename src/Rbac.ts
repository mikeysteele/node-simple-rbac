/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { ObjectProvider } from './provider/ObjectProvider';
import { InMemoryProvider } from './provider/InMemoryProvider';
export class Rbac {

    private config: any;
    private guards;
    private assertions: any;
    private provider;
    private providers: any;

    constructor(config) {
        this.config = config;
        this.guards = config.guards || {};
        this.assertions = config.assertions || {};
        this.provider = this._resolveProvider(config.provider);
    }

    public IsGranted(user, permission, resource) {
        var self = this;
        return self.provider.getPermissions(user).then((GrantedPermissions) => {
            if (GrantedPermissions.indexOf(permission) > -1) {
                if (resource) {
                    return self._assert(user, permission, resource).then((status) => {
                        return status;
                    }, (e) => {
                        return Promise.reject({
                            error: 'Assertion Failed to complete',
                            detail: e
                        });
                    });
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }).catch((err) => {
            return Promise.reject({
                error: 'Provider failed to get permissions',
                detail: err,
                provider: self.config.provider.type
            });
        });

    };
    private _resolveProvider(providerConfig) {
        providerConfig.type = providerConfig.type || 'InMemoryProvider';
        const provider = providerConfig.type;
        if (!provider) {
            throw new Error('no provider available');
        }
        if (typeof provider === 'object' && provider !== null) {
            if (provider.getPermissions instanceof Function === false) {
                throw new Error('Provider object must have getPermissions()');
            }
            if (provider.setConfig instanceof Function) {
                provider.setConfig(providerConfig);
            }
            return provider;
        }
        const providerInstance = this._getProviders()[provider];
        if (providerInstance.setConfig instanceof Function) {
            providerInstance.setConfig(providerConfig);
        }
        return providerInstance;
    }
    private _assert(user, permission, resource): Promise<any> {
        const assertion = this.assertions[permission];
        const self = this;
        if (assertion) {
            if (typeof assertion === 'function') {
                return assertion(this, user, resource);
            } else {
                return Promise.reject('Assertion was not callable');
            }
        } else {
            return Promise.reject(true);
        }
    };
    private _getProviders() {
        if (!this.providers) {
            this.providers = {};
            this.providers['ObjectProvider'] = require('./provider/ObjectProvider.js');
            this.providers['InMemoryProvider'] = require('./provider/InMemoryProvider.js');
        }
        return this.providers;
    }
}
