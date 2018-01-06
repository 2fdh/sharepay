// If you want information about what a rule does
// you can visite https://eslint.org/docs/rules/RULE_NAME

module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "test": false,
        "expect": false,
        "jest": false,
        "describe": false
    },
    "rules": {
        "indent": ["error", 2], // 2 spaces indentation
        "linebreak-style": ["error","unix"], // line-breaks are unix
        "quotes": ["error", "double"], // enforces double quotes
        "semi": ["error", "always"], // semicolons must be there
        "no-var": "error", // only let and const
        "no-console": 0, // allow console.log usage
        "no-template-curly-in-string": "warn", // warns if you use the `${}` syntax inside a string
        "array-callback-return": "error", // folding on an array must be done with a function that returns something
        "eqeqeq": "error", // disallow `==` in favor of `===`
        "no-global-assign": "error", // disalllow creating global variables without a declaration
        "no-implied-eval": "error", // disallow calling setTimeout and setInterval with strings for the function argument
        "no-param-reassign": "error", // prevent the redefining of a function
        "no-return-assign": "error", // disallow assigning a variable inside a return
        "no-self-compare": "error", // disallow `x === x`
        "no-sequences": "error", // disallow this weird thing `var a = (3, 5); // a = 5`
        "radix": "error", // force using a radix with `parseInt`
        "global-require": "error", // force require to be called at the beggining of files
        "handle-callback-err": "error", // force doing something with the error parameter of a callback
        "no-mixed-requires": "error", // require should not be mixed with variables
        "no-new-require": "error", // disallow using new with a require on the same line

        // INTERMEDIATE
        "no-multi-spaces": "error", // forbit useless spaces
        "no-new": "error", // can't use `new` without asigning the result to a variable
        "no-unmodified-loop-condition": "error", // condition of a loop must be changed inside of the loop and not by mutation
        "no-useless-concat": "error", // disallow `"a" + "b"` in favor of `"ab"`
        "no-path-concat": "error", // force using path for joining directories (avoid messing with OS)
        "no-duplicate-imports": "error", // disallow importing twice from the same lib
        "prefer-const": "error", // prevents using let for variables that are never reassigned
    }
};
