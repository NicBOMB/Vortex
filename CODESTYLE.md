# **Vortex code standards and style guides**
### **Clean Code: The Boy Scout Rule**
The rule of the boy scouts is: 

> Always leave the campground cleaner than you found it

When you find a mess on the ground, clean it, it doesn’t matter who did it. Your job is always to leave the ground cleaner for the next campers.

We apply this rule to our code, too; every time we have to refactor or improve old code, we also take care of updating it to our current quality standards.
## **Javascript/Typescript**
### ***Baseline***
*Unless otherwise noted below we follow the airbnb coding guidelines as formulated here: <https://github.com/airbnb/javascript>*
### **Line limit**
We agreed to have a soft limit of **100 characters per line and a hard limit of 150**; This will make it easier to have multiple files open side by side in your IDE.
### **The length of functions should not be very large:**
Lengthy functions are complicated to understand. That’s why functions should be small enough to carry out small work, and long functions should be broken into small ones for completing small tasks. 

We have a soft limit of **25 lines per function.**
#### **Async and Promises**
Use `async` and `await`, and avoid having long promise chains.

When vortex was written, ES6 Promises were incomplete, so we used Bluebird; this is not the case anymore.

To get rid of `Bluebird` we have to avoid certain constructs that are widely in use in Vortex but are Bluebird extensions:
```
somethingAsync().catch(ExceptionType, err => { … }) // NO

somethingAsync().catch(err => { if (err instanceof ExceptionType) { … } else { return Promise.reject(err); } }) // YES
```

```
Promise.map(stuff, item => somethingAsync(item)) // NO

Promise.all(stuff.map(item => somethingAsync(item))) // YES
```

```
Promise.delay(2000) // NO

new Promise((resolve) => setTimeout(resolve, 2000)); // YES
```

### **Naming conventions**
#### **React**
We enforce **PascalCase** for user-defined JSX components. 
```
<TestComponent />

<TestComponent>
```
#### **Types**
Use PascalCase. 

```
type NotificationFunc = (dismiss: NotificationDismiss) => void;
```

#### **Type `Any`**
We have the ESLint rule `no-explicit-any` disabled, but this does not mean you can use `Any` freely.

Use `Any` only when stricly necessary
#### **Interfaces**
Use PascalCase and `I` as a prefix. This is done since most of the team has a C# background.
```
interface IBaseProps {}
```
#### **Enums**
Use PascalCase.

```
export enum Decision {}
```
#### **Functions**
Use camelCase.
```
function fetchReduxState(tries: number = 5) {}
```
#### **Property names and local variables**
Use camelCase for property names and local variables.
```
let visibleLineCount = 0;

const copy = ordered.slice();
```
#### **Private properties**
Use `i` as a prefix or omit the prefix entirely.
```
class SplashScreen {

    private window: Electron.BrowserWindow;

}
```
#### **Const and Globals**
We use UPPER\_SNAKE\_CASE for global and/or exported variables.
```
export const NEXUS_MEMBERSHIP_URL = 'https://users.nexusmods.com/register/memberships';
```
### **Function Alignment and Formatting**
#### **Parameter alignment**
Either have all parameters and return type on one line if it fits within the soft limit or one line per argument like this:
```
function convertRow<T>(t: TFunction,
                       group: string,
                       rowId: string,
                       value: T)
                       : IRow<T> {
  [...]
}
```
#### **Generic parameters**
We prefer to pass generic parameters, like api or t, as the first parameters to functions.
```
function setShortcut(api: IExtensionApi, t: TFunction, profile: IProfile) {

`  `[...]

}
```
### **Localization**
All text has to be localizable on the front-end side, excluding errors.

The localized text has to be static.

Don’t:
```
const text = something ? 'give you up' : 'let you down'

const song = t(`Never gonna ${text}`)
```
Do:
```
const text = something ? 'give you up' : 'let you down'

const song = t(`Never gonna {{ text }}`,{ replace: { text } })
```

### **Error Logging**
The way our error feedback works is that error reports from users are grouped based on the error message and stack so that we don't get too many duplicates.

If you have a dynamic part in the error message that depends on the users system (or is random or a url or something) it has to be in quotes so that it gets ignored for the purpose of grouping the error reports otherwise every single occurrence of this error (if message is set) will produce a new report.

```
throw new CustomError(`CustomName "${Dynamic information goes here in quotes}"`)

```
### **File naming and folder structure**
*Proposal:
If a file contains primarily a class, interface or react component, the file name matches that class, including case (that is: UpperCamelCase).
Files primarily consisting of free-standing functions use lowerCameCase.*

### **Testing**
At the moment, we don’t aim for a 99.9999999% code coverage, but this does not mean we don’t write tests.

We agreed to write a test for all “off-path” and critical behaviors, such as changing the settings for the mod staging folders or the downloads directory. This should ensure that all critical code is tested and reliable.
