# form-validation

Небольшой хелпер для валидации форм в JS.

Вдохновлено библиотекой [YUP](https://link-url-here.org](https://github.com/jquense/yup)https://github.com/jquense/yup).

Маленькая библиотека для валидации данных.

### Общие методы для String и Number

```typescript
    import { string, number } from "form-validator";
    
    string().optional() // предотвращает проверку isMatches для пустых строк
    number().optional() // ignore

    string().isRequired(error?: string) // Делает поле обязательным для заполнения
    number().isRequired(error?: string)  // Делает поле обязательным для заполнения

    string().nullable() // позволяет пройти проверку типа если передать значения null или undefined
    number().nullable() // позволяет пройти проверку типа если передать значения null или undefined

    string().custom(value => {
        const hasError = value === "some string";
        return { hasError, error: hasError ? "Custom error message" : null }
    }) // позволяет создавать кастомные проверки, также работает с асинхронными колбеками
    number().custom(async (value) => {
        const hasError = value === 12;
        return Promise.resolve({ hasError, error: hasError ? "Custom error message" : null })
    }) // позволяет создавать кастомные проверки, также работает с асинхронными колбеками
```

### String:
```string(errorMessage?: string)``` - при валидации проверяет тип входящего значения, также можно передать сообщение об ошибке

```javascript
    import { string } from "form-validator"

    const stringValidator = string("That's not a string");
    await stringValidator.validate("Some string"); // => { hasError: false, error: null }
    await stringValidator.validate(1111); // => { hasError: true; error: "That's not a string" }
```

У строкового валидатора есть проверка на совпадение
```string().isMatches("test", error?: string)```
```javascript
    import { string } from "form-validator"

    const stringValidator = string().isMatches(/test/, "Doesn't match");
    await stringValidator.validate("test"); // => { hasError: false, error: null }
    await stringValidator.validate("wrong"); // => { hasError: true; error: "Doesn't match" }
```
Однако, если строка будет пустая, этот метод также выдаст ошибку, если необходимо пропустить проверку для пустой строки
надо вызвать ```optional()```
```string().isMatches("test", error?: string)```
```javascript
    import { string } from "form-validator"

    const stringValidator = string().optional().isMatches(/test/, "Wrong Format");
    await stringValidator.validate(""); // => { hasError: false, error: null }
```

### Number
```number(errorMessage?: string)``` - при валидации проверяет тип входящего значения, также можно передать сообщение об ошибке

```javascript
    import { number } from "form-validator";

    const num = number();

    await num.validate(0); // => { hasError: false; error: null }
    await num.validate("0"); // => { hasError: true; error: "Not a number" }
    await num.validate(NaN); // => { hasError: true; error: "Not a number" }
```
Для числовых проверок можно установить ```min(value: number, error?: string)``` и ```max(value: number, error?: string)```;
```javascript
    import { number } from "form-validator";
    const num = number().min(3, "less than 3").max(12, "more than 12");

    await num.validate(5); // => { hasError: false; error: null }
    await num.validate(1); // => { hasError: true; error: "less than 3"}
    await num.validate(15); // => { hasError: true; error: "more than 12"}
```
### Scheme

```scheme()``` Для проверки объектов

```typescript
    import { Scheme, string, number } from "form-validator";

    const scheme = new Scheme<{ name: string; amount: number}>({
        name: string().isRequired().custom(async (value) => {
            const isUnique = await checkNameUniqueness(value);
            const hasError = !isUnique;
            return { hasError, error: hasError ? "Not unique" : null };
        }),
        amount: number().nullable(),
    })

    await scheme.validate({ name: "Unique name", amount: 10 }) // => { hasError: false; errors: {} };
    await scheme.validate({ name: "Not unique", amount: 10 }) // => { hasError: true; errors: { name: "Not unique" } }
```
```scheme().if()``` Иногда бывает что условие для валидации нужны в динамике, когда условия одно поля зависят от значения другого,
например, при заполнении контактов нужно чтобы хотя бы одно было заполнено либо email, либо телефон. Тут нам на помощь придёт условный метод
```typescript
    import { Scheme, string } from "form-validator";

    const scheme = new Scheme({ email: string().isRequired(), phone: string().isRequired() }).if([
        {
            condition: ({ email }) => !Boolean(email),
            scheme: { phone: string().nullable() }
        },
        {
            condition: ({ phone }) => !Boolean(email),
            scheme: { email: string().nullable() }
        }
    ]);
```
