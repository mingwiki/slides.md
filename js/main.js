let raw = `
# 开篇介绍
这是一个XXXXX报告

## 第一章
aaaaaaaa

## 第二章
bbbbbbbb

### 第一节
ccc111

### 第二节
ccc222

### 第三节
ccc333

## 第三章
dddddd

## 第四章
eeeeee
`

const isMain = str => (/^#{1,2}(?!#)/).test(str)
const isSub = str => (/^#{3}(?!#)/).test(str)
const convert = raw => {
  let arr = raw.split(/\n(?=\s*#)/).filter(s => s != "").map(s => s.trim())
  let html = ''
  for (let i = 0; i < arr.length; i++) {

    if (arr[i + 1] !== undefined) {
      if (isMain(arr[i]) && isMain(arr[i + 1])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
`
      } else if (isMain(arr[i]) && isSub(arr[i + 1])) {
        html += `
<section>
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
`
      } else if (isSub(arr[i]) && isSub(arr[i + 1])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
`
      } else if (isSub(arr[i]) && isMain(arr[i + 1])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
</section>
`
      }
    } else {
      if (isMain(arr[i])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
`
      } else if (isSub(arr[i])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
</section>
`
      }
    }
  }
  return html;
}

const Settings = {
  init() {
    console.log("Settings inited")
  }
}
const Editor = {
  init() {
    console.log("Editor inited")
  }
}
const App = {
  init() {
    [...arguments].forEach(module => module.init())
  }
}

App.init(Settings, Editor)

const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)
$('.reveal .slides').innerHTML = convert(raw || `# slides.md`)
// Also available as an ES module, see:
// https://revealjs.com/initialization/
Reveal.initialize({
  controls: true,
  progress: true,
  center: true,
  hash: true,

  // Learn about plugins: https://revealjs.com/plugins/
  plugins: [
    RevealZoom,
    RevealNotes,
    RevealSearch,
    RevealMarkdown,
    RevealHighlight,
  ],
});

$(".arrow .iconfont").onclick = function () {
  $(".tabs-wrapper").classList.toggle("active")
  setTimeout(() => {
    $(".arrow .iconfont").classList.toggle("icon-left")
  }, 1200);
}
$$(".tabs .iconfont").forEach(tab => {
  tab.onclick = function () {
    this.classList.add("active")
    $(".panels-wrapper").classList.add("active")
    $(".reveal").style.display = "none"
    if (this.classList.contains("icon-edit")) {
      $(".panels .edit").classList.add("active")
    }
    if (this.classList.contains("icon-theme")) {
      $(".panels .theme").classList.add("active")
    }
    if (this.classList.contains("icon-pdf")) {
      $(".panels .pdf").classList.add("active")
    }
  }
})
$(".panels-wrapper .icon-close").onclick = function () {
  $(".panels-wrapper").classList.remove("active")
  $$(".panels .panel").forEach(panel => panel.classList.remove("active"))
  $$(".tabs .iconfont").forEach(tab => tab.classList.remove("active"))
  $(".reveal").style.display = "block"
}