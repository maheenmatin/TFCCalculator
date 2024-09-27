/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
	                                  dir: './',
                                  })

const customJestConfig: Config = {
	setupFilesAfterEnv: ['<rootDir>/jest.config.ts'],
	testEnvironment: 'jest-environment-jsdom',
	collectCoverage: false,
	restoreMocks: true,
	slowTestThreshold: 3,
	errorOnDeprecated: true,
	bail: 5,
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@test/(.*)$': '<rootDir>/test/$1',
	},
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
}

export default createJestConfig(customJestConfig)

// All imported modules in your tests should be mocked automatically
// automock: false,

// Automatically clear mock calls, instances, contexts and results before every test
// clearMocks: false,

// Reset the module registry before running each individual test
// resetModules: false,
