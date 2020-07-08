const crypto = require('crypto')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')

exports.search = functions.https.onRequest((req, res) => {
  // it's worth noting that much of this code could be executed client-side
  // but is instead done in this function for, yknow, elegance. might change.
  const queryType = req.query.queryType // release-group, artist..
  const limit = req.query.limit // amount of search results to load
  const region = req.query.region // from which region in particular
  const releaseType = req.query.releaseType // single, ep, lp..
  const query = req.query.query
  // example: /search?query=Kendrick Lamar&queryType=artist&limit=3
  //          &region=All countries&releaseType=All

  const findArtistReleases = (i) => {
    const artistID = searchResults[i].id
    searchResults[i].releases = {}
    // find releases
    axios
      .get('https://musicbrainz.org/ws/2/release-group/?query=arid:' + artistID + ' AND status:"official" AND primarytype:"album"&limit=30&fmt=json')
      .then((res) => {
        // get album artworks
        const releases = res.data['release-groups']
        releases.forEach((releasegroup) => {
          searchResults[i].releases[releasegroup.id] = {}
          const releaseTitle = releasegroup.title
          axios
            .get(
              'https://coverartarchive.org/release-group/' + releasegroup.id
            )
            .then((res) => {
              const imageURL = res.data.images[0].thumbnails.small
              searchResults[i].releases[releasegroup.id].image = imageURL
              searchResults[i].releases[releasegroup.id].title = releaseTitle
            })
            .catch((err) => {
              console.log('No album cover found.\n' + err)
            })
        })
      })
      .catch((err) => {
        console.log('ERROR WITH ' + artistID + ': ' + err)
      })
  }

  const getArtistImage = (wikidataID, i) => {
    axios
      .get(
        'https://wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&property=P18&entity=' + wikidataID
      )
      .then((res) => {
        // get filename and location
        // (this process is a serious pain)
        try {
          const imageInfo = res.data.claims.P18[0].mainsnak
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
          findArtistReleases(i)
        } catch (e) {
          if (e === 'TypeError: "res.data.claims.P18 is undefined"') {
            // ** AIM TO REPLACE WITH MORE EFFICIENT ALTERNATIVE **
            // If the artist has no image supplied, get an album artwork instead.
            // getAlbumArtCandidate(i)
          }
        }
      })
      .catch((e) => {
        // ** AIM TO REPLACE WITH MORE EFFICIENT ALTERNATIVE **
        // getAlbumArtCandidate(i)
      })
  }

  const processArtist = (artist, i) => {
    axios
      .get(
        'https://musicbrainz.org/ws/2/artist/' + artist.id + '?inc=url-rels&fmt=json'
      )
      .then((res) => {
        const relations = res.data.relations
        let foundWikidata = false
        for (let relationIndex = 0; relationIndex < relations.length; relationIndex++) {
          const relation = relations[relationIndex]
          // get wikidata link
          if (relation.type === 'wikidata') {
            foundWikidata = true
            // get wikidata ID
            const wikidataID = relation.url.resource.slice(30) // https://www.wikidata.org/wiki/ = 30 chars
            // lookup image
            getArtistImage(wikidataID, i)
          }
        }
        // if no wikidata page was found, get album art instead
        if (!foundWikidata) {
          // ** AIM TO REPLACE WITH MORE EFFICIENT ALTERNATIVE **
          // getAlbumArtCandidate(i)
        }
      })
  }

  const processArtists = (data) => {
    const artists = data.artists
    artists.forEach((artist, i) => {
      searchResults[artist.id] = artist
      processArtist(artist, i)
    })
    concludeSearch()
  }

  const processReleases = (data) => {
    const releases = data['release-groups']
    releases.forEach((releasegroup, i) => {
      // add to search results
      searchResults[releasegroup.id] = releasegroup
      // get album art
      axios
        .get(
          'https://coverartarchive.org/release-group/' + releasegroup.id
        )
        .then((res) => {
          const imageURL = res.data.images[0].thumbnails.small
          searchResults[releasegroup.id].image = imageURL
        })
        .catch((err) => {
          // TODO: improve handling here
          console.log('No album cover found.\n' + err)
        })
    })
    concludeSearch()
  }

  const concludeSearch = () => {
    // send back search results as a nice digestable json
    res.json(searchResults)
  }

  const searchResults = {}
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
      queryURL
    )
    .then((queryResult) => {
      if (queryType === 'artist') {
        processArtists(queryResult.data)
      } else if (queryType === 'release-group') {
        processReleases(queryResult.data)
      }
    })
    .catch((err) => {
      console.error(err)
    })
})

admin.initializeApp()
