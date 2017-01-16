const {List} = require('immutable-ext')
const Right = x =>
  ({
    chain: f => f(x),
    ap: other => other.map(x),
    traverse: (of, f) => f(x).map(Right),
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
    inspect: () => `Right(${x})`
  })

const Left = x =>
  ({
    chain: f => Left(x),
    ap: other => Left(x),
    traverse: (of, f) => of(Left(x)),
    map: f => Left(x),
    fold: (f, g) => f(x),
    inspect: () => `Left(${x})`
  })

const tryCatch = f => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}

const readCurrentDevDependencies = () =>
  tryCatch(() => require('./package.json').devDependencies)
  .fold(e => 'eror',
    c => Object.keys(c))

const readCurrentDependencies = () =>
  tryCatch(() => require('./package.json').dependencies)
  .fold(e => 'eror',
    c => Object.keys(c))

const listOfLicenses = () =>
  List.of(x => `${x} licensed ${require(`./node_modules/${x}/package.json`).license}`)
  .ap(List(readCurrentDependencies()))

  const listOfDevLicenses = () =>
  List.of(x => `${x} licensed ${require(`./node_modules/${x}/package.json`).license}`)
  .ap(List(readCurrentDevDependencies()))

console.log(listOfLicenses())
console.log(listOfDevLicenses())
