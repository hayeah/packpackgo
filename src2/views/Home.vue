<template>
  <div class="page">
    <div class="cards">
      <div class="card add-card">
        <div class="card-inner">
          <svg-icon class="card-title-icon" name="bolt"></svg-icon>
          <div>Let there be light!</div>
          <div class="drop-zone">
            <svg-icon name="folderOpenO"></svg-icon>
            <div class="text-tip">
              Drag &amp; drop a folder here to start!
            </div>
          </div>
          <div class="hr" aria-label="or"></div>
          <button @click="chooseFolder">Browser folders</button>
        </div>
      </div>
      <div
        :class="['card', 'card-' + project.buildStatus]"
        v-for="project in projects">
        <div class="card-inner">
          <header class="card-header">
            <svg-icon name="circle" class="card-status"></svg-icon>
            <span class="card-title">
              {{ project.name }}
            </span>
          </header>
          <div class="card-meta">
            <div class="card-meta-item">
              <svg-icon name="link"></svg-icon>
              <span>
                {{ project.devServer || 'Waiting...' }}
              </span>
            </div>
            <div class="card-meta-item">
              <svg-icon name="folder"></svg-icon>
              <span class="nowrap">
                {{ project.path }}
              </span>
            </div>
            <div class="card-icon">
              <svg-icon name="bolt"></svg-icon>
            </div>
            <div class="card-action">
              <button v-if="project.buildStatus === 'building'">
                Stop
              </button>
              <button v-if="project.buildStatus === 'failed'">
                Try Again
              </button>
              <button v-if="project.buildStatus === 'success'">
                Rebuild
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {remote} from 'electron'
  import {mapGetters, mapActions} from 'vuex'

  import SvgIcon from 'components/SvgIcon'
  import {$} from 'utils/dom'

  const win = remote.BrowserWindow.getFocusedWindow()

  export default {
    name: 'Home',
    computed: {
      ...mapGetters(['projects'])
    },
    mounted() {
      this.handleDragFolder()
    },
    methods: {
      ...mapActions(['addProject']),
      chooseFolder() {
        const folder = remote.dialog.showOpenDialog(win, {
          properties: ['openDirectory']
        })
        if (folder) {
          this.addProject({path: folder[0]})
        }
      },
      handleDragFolder() {
        // prevent from dragging to somewhere other than drop-zone
        const app = $('#app')
        app.ondrop = e => {
          e.preventDefault()
          return false
        }
        app.ondragover = () => {
          return false
        }

        const holder = $('.drop-zone')
        holder.ondragover = () => {
          holder.classList.add('drag-over')
          return false
        }
        holder.ondragleave = holder.ondragend = () => {
          holder.classList.remove('drag-over')
          return false
        }
        holder.ondrop = e => {
          e.preventDefault()
          e.stopPropagation()
          holder.classList.remove('drag-over')
          const folder = e.dataTransfer.files && e.dataTransfer.files[0]
          if (folder) {
            this.addProject(folder)
          }
          return false
        }
      }
    },
    components: {
      SvgIcon
    }
  }
</script>

<style>
  @import "../css/vars";

  .svg-icon.card-title-icon {
    svg {
      width: 30px;
    }
    path {
      fill: $yellow;
    }
  }
  .cards {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .card {
    flex-basis: calc(100% / 3);
    max-width: calc(100% / 3);
    padding: 10px;
    color: $grey-600;
  }
  .card-inner {
    background-color: white;
    box-shadow: 0 0 3px #999;
    .add-card & {
      padding: 10px;
    }
    .card-header {
      display: flex;
      align-items: center;
      font-size: 1.3rem;
      padding: 10px;
      border-bottom: 1px solid #e2e2e2;
    }
    .card-status {
      margin-right: 10px;
      width: 14px;
      height: auto;
    }
    .card-meta-item {
      padding: 5px 10px;
      display: flex;
      align-items: center;
      font-size: .75rem;
      .svg-icon {
        margin-right: 10px;
        width: 14px;
        path {
          fill: $grey-600;
        }
      }
    }
  }
  .card-icon {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    .svg-icon,
    .svg-icon svg {
      width: 80px;
      height: 80px;
    }
    .building & {
      path {
        fill: $yellow;
      }
    }
  }
  .card-building {
    .card-status,
    .card-icon {
      path {
        fill: $yellow;
      }
    }
  }
  .card-action {
    display: flex;
    justify-content: center;
  }
  .add-card {
    text-align: center;
  }
  .drop-zone {
    width: 70%;
    display: inline-flex;
    align-items: center;
    height: 140px;
    border: 1px solid #e2e2e2;
    padding: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
    justify-content: center;
    .svg-icon {
      width: 20px;
      svg {
        width: 20px;
        path {
          fill: $grey;
        }
      }
    }
    &.drag-over {
      background-color: #f0f0f0;
    }
  }
</style>
