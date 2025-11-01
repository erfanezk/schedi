#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { execSync } from 'child_process'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const version = pkg.version
const tagName = `react-v${version}`
const shouldPush = process.argv.includes('--push')

try {
  // Check if tag already exists
  try {
    execSync(`git rev-parse ${tagName}`, { stdio: 'ignore' })
    console.log(`⚠️  Tag ${tagName} already exists`)
  } catch {
    // Tag doesn't exist, create it
    execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' })
    console.log(`✅ Created tag ${tagName}`)
  }

  // Push tag if requested
  if (shouldPush) {
    console.log(`📤 Pushing tag ${tagName} to remote...`)
    execSync(`git push origin ${tagName}`, { stdio: 'inherit' })
    console.log(`✅ Tag ${tagName} pushed to remote`)
  }
} catch (error) {
  if (error.message && error.message.includes('already exists')) {
    console.log(`⚠️  Tag ${tagName} already exists`)
    if (shouldPush) {
      // Try to push existing tag
      try {
        execSync(`git push origin ${tagName}`, { stdio: 'inherit' })
        console.log(`✅ Tag ${tagName} pushed to remote`)
      } catch (pushError) {
        if (pushError.message && !pushError.message.includes('already exists')) {
          throw pushError
        }
      }
    }
    process.exit(0)
  }
  throw error
}

