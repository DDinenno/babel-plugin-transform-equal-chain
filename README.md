# Babel Plugin Transform Equal Chain

A basic transformer which simplifies multiple equal statements.


#### It takes something like this
```
typeof something === "string" || typeof something === "number" || typeof something === null
```

#### Which can be written like this, but outputs to the example above
```
typeof something === ("string" || "number" || null)
```

#### It workes with both loose and strict equality
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