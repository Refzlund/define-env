// import expect from 
import { expect } from 'chai'
import createEnv from './create-env'
import { config } from 'dotenv'

config({
	path: '.env.test'
})

describe('createEnv', () => {
	it('should throw an error if a required environment variable is missing', () => {
		const v = () =>
			createEnv(e => ({
				var: {
					one: e.VITE_ONE
				}
			}))
		
		expect(v).to.throw('These environment variables are missing:')
	})

	it('it should return an object that has the environment variable', () => {
		const v = createEnv(e => ({
			var: {
				one: e.TEST
			}
		}))
		
		expect(v).to.nested.include({ 'var.one': 'test' })
	})

	it('should return an object with the default values', () => {
		const v = createEnv(
			e => ({
				nonexistent: {
					hasDefault: e.DOESNOTEXIST
				}
			}),
			{
				nonexistent: {
					hasDefault: 'default'
				}
			}
		)
		
		expect(v).to.nested.include({ 'nonexistent.hasDefault': 'default' })
	})

	it('should format values', () => {
		const v = createEnv(
			e => ({
				number: e.NUMBER(parseFloat),
				defNumber: e.DEFNUMBER(parseFloat)
			}),
			{
				defNumber: '25'
			}
		)

		expect(v).to.nested.include({ 'number': 2, 'defNumber': 25 })
	})
})

