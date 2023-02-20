<h1 align="center">define-env</h1>

This package allows you to define environmental variables alongside their default development values.

If the values are missing it will throw an exception. This ensures production code always contains the expected environmental variables.


## Quick Start

<div align="center">
<code>npm i -D define-env</code>
  /  
<code>pnpm add -D define-env</code>
</div>

```typescript
const envVar = defineEnv(e => ({
    secret: e.VITE_SECRET,
    mongo: {
        uri: e.VITE_MONGOURI,
        database: e.VITE_MONGODATABASE
    },
	isNumber: e.VITE_NUMBER(parseFloat)
}),
/** Development default values */
{
    secret: 'dev',
    mongo: {
        uri: 'mongodb://0.0.0.0:27017',
        database: 'test-db',
    },
    isNumber: '25'
})
```

### Example exception

```ts
These environment variables are missing:
   
    mongo: 
        uri: VITE_MONGOURI
  
```

## Indepth
Create your env variable

```typescript
import defineEnv from 'define-env'

const envVar = defineEnv(e => ({...}))

export default envVar
```

Use `e` to access ENV variables

```typescript
const envVar = defineEnv(e => ({
    secret: e.VITE_SECRET,
    mongo: {
        uri: e.VITE_MONGOURI,
        database: e.VITE_MONGODATABASE
    },
}))
```

Format a value if it exists, to ex. a number

```typescript
const envVar = defineEnv(e => ({
    number: e.VITE_NUMBER(parseFloat),
    upper: e.VITE_SOMESTR(v => v.toUppserCase())
}))
```

Set default values for development.

```typescript
const envVar = defineEnv(e => ({
    secret: e.VITE_SECRET,
    mongo: {
        uri: e.VITE_MONGOURI,
        database: e.VITE_MONGODATABASE
    },
    isNumber: e.VITE_NUMBER(parseFloat)
}),
/** Development default values */
{
    secret: 'dev',
    mongo: {
        uri: 'mongodb://0.0.0.0:27017',
        database: 'test-db',
    },
    isNumber: '25'
})
```

Example exception:

```bash
These environment variables are missing:
   
    mongo: 
        uri: VITE_MONGOURI
  
```
