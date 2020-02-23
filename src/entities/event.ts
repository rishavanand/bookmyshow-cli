export interface IEventRating {
    bmsRating: number,
    bmsCount: number,
    criticRating: number,
    criticCount: number,
    userRating: number,
    userCount: number,
    userReviewCount: number,
    avgRating: number,
    totalVotes: number,
    wtsCount: number,
    dwtsCount: number,
    maybe: number,
    totalWTSCount: number,
    wtsPerc: number,
    dwtsPerc: number
};

export interface IChildEvent {
    EventCode: string,
    EventImageCode: string,
    EventLanguage: string,
    EventStatus: string,
    EventName: string,
    EventDimension: string,
    EventDate: string,
    EventRating: string,
    EventURL: string,
    EventGenre: string,
    Genre: string[],
    EventSynopsis: string,
    EventDuration: string,
    EventTrailerURL: string,
    RegCode: string,
    ShowDate: string,
    Duration: string
}

export interface IEvent {
    EventTitle: string,
    EventGrpDuration: string,
    EventGrpGenre: string,
    EventGrpCensor: string,
    ratings: IEventRating,
    EventURLTitle: string,
    ChildEvents: IChildEvent[]
};

export interface IEventResponse {
    moviesData: {
        BookMyShow: {
            arrEvents: IEvent[]
        }
    }
}

export interface IMovie {
    code: string,
    name: string,
    synopsis: string,
    duration: number,
    showDate: string,
    genre: string,
    trailerUrl: string,
    language: string,
    status: string,
    bookmyshowUrl: string
}