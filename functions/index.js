// import imagemin from 'imagemin'
// import imageminJpegtran from 'imagemin-jpegtran'
// import imageminPngquant from 'imagemin-pngquant'
const crypto = require('crypto')
const fs = require('fs')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

const axios = require('axios')

exports.communicateWithAPI = functions.https.onRequest((req, res) => {
  const isImage = req.query.isImage
  const apiURL = req.query.apiURL

  const processImage = (url, mbid) => {
    // const imagesRef = functions.storage.ref
    axios.get({
      url,
      method: 'GET',
      responseType: 'stream'
    })
      .then((res) => {
        const mbid = req.query.mbid
        res.data.pipe(fs.createWriteStream('/tmp/' + mbid + '.jpg'))
      })
  }

  const getArtistImage = (res) => {
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
      const imageURL = 'https://upload.wikimedia.org/wikipedia/commons/' + firstCharacterInHash + '/' + firstCharacterInHash + secondCharacterInHash + '/' + imageName
      processImage(imageURL)
      // // get colours
      // getColours(imageName, index)
    } catch (e) {
      if (e === 'TypeError: "res.data.claims.P18 is undefined"') {
        // If the artist has no image supplied, get an album artwork instead.
        getReleaseImage(res)
      } else {
        console.log(e)
      }
    }
  }

  const getReleaseImage = (res) => {
    console.log(res)
  }
  axios.get('https://wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&property=P18&entity=' + apiURL)
    .then((resAPI) => {
      if (isImage === 'false') {
        getArtistImage(resAPI)
      } else {
        console.log(resAPI)
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

admin.initializeApp()
