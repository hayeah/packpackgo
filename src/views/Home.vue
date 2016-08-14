<template>
  <div class="page">
    <div class="project" v-if="activeProject">
      <button @click="handleBuildProject">Build</button>
      <ul>
        <li>
          entry: {{ activeProject.entry }}
        </li>
        <li>
          path: {{ activeProject.file.path }}
        </li>
      </ul>
      <console-logs :logs="consoleLogs"></console-logs>
    </div>
    <div class="empty-state" v-else>
      Drag and drop a folder here!
    </div>
  </div>
</template>

<script>
  import path from 'path'
  import {mapGetters, mapState} from 'vuex'
  import AnsiToHTML from 'ansi-to-html'
  import makeWebpackCompiler from '../helpers/make-webpack-compiler'
  import makeWebpackConfig from '../helpers/make-webpack-config'

  import ConsoleLogs from '../components/ConsoleLogs'

  const ansiToHTML = new AnsiToHTML({fg: '#666'})

  export default {
    name: 'Home',
    computed: {
      ...mapGetters(['activeProject', 'consoleLogs'])
    },
    mounted() {
      this.handleDragAndDrop()
    },
    methods: {
      handleDragAndDrop() {
        const holder = document.querySelector('#app')
        holder.ondragover = () => {
          return false
        }
        holder.ondragleave = holder.ondragend = () => {
          return false
        }
        holder.ondrop = e => {
          e.preventDefault()
          this.$store.dispatch('addProject', {
            file: e.dataTransfer.files[0]
          })
          // for (let f of e.dataTransfer.files) {
          //   console.log(f.path)
          // }
          return false
        }
      },
      runProject(projectRoot) {
        const entry = path.join(projectRoot, 'index.js')
      },
      handleBuildProject() {
        const {dispatch} = this.$store
        dispatch('startBuilding')
        const compiler = makeWebpackCompiler(makeWebpackConfig(this.activeProject))
        compiler.run((err, stats) => {
          dispatch('updateConsole', ansiToHTML.toHtml(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
          })))
          dispatch('stopBuilding')
        })
      }
    },
    components: {
      ConsoleLogs
    }
  }
</script>