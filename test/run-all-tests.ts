#!/usr/bin/env node

/**
 * Comprehensive test runner for theme consistency and visual regression tests
 * This script runs all test suites and provides a summary report
 */

import { execSync } from 'child_process'

interface TestResult {
  suite: string
  passed: boolean
  output: string
  error?: string
}

const testSuites = [
  {
    name: 'Core Theme Tests',
    command: 'pnpm vitest run test/components/theme-core.test.tsx',
  },
  {
    name: 'Color Harmony Tests',
    command: 'pnpm vitest run test/components/color-harmony.test.tsx',
  },
  {
    name: 'Theme Consistency Tests',
    command: 'pnpm vitest run test/components/theme-consistency.test.tsx',
  },
  {
    name: 'Interaction States Tests',
    command: 'pnpm vitest run test/components/interaction-states.test.tsx',
  },
  {
    name: 'Comprehensive Theme Tests',
    command: 'pnpm vitest run test/components/comprehensive-theme.test.tsx',
  },
  {
    name: 'Visual Regression Tests',
    command: 'pnpm playwright test test/visual/theme-visual-regression.spec.ts',
  },
]

async function runTestSuite(suite: { name: string; command: string }): Promise<TestResult> {
  console.log(`\n🧪 Running ${suite.name}...`)
  
  try {
    const output = execSync(suite.command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    })
    
    console.log(`✅ ${suite.name} passed`)
    return {
      suite: suite.name,
      passed: true,
      output,
    }
  } catch (error: any) {
    console.log(`❌ ${suite.name} failed`)
    return {
      suite: suite.name,
      passed: false,
      output: error.stdout || '',
      error: error.stderr || error.message,
    }
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive theme testing suite...\n')
  
  const results: TestResult[] = []
  
  for (const suite of testSuites) {
    const result = await runTestSuite(suite)
    results.push(result)
  }
  
  // Generate summary report
  console.log('\n📊 Test Summary Report')
  console.log('========================')
  
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => r.passed === false).length
  
  console.log(`Total test suites: ${results.length}`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  
  if (failed > 0) {
    console.log('\n❌ Failed test suites:')
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - ${r.suite}`)
        if (r.error) {
          console.log(`    Error: ${r.error.slice(0, 200)}...`)
        }
      })
  }
  
  console.log('\n✅ Passed test suites:')
  results
    .filter(r => r.passed)
    .forEach(r => console.log(`  - ${r.suite}`))
  
  if (failed === 0) {
    console.log('\n🎉 All theme consistency tests passed!')
    console.log('The application maintains consistent theming across all components.')
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.')
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error)
}

export { runAllTests, testSuites }