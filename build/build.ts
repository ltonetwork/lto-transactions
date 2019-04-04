import { remove, p, run, copy, create, copyJson, npmInstall, npmGetVersion } from './utils'

async function build() {
  try {
    await remove(p('tmp'))
    await remove(p('../dist'))
    await create(p('tmp'))
    await create(p('tmp/src'))

    await npmInstall('typedoc-clarity-theme', 'tmp')
    await npmInstall('@lto-network/lto-crypto', 'tmp')

    await copy(p('../src'), p('tmp/src'))
    await copy(p('../tsconfig.json'), p('tmp/tsconfig.json'))
    await run('tsc', p('tmp'))
    await create(p('tmp/node_modules/@lto-network/'))
    await copy(p('tmp/dist'), p('tmp/node_modules/@lto-network/lto-transactions'))
    await copyJson(p('../package.json'), p('tmp/node_modules/@lto-network/lto-transactions/package.json'), { main: 'index.js', types: 'index.d.ts' })
    await remove(p('tmp/dist'))
    await run('typedoc', p('tmp'))
    await run('tsc', p('tmp'))
    // const latestVersion = await npmGetVersion('@lto-network/lto-transactions')
    // await copyJson(p('../package.json'), p('tmp/dist/package.json'),
    //   {
    //     main: 'index.js',
    //     types: 'index.d.ts',
    //     version: latestVersion,
    //     //dependencies: undefined,
    //     devDependencies: undefined,
    //     scripts: undefined,
    //   })
    // await copy(p('../README.md'), p('tmp/dist/README.md'))
    await copy(p('tmp/dist'), p('../dist'))
    await remove(p('tmp'))
  } catch (error) {
    console.log(error)
  }
}

build()