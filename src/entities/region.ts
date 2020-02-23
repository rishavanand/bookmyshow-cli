export interface IRegion {
    code: string,
    name: string,
    alias: string
};

export interface IRegionMap {
    [key: string]: IRegion[];
}