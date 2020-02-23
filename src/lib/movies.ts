import fetch from 'node-fetch';
import { fetchCities } from '../lib';
import { IRegion, IEventResponse, IEvent, IMovie } from '../entities';
import { table } from 'table';

/*
* Function to fetch list of Movies
*/
export const fetchAllMovies = (city: string): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
        // Get region code
        fetchCities(city, false, true)
            .then((regions) => {
                if (!regions.length)
                    throw new Error('City not found. Please use `bookmyshow city [cityName]` to find your city');
                const region: IRegion = regions[0];
                const regionCode: string = region.code;
                return regionCode;
            })
            // Fetch movies
            .then((regionCode) => {
                return fetch('https://in.bookmyshow.com/serv/getData?cmd=QUICKBOOK&type=MT', {
                    method: 'GET',
                    headers: {
                        'Cookie': 'Rgn=%7CCode%3D' + regionCode
                    }
                })
            })
            // Extract JSON
            .then(res => <Promise<IEventResponse>>res.json())
            // Strip needed info
            .then((eventResponse: IEventResponse): string[][] => {
                const events: IEvent[] = eventResponse.moviesData.BookMyShow.arrEvents;
                const movies: string[][] = events.map((event: IEvent) => {
                    return [
                        event.ChildEvents[0].EventCode,
                        event.ChildEvents[0].EventName,
                        event.ChildEvents[0].EventGenre,
                        event.ChildEvents[0].EventLanguage,
                    ]
                });
                return [['Code', 'Name', 'Genre', 'Language']].concat(movies);
            })
            // Print table
            .then((movies: string[][]) => {
                console.log(table(movies))
                return movies;
            })
            // Resolve
            .then(resolve)
            // Reject
            .catch(reject)
    });
}

/*
* Function to fetch single movie
*/
export const fetchSingleMovie = (city: string, movieId: string): Promise<IMovie> => {
    return new Promise((resolve, reject) => {
        // Get region code
        fetchCities(city, false, true)
            .then((regions) => {
                if (!regions.length)
                    throw new Error('City not found. Please use `bookmyshow city [cityName]` to find your city');
                const region: IRegion = regions[0];
                const regionCode: string = region.code;
                return regionCode;
            })
            // Make request
            .then((regionCode) => {
                return fetch('https://in.bookmyshow.com/serv/getData?cmd=QUICKBOOK&type=MT', {
                    method: 'GET',
                    headers: {
                        'Cookie': 'Rgn=%7CCode%3D' + regionCode
                    }
                })
            })
            // Extract JSON
            .then(res => <Promise<IEventResponse>>res.json())
            // Extract important info
            .then((eventResponse: IEventResponse): IMovie[] => {
                const events: IEvent[] = eventResponse.moviesData.BookMyShow.arrEvents;
                const movies: IMovie[] = events.map((event: IEvent) => {
                    return <IMovie>{
                        code: event.ChildEvents[0].EventCode,
                        name: event.ChildEvents[0].EventName,
                        synopsis: event.ChildEvents[0].EventSynopsis,
                        duration: <number><unknown>event.ChildEvents[0].EventDuration,
                        showDate: event.ChildEvents[0].EventDate,
                        genre: event.ChildEvents[0].EventGenre,
                        trailerUrl: event.ChildEvents[0].EventTrailerURL,
                        language: event.ChildEvents[0].EventLanguage,
                        status: event.ChildEvents[0].EventStatus,
                        bookmyshowUrl: `https://in.bookmyshow.com/${event.ChildEvents[0].RegCode}/movies/${event.ChildEvents[0].EventURL}/${event.ChildEvents[0].EventCode}`
                    };
                });
                return movies;
            })
            // Find movie by code
            .then((movies: IMovie[]): IMovie => {
                const movie: IMovie | undefined = movies.find((movie: IMovie) => {
                    if (movie.code === movieId)
                        return true;
                    else
                        return false;
                });
                if (!movie)
                    throw new Error('Movie not found');
                return movie;
            })
            // Beautify and print
            .then((movie: IMovie): IMovie => {

                const config = {
                    columns: {
                        1: {
                            width: 80,
                            wrapWord: true
                        }
                    }
                };

                const tableArray: string[][] = [
                    ['Code', movie.code],
                    ['Name', movie.name],
                    ['Synopsis', movie.synopsis],
                    ['Duration', movie.duration.toString()],
                    ['Show Date', movie.showDate],
                    ['Genre', movie.genre],
                    ['Trailer link', movie.trailerUrl],
                    ['Language', movie.language],
                    ['Booking link', movie.bookmyshowUrl]
                ];
                console.log(table(tableArray, config));
                return movie;
            })
            // Resolve
            .then(resolve)
            // Reject
            .catch(reject)
    });
}