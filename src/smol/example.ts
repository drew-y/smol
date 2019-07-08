
export const smol = `
    let count = 10;

    let fib = |n| {
        if n < 1 return 0;
        if n == 1 return 1;
        fib(n - 1) + fib(n - 1);
    };

    let result = fib(count);
    print("The result is:");
    print(result);
`;
