const fs = require('fs')

let src = fs.readFileSync('src/data/dataKost.js', 'utf8')
src = src.replace(/^import .*$/gm, '')
src = src.replace(/photo:\s*img(\d+),/g, 'photo: "/images/images_hunika_$1.jpg",')
src = src.replace(/export const /g, 'const ')
src = src.replace(/``;/g, '')

const DATA = new Function(src + '; return DATA;')()

const rows = DATA.map((k) => ({
  name: k.name,
  address: k.address,
  area: k.area.replace('Jafokarta', 'Jakarta'),
  rating: parseFloat(k.rating),
  reviews: parseInt(k.reviews),
  facilities: JSON.stringify([...k.fasKamar, ...k.fasUmum]),
  price: k.price,
  rooms: k.rooms,
  years: k.years,
  description: k.desc1 + ' ' + k.desc2,
  img: k.photo,
}))

fs.writeFileSync('kosts.json', JSON.stringify(rows, null, 2))
console.log('Selesai:', rows.length, 'kost')