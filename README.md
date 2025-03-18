# Babel Plugin Transform Equal Chain

A basic transformer which simplifies multiple equality statements.


#### It takes something like this
```
typeof something === "string" || typeof something === "number" || typeof something === null
```

#### And reduces it to this
```
typeof something === ("string" || "number" || null)
```

#### It works with both loose and strict equality
```
// strict
typeof something === (null || undefined || true)

// loose
typeof anotherThing == (null || undefined || true) 
```


## Installation
> npm i babel-plugin-transform-equal-chain

## usage
Add `transform-equal-chain` to your babel config 

babel.config.json
```
{
  "plugins": ["transform-equal-chain"]
}
```
