# Childish Gambino

This is a POC to test assumptions about our new model for Lando. In this model there is a Lando server that does the heavy lifting functionally and two clients, a command line interface for users to do the Lando things they've come to love and a graphical user interface geared towards configuration management, plugin management, installation and update flows and _other things._

Note that the original `README.md` for the `electron-vite` template we started from is available at `ELECTRON.md`.

## Getting Started

You will need `node` 14 and `yarn`.

```bash
# Get the repo and install deps
git clone git@github.com:lando/topsecretpoc.git
cd topsecretpoc
yarn

# Symlink the CLI into PATH
# NOTE: destination may vary, use of sudo may be required
ln -s `pwd`/bin/glover.js /usr/local/bin/glover
# See the menu
glover

# Launch the GUI application (this will also launch the server)

# Run some fake commands
glover start
```

## Development

## Testing the model

## Open questions

1. Do we want to use TypeScript? (it's the default in the `electron-vite` we are using)
