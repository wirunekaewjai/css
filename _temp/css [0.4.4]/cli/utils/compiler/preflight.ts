export default `
html {
  font-family: var(--font-sans);
  line-height: 1.5
}

body {
  font-family: inherit;
  line-height: inherit;
}

body, blockquote, dd, dl, figure, h1, h2, h3, h4, h5, h6, hr, p, pre {
  margin: 0
}

button {
  background-color: transparent;
  background-image: none
}

fieldset {
  margin: 0;
  padding: 0
}

*, ::after, ::before {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor
}

hr {
  border-top-width: 1px
}

img {
  border-style: solid
}

textarea {
  resize: vertical
}

input::placeholder, textarea::placeholder {
  color: #a1a1aa
}

[role=button], button {
  cursor: pointer
}

table {
  border-collapse: collapse
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit
}

a {
  color: inherit;
  text-decoration: inherit
}

button, input, optgroup, select, textarea {
  padding: 0;
  line-height: inherit;
  color: inherit
}

code, kbd, pre, samp {
  font-family: var(--font-mono);
}

audio, canvas, embed, iframe, img, object, svg, video {
  display: block;
  vertical-align: middle
}

img, video {
  max-width: 100%;
  height: auto
}
`.trim();