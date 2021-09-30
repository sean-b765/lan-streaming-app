# LAN streaming service API

1. [Setup](#setup)
2. [Initialization](#initialization)
3. [API Endpoints](#api-endpoints)
   - [Example responses](#example-responses)
   - [Client routes](#client-routes)
   - [Admin initialization](#admin-initialization)
4. [Server initialization process](#server-initialization-process)
5. [Performance](#performance)
   - [_Disclaimer_](#disclaimer)

An API used to stream movies and tv

## Setup:

- `npm i` - install npm packages
- `cd dist`
- `node index.js` || `nodemon index.js` - start the server

## Initialization:

- **Must have the correct folder structure/naming convention:**
  ![Correct folder structure](./screenshots/structure.png)
- If there are existing documents, first drop the collections (always safe to just do this first)
- Hit the /files/scan endpoint and wait a minute or two (depending on how large your media folder is). This will impact the performance of your CPU

## API Endpoints

### Example responses

Result (movie/episode):

```
[
  {
    _id:          string,
    path:         string,
    duration:     number,
    size:         number,
    extension:    string,
    name:         string,
    displayName:  string,
    description:  string,
    vote_average: number,
    date:         string,
    poster?:      string,
    backdrop?:    string,
    series?:      string,
    season?:      string,
    episode?:     number,
    episodeName?: string
  }
]
```

Result (series):

```
[
  {
    _id:          string,
    path:         string,
    tmdb_id:      number,
    name:         string,
    description:  string,
    vote_average: number,
    date:         string,
    poster?:      string,
    backdrop?:    string
  }
]
```

Result (season):

```
[
  {
    _id:          string,
    path:         string,
    name:         string,
    description:  string,
    date:         string,
    artwork?:     string
  }
]
```

### Client routes

**Get movies**

`GET http://localhost:5000/files/media`

**Get series**

`GET http://localhost:5000/files/series`

**Get items from series** - will return media or seasons array along with the variable - `isMedia: [true/false]` indicating whether the response is an array of media or seasons, respectively

`GET http://localhost:5000/files/series/[_id]`

**Get items from season**

`GET http://localhost:5000/files/season/[_id]`

### Admin initialization

**Scan the specified directory for all files**

`GET http://localhost:5000/files/scan`

**Drop all MongoDB collections**

`GET http://localhost:5000/files/drop`

## Server initialization process

![flowchart of initialization](./screenshots/chart.drawio.png)

## Performance

During initialization, requests are sent to TMDB's API to retrieve the details of each media. Details are gathered for each series/season (folders), and media item (file). This happens for each media file in your set directory. If you have 300 media files, you will have at least 300 requests performed in the span of a few seconds.

### Disclaimer

This can really hinder your CPU's performance if you don't have a half-decent processor. However, initialization only needs to be performed once unless you want to update your database with newly added media.
