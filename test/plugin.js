'use strict'
import test from 'ava'
// import { MinifyClassnames } from './index';
const fs = require('fs')
const path = require('path')
const posthtml = require('posthtml')
const plugin = require('../lib')
const fixturePath = filePath => path.resolve(__dirname, 'fixtures', filePath)
const readFixtures = filePath => fs.readFileSync(fixturePath(filePath), 'utf8')

const resetStyle = () => {
  fs.writeFileSync(fixturePath('styles.css'), readFixtures('original.css'))
}

test('name gen', t => {
  const filter = /^.js-/
  const html = readFixtures('name-gen.src.html')
  const expected = readFixtures('name-gen.exp.html')
  resetStyle()
  return posthtml().use(plugin({ filter, rootDir: __dirname })).process(html)
    .then(result => {
      t.is(result.html, expected)
      t.is(readFixtures('styles.css').trim(), readFixtures('styles.exp.css').trim())
    })
})

test('name gen with multiple html files', t => {
  const filter = /^.js-/
  const htmls = [
    readFixtures('multi/src1.html'),
    readFixtures('multi/src2.html')
  ]

  const expected = [
    readFixtures('multi/exp1.html'),
    readFixtures('multi/exp2.html')
  ]

  resetStyle()
  return plugin.multiFile({ filter, rootDir: __dirname })(htmls)
    .then(result => {
      t.is(result[0], expected[0])
      t.is(result[1], expected[1])
      t.is(readFixtures('styles.css').trim(), readFixtures('styles.exp.css').trim())
    })
})

test('emoji name gen', t => {
  const filter = /^.js-/
  const html = `
  <html>
    <style>
      #some-id {
        text-transform: uppercase;
      }
      .header__intro {
        color: blue;
      }
      .card--profile {
        background: white;
      }
      .js-overlay {
        display: none;
      }
      #js-button {
        color: blue;
      }
      @media (min-width: 768px) {
        .header__intro {
          color: gray;
        }
      }
    </style>
    <body>
      <svg style="display:none">
        <symbol id="icon-location"><path d=""></path></symbol>
      </svg>
      <h1 id="some-id">Title</h1>
      <p class="header__intro">OMG</p>
      <div class="js-overlay"></div>
      <div id="js-button"></div>
      <div class="card--profile">
        card content
      </div>
      <svg>
        <use xlink:href="#icon-location"></use>
      </svg>
      <label for="username">Click me</label>
      <input type="text" id="username">
    </body>
  </html>
  `
  const expected = `
  <html>
    <style>
      #😀 {
        text-transform: uppercase;
      }
      .😀 {
        color: blue;
      }
      .😁 {
        background: white;
      }
      .js-overlay {
        display: none;
      }
      #js-button {
        color: blue;
      }
      @media (min-width: 768px) {
        .😀 {
          color: gray;
        }
      }
    </style>
    <body>
      <svg style="display:none">
        <symbol id="😁"><path d=""></path></symbol>
      </svg>
      <h1 id="😀">Title</h1>
      <p class="😀">OMG</p>
      <div class="js-overlay"></div>
      <div id="js-button"></div>
      <div class="😁">
        card content
      </div>
      <svg>
        <use xlink:href="#😁"></use>
      </svg>
      <label for="😂">Click me</label>
      <input type="text" id="😂">
    </body>
  </html>
  `
  return posthtml().use(plugin({ filter: filter, genNameClass: 'genNameEmoji', genNameId: 'genNameEmoji' })).process(html)
    .then(result => {
      t.is(result.html, expected)
    })
})

test('emoji string name gen', t => {
  const filter = /^.js-/
  const html = `
  <html>
    <style>
      #some-id {
        text-transform: uppercase;
      }
      .header__intro {
        color: blue;
      }
      .card--profile {
        background: white;
      }
      .js-overlay {
        display: none;
      }
      #js-button {
        color: blue;
      }
      @media (min-width: 768px) {
        .header__intro {
          color: gray;
        }
      }
    </style>
    <body>
      <svg style="display:none">
        <symbol id="icon-location"><path d=""></path></symbol>
      </svg>
      <h1 id="some-id">Title</h1>
      <p class="header__intro">OMG</p>
      <div class="js-overlay"></div>
      <div id="js-button"></div>
      <div class="card--profile">
        card content
      </div>
      <svg>
        <use xlink:href="#icon-location"></use>
      </svg>
      <label for="username">Click me</label>
      <input type="text" id="username">
    </body>
  </html>
  `
  const expected = `
  <html>
    <style>
      #🚧🕥🏉 {
        text-transform: uppercase;
      }
      .☘👙📙 {
        color: blue;
      }
      .⏲📂⚗ {
        background: white;
      }
      .js-overlay {
        display: none;
      }
      #js-button {
        color: blue;
      }
      @media (min-width: 768px) {
        .☘👙📙 {
          color: gray;
        }
      }
    </style>
    <body>
      <svg style="display:none">
        <symbol id="👂🗨🌹"><path d=""></path></symbol>
      </svg>
      <h1 id="🚧🕥🏉">Title</h1>
      <p class="☘👙📙">OMG</p>
      <div class="js-overlay"></div>
      <div id="js-button"></div>
      <div class="⏲📂⚗">
        card content
      </div>
      <svg>
        <use xlink:href="#👂🗨🌹"></use>
      </svg>
      <label for="🏻🔐🙍">Click me</label>
      <input type="text" id="🏻🔐🙍">
    </body>
  </html>
  `
  return posthtml().use(plugin({ filter: filter, genNameClass: 'genNameEmojiString', genNameId: 'genNameEmojiString' })).process(html)
    .then(result => {
      t.is(result.html, expected)
    })
})
