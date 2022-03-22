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

function convert(raw) {
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

document.querySelector('.reveal .slides').innerHTML = convert(raw)

document.querySelector(".arrow .iconfont").onclick = function () {
  document.querySelector(".tabs-wrapper").classList.toggle("active")
  setTimeout(() => {
    document.querySelector(".arrow .iconfont").classList.toggle("icon-left")
  }, 1200);
}
document.querySelectorAll(".tabs .iconfont").forEach(tab => {
  tab.onclick = function () {
    this.classList.add("active")
    document.querySelector(".panels-wrapper").classList.add("active")
    document.querySelector(".reveal").style.display = "none"
    if (this.classList.contains("icon-edit")) {
      document.querySelector(".panels .edit").classList.add("active")
    }
    if (this.classList.contains("icon-theme")) {
      document.querySelector(".panels .theme").classList.add("active")
    }
    if (this.classList.contains("icon-pdf")) {
      document.querySelector(".panels .pdf").classList.add("active")
    }
  }
})
document.querySelector(".panels-wrapper .icon-close").onclick = function () {
  document.querySelector(".panels-wrapper").classList.remove("active")
  document.querySelectorAll(".panels .panel").forEach(panel => panel.classList.remove("active"))
  document.querySelectorAll(".tabs .iconfont").forEach(tab => tab.classList.remove("active"))
  document.querySelector(".reveal").style.display = "block"
}