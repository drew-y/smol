
export const smolFib = `
    let fib = |n| {
        if n <= 1 { return n };
        fib(n - 1) + fib(n - 2)
    };

    let result = fib(10);
    print("The result is:");
    print(result);
`;

export const smolBasic = `
    let a = 1;
    let b = 2;
    let add = |x, y| { x + y; };
    let result = add(a, b);
    print("The result is");
    print(result);
`;

export const smolEasyTest = `
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
`;
