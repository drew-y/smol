
export const smolFib = `
    let count = 10;

    let fib = |n| {
        if n < 1 { return 0; };
        if n == 1 { return 1; };
        fib(n - 1) + fib(n - 1);
    };

    let result = fib(count);
    print("The result is:");
    print(result);
`;

// Should eval to 512

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
