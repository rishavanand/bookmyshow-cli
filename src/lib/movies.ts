import fetch from 'node-fetch';
import { fetchCities } from '../lib';
import { IRegion, IEventResponse, IEvent, IMovie } from '../entities';

/*
* Function to fetch list of Movies
*/
export const fetchAllMovies = (city: string): Promise<IMovie[]> => {
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
            .then(res => <Promise<IEventResponse>>res.json())
            .then((eventResponse: IEventResponse) => {
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
                        bookmyshowUrl: event.ChildEvents[0].EventURL
                    };
                });
                return movies;
            })
            .then((movies: IMovie[]) => {
                console.table(movies, ['code', 'name', 'genre', 'language'])
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
            // Fetch movies
            .then((regionCode) => {
                return fetch('https://in.bookmyshow.com/serv/getData?cmd=QUICKBOOK&type=MT', {
                    method: 'GET',
                    headers: {
                        'Cookie': 'Rgn=%7CCode%3D' + regionCode
                    }
                })
            })
            .then(res => <Promise<IEventResponse>>res.json())
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
            .then((movie: IMovie): IMovie => {
                console.log(movie);
                return movie;
            })
            // Resolve
            .then(resolve)
            // Reject
            .catch(reject)
    });
}