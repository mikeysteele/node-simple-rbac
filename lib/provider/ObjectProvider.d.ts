import { IProvider } from './IProvider';
export declare class ObjectProvider implements IProvider {
    private _roleKey;
    private _permissionKey;
    private _permissionName;
    private _flatternPermissions(permissions);
    setConfig(config: any): void;
    getPermissions(object: any): Promise<{}>;
}
