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

  const searchResults = []

  const findArtistReleases = (i) => {
    searchResults[i].releases = {}
    const id = searchResults[i].id
    // find releases
    return axios
      .get('https://musicbrainz.org/ws/2/release-group/?query=arid:' + id + ' AND status:"official" AND primarytype:"album"&limit=30&fmt=json')
      .then(res => res.data['release-groups'])
      .catch((err) => {
        console.log('ERROR WITH ' + id + ': ' + err)
      })
  }

  const getArtistImageInfo = (wikidataID) => {
    return axios
      .get(
        'https://wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&property=P18&entity=' + wikidataID
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
        'https://musicbrainz.org/ws/2/artist/' + artist.id + '?inc=url-rels&fmt=json'
      )
      .then(res => res.data.relations)
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
      console.log(e)
      if (e === 'TypeError: "res.data.claims.P18 is undefined"') {
        // ** AIM TO REPLACE WITH MORE EFFICIENT ALTERNATIVE **
        // If the artist has no image supplied, get an album artwork instead.
        // getAlbumArtCandidate(i)
      }
    }
  }

  const getArtistReleaseImageURL = (releasegroup) => {
    return axios
      .get(
        'https://coverartarchive.org/release-group/' + releasegroup.id
      )
      .then(res => res.data.images[0].thumbnails.small)
      .catch((err) => {
        console.log('No album cover found with ' + releasegroup.title + ' @ https://coverartarchive.org/release-group/' + releasegroup.id + '. ' + err)
      })
  }

  const getReleaseArtwork = (releasegroup) => {
    return axios
      .get(
        'https://coverartarchive.org/release-group/' + releasegroup.id
      )
      .then(res => res.data.images[0].thumbnails.small)
      .catch((err) => {
        // TODO: improve handling here
        console.log('No album cover found.\n' + err)
      })
  }

  const processArtistReleases = async (releases, i) => {
    // get album artworks
    for (const releasegroup of releases) {
      searchResults[i].releases[releasegroup.id] = {}
      const releaseTitle = releasegroup.title
      const imageURL = await getArtistReleaseImageURL(releasegroup)
      searchResults[i].releases[releasegroup.id].image = imageURL
      searchResults[i].releases[releasegroup.id].title = releaseTitle
    }
  }

  const processArtists = async (data) => {
    const artists = data.artists
    for (const [i, artist] of artists.entries()) {
      searchResults[i] = artist
      const relations = await getArtistRelations(artist)
      const wikidataID = await getWikidataID(relations)
      const imageInfo = await getArtistImageInfo(wikidataID)
      getArtistImage(imageInfo, i)
      const artistReleases = await findArtistReleases(i)
      await processArtistReleases(artistReleases, i)
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
      searchResults[i].image = releaseArtwork
    }
    concludeSearch()
  }

  const concludeSearch = () => {
    // send back search results as a nice digestable json
    res.json(searchResults)
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
