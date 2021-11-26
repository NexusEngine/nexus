# Contributing

Contributions are always welcome!

## How to contribute

1. Read the [Contributor License Agreement](cla/individual.md)
2. Fork the repository
3. Create a new branch according to the
   [branch conventions](#branch-conventions)
4. Make your changes
5. Write tests for your changes, if applicable - and make sure all test suites
   pass! (this should be done in a separate commit)
6. Write documentation for your changes, if applicable (this should be done in a
   separate commit)
7. Add your name and info to the `contributors` array in the appropriate
   `package.json`s (if you have not done so before)
8. Create a pull request - make sure to mention the issues your pull request
   fixes, if any
9. Include the following sentence in your pull request (if you have not done so
   before): "**I have read the CLA Document and I hereby sign the CLA**"
10. ???

Each pull request should contain a single bug fix or feature.

## Branch Conventions

- A bug fix which increments the patch version: `fix/{descriptive-name}`
- A feature which increments the minor version: `feature/{descriptive-name}`
- A change which increments the major version: `breaking/{descriptive-name}`
- A change to the documentation only: `documentation/{descriptive-name}`

## Version Policy

The patch version is incremented if:

1. The change does not alter the public API
2. The change does not alter the mods API
3. The change does not significantly alter the engine internals

The minor version is incremented if:

1. The change does not alter existing public API interfaces
2. The change does not alter existing mods API interfaces
3. The change does not significantly alter the engine internals

The major version is incremented if:

1. The change alters the existing public API interfaces
2. The change alters the existing mods API interfaces
3. The change significantly alters the engine internals
