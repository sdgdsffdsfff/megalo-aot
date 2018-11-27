const RuleSet = require( 'webpack/lib/RuleSet' )
const findRuleByFile = require( '../../../utils/findRuleByFile' )
const findRuleByQuery = require( '../../../utils/findRuleByQuery' )

class FrameworkPlugin {
  constructor( options = {} ) {
    this.options = options
  }

  apply( compiler ) {
    const compilerOptions = compiler.options
    const rawRules = compilerOptions.module.rules
    const { rules } = new RuleSet( rawRules )
    const {
      sfcFiles,
      entryFiles,
      pitcherQuery,
      frameworkLoaderRegexp,
      compiler: templateCompiler,
      entryLoader,
      pitcherLoader
    } = this.options || {}

    // generate components
    replaceTemplateCompiler( {
      rules,
      compiler: templateCompiler,
      files: sfcFiles,
      frameworkLoaderRegexp,
    } )

    // transpile `scoped` attribute to class
    replacePitcher( {
      rules,
      query: pitcherQuery,
      pitcherLoader,
    } )

    compiler.options.module.rules = rules
  }
}

// add our loader before [framework]-loader
function replaceTemplateCompiler( { rules, compiler, files = [], frameworkLoaderRegexp } ) {
  const rule = findRuleByFile( rules, files )

  if ( !rule ) {
    return
  }

  const use = rule.use
  const useLoaderIndex = use.findIndex( u => {
    return frameworkLoaderRegexp.test( u.loader )
  } )
  const useLoader = use[ useLoaderIndex ]

  // override compiler for `[framework]-loader` and `./loader/[framework]`
  useLoader.options.compiler = compiler
}

// use our own pitcher override [framework]-loader pitcher
function replacePitcher( { rules, query = [], pitcherLoader: loader } ) {
  const pitcherRule = findRuleByQuery( rules, query )

  if ( !pitcherRule ) {
    return
  }

  const pitcherUse = pitcherRule.use
  const pitcherLoader = pitcherUse[ 0 ]

  // replace
  pitcherLoader.loader = loader
}

module.exports = FrameworkPlugin
