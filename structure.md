# Project structrue

- **/**: The project base directory contains mostly configuration files at the top level
  - *package.json*: project file for development
  - *tsconfig.json*: configuration file for the typescript compiler 
  - *eslint.json*: configuration for our coding guidelines
  - **src/**: Vortex source code
    - *main.ts*: Entry point of the main process
    - *renderer.tsx*: Entry point of render processes
    - *actions/actions.ts*: contains the actions that can be called to manipulate
      application state
    - *index.html*: The top-level web-page being displayed. This is very minimal as
      the actual content is inserted in renderer.tsx
    - **reducers/**: contains the reducers that are run as the result of actions to
      modify application state
      - *index.ts*: top-level index, references the other reducer files
    - **types/**: contains interfaces for our own data types
    - **util/**: contains classes that didn't fit anywhere else
    - **views/**: contains the react views that make up the user interface
  - **\_\_tests\_\_/**: unit tests
  - **.vscode/**: Configuration files for Visual Studio Code
    - *launch.json*: launch options (F5 primarily)
    - *tasks.json*: ide build commands (ctrl-shift-b)
    - *settings.json*: project-wide customizations of the ide (editor settings)
  - **build/**: contains assets for the packaging process (i.e. application icon)
  - **app/**: staging directory for production build
    - *package.json*: project file for production
  - **dist/**: production builds (unpacked and instellers, created during packaging)
  - **out/**: development build (created during build)
  - **node_modules/**: dependencies (created by *npm install*)
  - **typings.custom/**: custom typings for libraries that don't have any, or are incomplete/broken 
    - *index.d.ts*: top-level index, references the other typings