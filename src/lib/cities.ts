import fetch from 'node-fetch';
import { IRegion, IRegionMap } from '../entities';

/*
* Function to fetch list of cities
*/
export const fetchCities = (cityName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Fetch list
        fetch('https://in.bookmyshow.com/serv/getData/?cmd=GETREGIONS')
            .then(res => res.text())
            // Clean response
            .then((res: string) => {
                res = res.replace('var regionlst=', '');
                res = res.replace(';var regionalias=', '&&');
                res = res.replace(';var statelist=[];var subregionlist=', '&&');
                let arr: string[] = res.split('&&');
                return arr;
            })
            // Convert to JSON
            .then((res: string[]) => {
                return res.map((r: string): JSON => JSON.parse(r))
            })
            // Extract regions
            .then((res: JSON[]): IRegion[] => {
                const regionList: IRegionMap = <IRegionMap><unknown>res[0];
                const regionCodes: string[] = Object.keys(regionList);
                const regions: IRegion[] = regionCodes.map(code => regionList[code][0]);
                return regions;
            })
            .then((regions: IRegion[]) => {
                const cities: IRegion[] | undefined = regions.filter((r) => {
                    if (r.alias.search(cityName) > -1 || r.code.search(cityName) > -1 || r.name.search(cityName) > -1)
                        return true;
                    else
                        return false;
                });
                if (cities) {
                    console.table(cities);
                    console.log('Use the exact code, name, alias in place of `city` while searching for movies.');
                } else {
                    throw new Error('Oops! City not found');
                }
            })
            // Resolve
            .then(resolve)
            // Reject
            .catch(reject)
    });
}