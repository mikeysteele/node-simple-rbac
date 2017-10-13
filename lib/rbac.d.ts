export default class rbac {
    private config;
    private guards;
    private assertions;
    private provider;
    private providers;
    constructor(config: any);
    IsGranted(user: any, permission: any, resource: any): any;
    private _resolveProvider(providerConfig);
    private _assert(user, permission, resource);
    private _getProviders();
}
