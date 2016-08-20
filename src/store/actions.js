import path from 'path'
import webpack from 'webpack'

export const addProject = ({commit}, project) => {
  commit('ADD_PROJECT', {
    name: project.name || path.basename(project.path),
    path: project.path,
    buildStatus: 'building',
    logs: [],
    devServer: null,
    lastBuildTime: new Date(),
    buildTime: null
  })
}