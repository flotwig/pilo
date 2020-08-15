const fs = require('fs')

function readPkg(path) {
  return JSON.parse(fs.readFileSync(path + '/package.json'))
}

const root = readPkg('.')

// normally, npm prevents publishing private packages. but we are only private so
// we can use yarn workspaces. so remove this flag during packing.
delete root.private

// also delete workspaces, YAGNI
delete root.workspaces

// the server's dependencies are the only runtime dependencies
const server = readPkg('./server')
if (!root.dependencies) root.dependencies = {}
Object.assign(root.dependencies, server.dependencies)

fs.copyFileSync('./package.json', './package.json.bak')
fs.writeFileSync('./package.json', JSON.stringify(root, null, 2))
