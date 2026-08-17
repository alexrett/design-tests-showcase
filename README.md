# Design Tests Showcase

Static reference catalog for the independent experiments in the sibling
`design-tests` directory. The published site contains eight runnable results,
including the standalone Open Design auth artifact.

## Build

The source experiments must be available at `../design-tests`.

```sh
bun test
bun run build
bun run serve
```

The build script:

1. builds the six Astro experiments with the GitHub Pages base path;
2. copies the final field version of `codex-anime` and only its runtime assets;
3. copies the standalone Open Design result for `kimi-design`;
4. writes the complete static artifact to `dist/`.

GitHub Actions publishes the committed `dist/` directory to Pages.
