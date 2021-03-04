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
yarn watch

# Hit the server
# NOTE: this is currently not the real server
curl http://localhost:3720/ping

# Run some fake commands
glover start
```

## Development

## Testing the model

## Open questions

1. Do we want to use TypeScript? (it's the default in the `electron-vite` we are using)
2. If we need to ask the server for the yargs commands, is that going to work ok?
3. Using BIDI makes sense on how we can stream output to stdout but what about reading from stdin?
4. How and where do we load plugins server side?
5. How are we going to handle fast tooling handoff?
6. Do we want the gui to launch the server into its own console?
