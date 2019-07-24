# Smol

A toy language for learning how to make programming languages.

```
let x = 1;
let y = 7;

let do_math = |x, y| {
    let add = |a, b| { a + b };

    print("x + y:");
    print(add(x, y));

    if y > 3 {
        print("y is greater than 3");
    }
};

do_math(x, y);
```
