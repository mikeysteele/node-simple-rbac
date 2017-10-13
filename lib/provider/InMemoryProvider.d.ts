import { IProvider } from './IProvider';
export declare class InMemoryProvider implements IProvider {
    private _roles;
    setConfig(config: any): void;
    getPermissions(user: any): Promise<{}>;
}
