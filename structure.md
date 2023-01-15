# Project Structure

- **/**: The project base directory contains mostly configuration files at the top level
  - *package.json*: the vortex_devel project file
    - scripts: The most common/convenient are scripts are described below.
      - build: Builds the rest of Vortex before transpiling Vortex's sources.
      - build_api: Creates the typings of Vortex's sources in the api/lib directory.
      - devel: Transpiles Vortex's sources using strict settings.
      - start: Launches electron in development mode.
      - dist: Builds and packages all extensions, updates all assets, transpiles Vortex's sources
      - lint: Formats Vortex's sources. Temporarily disabled. The linting configuration will return.
  - *tsconfig.json*: configuration file for the typescript compiler
  - *eslint.json*: configuration which implements the CODESTYLE guidelines
  - **src/**: Vortex source code
    - *main.ts*: Entry point of the main process
    - *renderer.tsx*: Entry point of render processes
    - *actions/actions.ts*: contains the actions which can be called to manipulate
      application state
    - *index.html*: The top-level web-page being displayed. This is very minimal as
      the actual content is inserted in renderer.tsx
    - **reducers/**: contains the reducers that are run as the result of actions to
      modify application state
      - *index.ts*: top-level index, references the other reducer files
    - **types/**: contains exported interfaces and data types
    - **util/**: contains classes that didn't fit anywhere else
    - **views/**: contains the react views that make up the user interface
  - **build/**: contains assets for the packaging process (i.e. application icon)
  - **app/**: staging directory for production builds
    - *package.json*: project file for production
  - **dist/**: packaged production builds in installer and unpacked formats
  - **out/**: transpiled sources (created during builds)
  - **node_modules/**: installed package dependencies
  - **typings.custom/**: custom typings for libraries that don't have any, or are incomplete/broken
    - *index.d.ts*: top-level index, references the deeper type definition files
