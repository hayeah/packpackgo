import path from 'path'

export default project => {
  const root = project.file.path
  const config = {
    entry: [project.entry],
    output: {
      path: path.join(root, 'dist'),
      filename: '[name].js'
    },
    resolve: {
      extensions: ['', '.css', '.js', '.vue'],
      modules: [
        root, 
        path.join(root, 'node_modules')
      ]
    }
  }

  return config
}