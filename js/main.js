const isMain = str => (/^#{1,2}(?!#)/).test(str)
const isSub = str => (/^#{3}(?!#)/).test(str)
// const convert = raw => {
//   let arr = raw.split(/\n(?=\s*#)/).filter(s => s != "").map(s => s.trim())
//   let html = ''
//   for (let i = 0; i < arr.length; i++) {

//     if (arr[i + 1] !== undefined) {
//       if (isMain(arr[i]) && isMain(arr[i + 1])) {
//         html += `
// <section data-markdown>
// <textarea data-template>
// ${arr[i]}
// </textarea>
// </section>
// `
//       } else if (isMain(arr[i]) && isSub(arr[i + 1])) {
//         html += `
// <section>
// <section data-markdown>
// <textarea data-template>
// ${arr[i]}
// </textarea>
// </section>
// `
//       } else if (isSub(arr[i]) && isSub(arr[i + 1])) {
//         html += `
// <section data-markdown>
// <textarea data-template>
// ${arr[i]}
// </textarea>
// </section>
// `
//       } else if (isSub(arr[i]) && isMain(arr[i + 1])) {
//         html += `
// <section data-markdown>
// <textarea data-template>
// ${arr[i]}
// </textarea>
// </section>
// </section>
// `
//       }
//     } else {
//       if (isMain(arr[i])) {
//         html += `
// <section data-markdown>
// <textarea data-template>
// ${arr[i]}
// </textarea>
// </section>
// `
//       } else if (isSub(arr[i])) {
//         html += `
// <section data-markdown>
// <textarea data-template>
// ${arr[i]}
// </textarea>
// </section>
// </section>
// `
//       }
//     }
//   }
//   return html;
// }
const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)

const Settings = {
  init() {
    console.log("Settings init")
    this.bind()
  },
  bind() {
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
  }
}
const Editor = {
  init() {
    console.log("Editor init")
    $(".edit textarea").value = localStorage.markdown || `# Slides.md`
    this.bind()
  },
  bind() {
    $(".edit .save").onclick = () => {
      localStorage.markdown = $(".edit textarea").value
      location.reload()
    }
  }
}
const Themes = {
  init() {
    console.log("Themes init")
    this.bind()
    this.load()
  },
  bind() {
    $$(".panels .themes figure").forEach(figure => {
      figure.onclick = () => {
        $$(".panels .themes figure").forEach(v => v.classList.remove('active'))
        figure.classList.add('active')
        this.save(figure.dataset.theme)
      }
    })
    $('.panels .footer .transition').onchange = function () {
      localStorage.transition = this.value
      location.reload()
    }
  },
  save(theme) {
    localStorage.theme = theme
    location.reload()
  },
  load() {
    let theme = localStorage.theme || 'black'
    let link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `dist/theme/${theme}.css`
    link.id = 'theme'
    document.head.append(link)
    $(`.themes figure[data-theme=${theme}]`).classList.add('active')
    $('.panels .footer .transition').value = localStorage.transition || 'slide'
    $('.reveal .slides section').dataset.transition = localStorage.transition || 'slide'
  }
}
const Print = {
  init() {
    $('.panels .pdf .content').src = location.href + "?print-pdf"
    this.bind()
  },
  bind() {
    $('.panels .pdf button').onclick = () => {
      $('.panels .pdf .content').contentWindow.print()
    }
  }
}
const Revealjs = {
  init() {
    console.log("Revealjs init")
    this.load()
    Reveal.initialize({
      controls: true,
      progress: true,
      center: true,
      hash: true,
      plugins: [
        RevealZoom,
        RevealNotes,
        RevealSearch,
        RevealMarkdown,
        RevealHighlight,
      ],
    })
  },
  load() {
    // $('.reveal .slides').innerHTML = convert(localStorage.markdown || `# Slides.md`)
    $('.reveal .slides textarea').innerHTML = localStorage.markdown || $(".edit textarea").value
  }
}
const App = {
  init() {
    [...arguments].forEach(module => module.init())
  }
}

App.init(Settings, Editor, Themes, Print, Revealjs)