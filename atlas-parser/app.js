let AtlasParser = require('./atlas-parser')
let fs = require('fs')
let XmlWriter = require('xml-writer')

// Get input file.
let atlasRaw = fs.readFileSync(process.cwd() + "/" + process.argv[2], 'utf8')

// Parse.
let atlas = AtlasParser.parse(atlasRaw)

// Covert to Phaser3 XML.
let xmlDocument = new XmlWriter(true)
xmlDocument.startDocument()
xmlDocument.startElement('TextureAtlas')

// Only supports one texture at the moment.
let texture = Object.keys(atlas)[0]

xmlDocument.writeAttribute('imagePath', texture)
xmlDocument.writeAttribute('width', atlas[texture]['size'][0])
xmlDocument.writeAttribute('height', atlas[texture]['size'][1])

let frames = Object.keys(atlas[texture].frames)
for (let i = 0; i < frames.length; i++) {
  let frame = atlas[texture].frames[frames[i]]
  xmlDocument.startElement('SubTexture')
  xmlDocument.writeAttribute('name', frames[i])
  xmlDocument.writeAttribute('x', frame['xy'][0])
  xmlDocument.writeAttribute('y', frame['xy'][1])
  xmlDocument.writeAttribute('width', frame['size'][0])
  xmlDocument.writeAttribute('height', frame['size'][1])
  xmlDocument.endElement()
}

xmlDocument.endElement()
xmlDocument.endDocument()

fs.writeFileSync(process.cwd() + '/' + process.argv[3], xmlDocument.toString())