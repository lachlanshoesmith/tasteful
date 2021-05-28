const crypto = require('crypto')
const moment = require('moment')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')
const cors = require('cors')

exports.search = functions.https.onRequest((req, res) => {
  return cors()(req, res, () => {
    // it's worth noting that much of this code could be executed client-side
    // but is instead done in this function for, yknow, elegance. might change.
    const queryType = req.query.querytype // release-group, artist..
    const limit = req.query.limit // amount of search results to load
    const region = req.query.region // from which region in particular
    const releaseType = req.query.releasetype // single, ep, lp..
    const query = req.query.query
    // example: /search?query=Kendrick Lamar&queryType=artist&limit=3
    //          &region=All countries&releaseType=All

    const searchResults = []
    const headers = {
      headers: {
        'User-Agent': 'Application tasteful/0.4.0 (lcshoesmith@protonmail.com)'
      }
    }

    const findArtistReleases = (i, artistInDatabase) => {
      searchResults[i].releases = {}
      const id = searchResults[i].id
      if (artistInDatabase) {
        // if the artist exists in the database, read the existing data
        Object.entries(artistInDatabase.releases).forEach(([releaseID, releasegroup]) => {
          searchResults[i].releases[releaseID] = {} // ERROR
          searchResults[i].releases[releaseID].image = releasegroup.image
          searchResults[i].releases[releaseID].title = releasegroup.title
        })
        return 'from database'
      } // if they don't, we'll need to add them
      // find releases
      return axios
        .get('https://musicbrainz.org/ws/2/release-group/?query=arid:' + id + ' AND status:"official" AND primarytype:"album"&limit=30&fmt=json', headers)
        .then(res => res.data['release-groups'])
        .catch((err) => {
          res.status(500).send('ERROR WITH ' + id + ': ' + err)
        })
    }

    const getArtistImageInfo = (wikidataID) => {
      return axios
        .get(
          'https://wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&property=P18&entity=' + wikidataID, headers
        )
        .then(res => res.data.claims.P18[0].mainsnak)
        .catch((e) => {
          // ** AIM TO REPLACE WITH MORE EFFICIENT ALTERNATIVE **
          // getAlbumArtCandidate(i)
        })
    }

    const getArtistRelations = (artist) => {
      return axios
        .get(
          'https://musicbrainz.org/ws/2/artist/' + artist.id + '?inc=url-rels&fmt=json', headers
        )
        .then(res => res.data.relations)
        .catch((err) => {
          res.status(500).send('ERROR WITH ARTIST RELATIONS FOR ' + artist.id + ': ' + err)
        })
    }

    const getWikidataID = (relations) => {
      let foundWikidata = false
      for (let relationIndex = 0; relationIndex < relations.length; relationIndex++) {
        const relation = relations[relationIndex]
        // get wikidata link
        if (relation.type === 'wikidata') {
          foundWikidata = true
          // get wikidata ID
          const wikidataID = relation.url.resource.slice(30) // https://www.wikidata.org/wiki/ = 30 chars
          // lookup image
          return wikidataID
        }
      }
      // if no wikidata page was found, get album art instead
      if (!foundWikidata) {
        // ** AIM TO REPLACE WITH MORE EFFICIENT ALTERNATIVE **
        // getAlbumArtCandidate(i)
      }
    }

    const getArtistImage = (imageInfo, i) => {
      // get filename and location
      // (this process is a serious pain)
      try {
        // remove invalid characters before hash
        let imageName = imageInfo.datavalue.value.replace(/ /g, '_')
        const hashedImageName = crypto.createHash('md5').update(imageName).digest('hex')
        const firstCharacterInHash = hashedImageName.charAt(0)
        const secondCharacterInHash = hashedImageName.charAt(1)
        // remove other invalid characters after hash (generates incorrect md5 otherwise)
        imageName = imageName.replace('(', '%28') // no regex here as these should only occur once.
        imageName = imageName.replace(')', '%29')
        imageName = imageName.replace(',', '%2C')
        // download very low res image first
        const lowResolutionImageURL = 'https://commons.wikimedia.org/w/thumb.php?width=10&f=' + imageName // only 10px wide; stretched and blurred while loading the main image.
        searchResults[i].imageURLLowRes = lowResolutionImageURL
        // Note: may replace full resolution URL with a good-enough alternative (eg. 400px) in the future
        const imageURL = 'https://upload.wikimedia.org/wikipedia/commons/' + firstCharacterInHash + '/' + firstCharacterInHash + secondCharacterInHash + '/' + imageName
        searchResults[i].imageURL = imageURL
      } catch (e) {
        // if an image is not found, replace with tasteful image < TO DESIGN >
        searchResults[i].imageURL = 'artist-icon'
        searchResults[i].imageURLLowRes = 'artist-icon'
        // res.status(500).send(e)
        // if (e === 'TypeError: "res.data.claims.P18 is undefined"') {
        // ** AIM TO REPLACE WITH MORE EFFICIENT ALTERNATIVE **
        // If the artist has no image supplied, get an album artwork instead.
        // getAlbumArtCandidate(i)
        // }
      }
    }

    const getArtistReleaseImageURL = (releasegroup) => {
      return axios
        .get(
          'https://coverartarchive.org/release-group/' + releasegroup.id, headers
        )
        .then(res => res.data.images[0].thumbnails.small)
        .catch((err) => {
          console.log('No album cover found with ' + releasegroup.title + ' @ https://coverartarchive.org/release-group/' + releasegroup.id + '. ' + err)
        })
    }

    const getReleaseArtwork = (releasegroup) => {
      return axios
        .get(
          'https://coverartarchive.org/release-group/' + releasegroup.id, headers
        )
        .then(res => [res.data.images[0].thumbnails.small, res.data.images[0].thumbnails['1200']])
        .catch((err) => {
          if (err.message === 'Request failed with status code 404') {
            // no release artwork found
            return 'no-artwork'
          } else {
            res.status(500).send(err)
          }
        })
    }

    // const processArtistReleases = async (releases, i) => {
    //   // get album artworks
    //   for (const releasegroup of releases) {
    //     searchResults[i].releases[releasegroup.id] = {}
    //     const releaseTitle = releasegroup.title
    //     const imageURL = await getArtistReleaseImageURL(releasegroup)
    //     searchResults[i].releases[releasegroup.id].image = imageURL
    //     searchResults[i].releases[releasegroup.id].title = releaseTitle
    //   }
    // }

    // const saveSearchResultToDatabase = (i) => {
    //   const id = searchResults[i].id
    //   admin.firestore().collection('artists')
    //     .doc(id)
    //     .set(
    //       searchResults[i]
    //     )
    // }

    const processArtists = async (data) => {
      const artists = data.artists
      for (const [i, artist] of artists.entries()) {
        searchResults[i] = artist
        console.log('Starting.')
        // check tasteful database
        const artistInDatabase = await admin.firestore().collection('artists').doc(artist.id)
          .get()
          .then(res => res.data())
        console.log(artistInDatabase)
        const relations = await getArtistRelations(artist)
        console.log('Got relations.')
        const wikidataID = await getWikidataID(relations)
        console.log('Got ID.')
        const imageInfo = await getArtistImageInfo(wikidataID)
        console.log('Got artist image info.')
        getArtistImage(imageInfo, i)
        const artistReleases = await findArtistReleases(i, artistInDatabase)
        console.log('Got artist releases.')
        if (artistReleases !== 'from database') {
          // if it's from the database all data is already obtained, ready to return
          // otherwise we need to find the data and then save it to database
          // await processArtistReleases(artistReleases, i) // This is the bottleneck.
          searchResults[i].releases = artistReleases
          searchResults[i].cached = false
          console.log('Processed artist releases.')
        } else {
          searchResults[i].cached = true
        }
      }
      concludeSearch()
    }

    const processReleases = async (data) => {
      const releases = data['release-groups']
      for (const [i, releasegroup] of releases.entries()) {
        // add to search results
        searchResults[i] = releasegroup
        // get album art
        const releaseArtwork = await getReleaseArtwork(releasegroup, i)
        searchResults[i].image = releaseArtwork[0]
        searchResults[i].imageHQ = releaseArtwork[1]
      }
      concludeSearch()
    }

    const concludeSearch = () => {
      // send back search results as a nice digestable json
      res.status(200).send(searchResults)
    }

    let queryURL = 'https://musicbrainz.org/ws/2/' + queryType + '/?query='

    if (queryType === 'artist') {
      queryURL = queryURL + 'artist:"' + query + '"'
      if (region !== 'All countries') {
        queryURL = queryURL + ' AND country:"' + region
      }
    } else if (queryType === 'release-group') {
      queryURL = queryURL + 'releasegroup:"' + query + '"'
      if (releaseType !== 'All') {
        queryURL = queryURL + ' AND primarytype:"' + releaseType
      }
    }
    queryURL = queryURL + '?inc=genres&fmt=json&limit=' + limit
    // queryURL might look like musicbrainz.org/ws/2/artist/?query=
    //                          artist:"Kendrick Lamar"?inc=genres&fmt=json&limit=3
    // time to call the API!
    axios
      .get(
        queryURL,
        headers
      )
      .then((queryResult) => {
        if (queryType === 'artist') {
          processArtists(queryResult.data)
        } else if (queryType === 'release-group') {
          processReleases(queryResult.data)
        }
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  })
})

exports.processArtistReleases = functions.https.onRequest((req, res) => {
  return cors()(req, res, async () => {
    const id = req.query.id
    const searchResults = {}
    const headers = {
      headers: {
        'User-Agent': 'Application tasteful/0.4.0 (lcshoesmith@protonmail.com)'
      }
    }
    // get releases
    console.log('Processing artist releases.')
    const releases = await axios
      .get('https://musicbrainz.org/ws/2/release-group/?query=arid:' + id + ' AND status:"official" AND primarytype:"album"&limit=30&fmt=json', headers)
      .then(res => res.data['release-groups'])
      .catch((err) => {
        res.status(500).send('ERROR WITH ' + id + ': ' + err)
      })

    const getReleaseArtwork = (releasegroup) => {
      return axios
        .get(
          'https://coverartarchive.org/release-group/' + releasegroup.id, headers
        )
        .then(res => [res.data.images[0].thumbnails.small, res.data.images[0].thumbnails['1200']])
        .catch((err) => {
          // TODO: improve handling here
          console.log('No album cover found.\n' + err)
        })
    }

    for (const [i, releasegroup] of releases.entries()) {
      // add to search results
      searchResults[i] = releasegroup
      // get album art
      const releaseArtwork = await getReleaseArtwork(releasegroup, i)
      searchResults[i].image = releaseArtwork[0]
      searchResults[i].imageHQ = releaseArtwork[1]
    }
    res.status(200).send(releases)
  })
})

exports.getReleaseData = functions.https.onRequest((req, res) => {
  return cors()(req, res, () => {
    const id = req.query.query

    const headers = {
      headers: {
        'User-Agent': 'tasteful/0.4.0 ( lcshoesmith@protonmail.com )'
      }
    }

    const getReleaseArtwork = (releasegroup) => {
      return axios
        .get(
          'https://coverartarchive.org/release-group/' + releasegroup.id, headers
        )
        .then(releaseArt => [releaseArt.data.images[0].thumbnails.large, releaseArt.data.images[0].thumbnails['1200']])
        .catch((err) => {
          res.status(500).send(err)
        })
    }

    const getReleaseInfo = () => {
      return axios
        .get(
          'https://musicbrainz.org/ws/2/release-group/' + id + '?inc=genres&fmt=json',
          headers
        )
        .then(releaseInfo => releaseInfo.data)
        .catch((err) => {
          if (err.response.status === 401) {
            // some releases do not have genres, and this is often the cause of errors
            return 401
          } else {
            res.status(500).send(err)
          }
        })
    }

    const formatReleaseDate = (releaseDate) => {
      // sample data: 1996-05-28 (28th of May, 1996 [Merzbow - Pulse Demon])
      const year = releaseDate.substring(0, 4)
      const month = releaseDate.substring(5, 7)
      const day = releaseDate.substring(8)

      const formattedDate = moment(releaseDate).format('DD MMMM')

      return [day, month, year, formattedDate]
    }

    const getReleaseFromDatabase = () => {
      return admin.firestore().collection('releases').doc(id)
        .get()
        .then((res) => {
          return res.data()
        })
        .catch(() => {
          return false
        })
    }

    const getReleaseFromMusicbrainz = () => {
      axios
        .get(
          'https://musicbrainz.org/ws/2/release-group/?query=mbid:"' + id + '"&fmt=json',
          headers
        )
        .then(async (queryResult) => {
          const release = queryResult.data['release-groups'][0]
          const releaseInfo = await getReleaseInfo()
          const artwork = await getReleaseArtwork(release)
          release.image = artwork[0]
          release.imageHQ = artwork[1]
          release.genres = releaseInfo.genres
          const firstReleaseDate = releaseInfo['first-release-date']
          const formattedReleaseDate = formatReleaseDate(firstReleaseDate)
          release.firstReleaseDate = formattedReleaseDate
          release.lists = []
          res.status(200).send(release)
        })
        .catch((err) => {
          res.status(500).send(err)
        })
    }

    const getRelease = async () => {
      const release = await getReleaseFromDatabase()
      if (release) {
        res.status(200).send(release)
      } else {
        getReleaseFromMusicbrainz()
      }
    }

    getRelease()
  })
})
admin.initializeApp({
  credential: admin.credential.cert(require('./admin.json'))
})
