import * as U from 'utility-types'
import c from 'chalk'

export class EnvVariableMissing {
	name: string
	cb: (v: any) => any
	constructor(name: string, cb?: (v: any) => any) {
		this.name = name
		this.cb = cb || (v => v)
	}
}

export default function createEnv<T extends Record<any, any>>(cb: (env: any) => T, devDefaults = {} as U.DeepPartial<T>): Readonly<T> {
	// @ts-expect-error: import.meta.env is not defined in Node.js
	const env = import.meta.env || process.env

	const errors: Record<any, any> = {}

	const e = new Proxy({}, {
		get(target: any, prop: string) {
			const fn = <T>(cb?: (v: any) => T): T => {
				if (prop in env)
					return cb ? cb(env[prop]) : env[prop]
				return new EnvVariableMissing(prop, cb) as T
			}
			fn.__envfn = true
			return fn
		}
	})

	const envVars = cb(e)

	const setError = (str: string, path: string[]) => {
		let o = errors
		for (let i = 0;i < path.length - 1;i++)
			o = o[path[i]] = o[path[i]] || {}
		o[path[path.length - 1]] = str
	}

	const setPath = (path: string[], value: any) => {
		let o = envVars as Record<any, any>
		for (let i = 0;i < path.length - 1;i++)
			o = o[path[i]] = o[path[i]] || {}
		o[path[path.length - 1]] = value
	}

	const hasAndSetDefault = (path: string[], value: EnvVariableMissing) => {
		if (env.NODE_ENV === 'production')
			return false
		let dValue: any = devDefaults
		for (let i = 0;i < path.length;i++) {
			if (!(path[i] in dValue))
				return false
			dValue = dValue[path[i]]
		}
		let envVar: any = envVars
		for (let i = 0;i < path.length - 1;i++) {
			if (!(path[i] in envVar))
				envVar[path[i]] = {}
			envVar = envVar[path[i]]
		}
		envVar[path[path.length - 1]] = value.cb(dValue)
		return true
	}

	const check = (obj: any, path: string[] = []) => {
		for (const key in obj) {
			let value = obj[key]
			if (value.__envfn) {
				value = value()
				setPath([...path, key], value)
			}
			if (value instanceof EnvVariableMissing && !hasAndSetDefault([...path, key], value))
				setError(` <${value.name}>`, [...path, key])
			else if (typeof value === 'object')
				check(value, [...path, key])
		}
	}

	check(envVars)
	
	if (Object.keys(errors).length > 0) {
		const str = JSON.stringify(errors, null, 4).replaceAll(/[",]/g, '').slice(1, -1).replaceAll(/<([^>]*)>/g, c.cyan('$1'))
		throw new Error(`${c.red('These environment variables are missing:')}\n${c.yellow(str)}\n${c.dim('If an environment variable is meant to be undefined,\nset the value as undefined or null for the development\ndefaults in the second parameter of createEnv.')}\n`)
	}
	return envVars
}
