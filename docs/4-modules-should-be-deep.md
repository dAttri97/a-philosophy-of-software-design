# Chapter 4 Modules Should Be Deep

One of the most important techniques for managing software complexity is to design the system so developers **need to confront only a small fraction of the overall complexity at any given time**. This approach is called *modular design*; this chapter introduces its basic ideas.

## 4.1 Modular design

In a modular system the software is split into a collection of relatively independent modules. Modules can take many forms, such as classes, subsystems, or services. In an ideal world each module would be completely independent: a developer could work in any module without knowing anything about the others. In that world a system’s complexity would be about that of its worst module.

Unfortunately that ideal cannot be achieved. Modules must coordinate by calling each other’s functions or methods. **So modules must know about each other: dependencies exist between modules.** If one module changes, others may need matching changes. For example, method parameters create dependencies between the method and all call sites: if the parameters change, every caller must change to match the new signature. Dependencies take many other forms and can be subtle. The goal of modular design is to **minimize dependencies among modules**.

To manage dependencies we split each module into two parts: interface and implementation. The interface contains everything a developer working in another module must know to use the given module. The interface describes what the module does, not how it does it. The implementation consists of the code that fulfills the promises of the interface. A developer working in a particular module must understand that module’s interface and implementation, plus the interfaces of every other module it calls. Implementations of modules they do not use should be invisible.

Consider a module that implements a balanced tree. It may contain intricate code to keep the tree balanced. That complexity is not visible to users of the module. Users see a relatively simple interface for inserting, deleting, and looking up nodes in the tree. To insert, callers supply only a key and value; traversing the tree and splitting nodes are not part of the interface.

For this book a *module* is a unit of code with an interface and an implementation. In object-oriented languages each class is a module. Methods in a class or functions in non-object-oriented languages can also be treated as modules: each has interface and implementation, and modular design techniques apply. Higher-level subsystems and services are modules too; their interfaces may take different forms, such as kernel calls or HTTP requests. Most of this book discusses designing classes, but the ideas apply to other kinds of modules as well.

The best modules are those whose interfaces are much simpler than their implementations. Such modules have two advantages. First, a simple interface minimizes the complexity the module imposes on the rest of the system. Second, if a module can change without changing its interface, no other module is affected by the change. If an interface is much simpler than the implementation, many aspects of the implementation can change without affecting other modules.

## 4.2 What goes in an interface

A module’s interface contains two kinds of information: formal and informal. The formal part is specified explicitly in code; some of it can be checked by the programming language. For example, the formal part of a method’s interface is its signature: parameter names and types, return type, and exceptions thrown. Most languages ensure each call supplies the right number and types of arguments. A class’s formal interface includes the signatures of all its public methods and the names and types of public variables.

Every interface also has an informal part. These aspects are not specified in a way the language can enforce. The informal part includes high-level behavior—for example, that a function deletes a file whose name is passed as an argument. If a class has usage constraints (such as one method must be called before another), those constraints are part of the interface too. Generally, if a developer needs to know something to use a module correctly, that information is part of the interface. For most interfaces the informal part is larger and more complex than the formal part; it can only be described in comments, and the language cannot ensure the description is complete or accurate.^1

A clear interface helps by telling developers exactly what they need to know to use the module. That reduces the “unknown unknowns” problem from Section 2.2.

## 4.3 Abstraction

The term *abstraction* is closely tied to modular design. **An abstraction is a simplified view of an entity that omits unimportant details.** Abstractions are useful because they let us think about and work with complex things more easily.

In modular programming each module provides an abstraction through its interface. The interface offers a simplified view of the module’s functionality; from the abstraction’s point of view, implementation details are unimportant and are omitted from the interface.

The word *unimportant* is crucial in the definition of abstraction. The more unimportant details you omit from an abstraction, the better—but you can only omit details that are truly unimportant. Abstractions can fail in two ways. First, they can include details that are not actually important, making the abstraction unnecessarily complex and raising cognitive load for developers who use it. Second, they can omit details that actually matter. That produces obscurity: developers looking only at the abstraction cannot get all the information they need to use it correctly. An abstraction that omits important details is a *wrong* abstraction: it may look simple, but it is not. The key to designing abstractions is understanding what matters and finding designs that minimize the amount of important information.

Consider a file system. The abstraction provided by a file system hides many details, such as how blocks on storage devices are chosen for a particular file’s data. Those details usually do not matter to file system users (as long as performance is adequate). Some implementation details do matter to users, however. Most file systems cache data in main memory and delay writing new data to storage to improve performance. Some applications, such as databases, need to know exactly when data reaches storage so they can guarantee durability after a crash. So the rules for flushing data to secondary storage must be visible in the file system interface.

We rely on abstractions not only in programming to manage complexity but also in daily life. A microwave contains complex electronics to convert AC power to microwave radiation and spread it through the cooking cavity. Fortunately users see a simple abstraction: a few buttons to control timing and power. Cars offer a simple abstraction that lets us drive without understanding engines, battery management, anti-lock brakes, cruise control, and so on.

## 4.4 Deep modules

Great modules provide powerful functionality through a simple interface. I use the word *deep* to describe such modules. To visualize depth, imagine each module represented by a rectangle, as in Figure 4.1. The area of the rectangle is proportional to the functionality implemented by the module. The top edge of the rectangle represents the module’s interface; its length represents interface complexity. The best modules are *deep*: they have a lot of functionality hidden behind a simple interface. A deep module is a good abstraction because only a small fraction of its internal complexity is visible to users.

![](./figures/00012.jpeg)

Figure 4.1: Deep versus shallow modules. The best modules are deep: they expose a lot of functionality through a simple interface. Shallow modules have a complicated interface relative to the functionality they provide: they do not hide much complexity.

Module depth is one way to think about cost versus benefit. The benefit a module provides is its functionality. The module’s cost (in terms of system complexity) is its interface. The interface represents the complexity the module imposes on the rest of the system: the smaller and simpler the interface, the less complexity it adds. The best modules have large benefits and small costs. A better interface is not always one with more or larger methods!

The file I/O machinery in Unix and its descendants (such as Linux) is an excellent example of a deep interface. I/O is built on five basic system calls with simple signatures:

```c
int open(const char* path, int flags, mode_t permissions);
ssize_t read(int fd, void* buffer, size_t count);
ssize_t write(int fd, const void* buffer, size_t count);
off_t lseek(int fd, off_t offset, int referencePosition);
int close(int fd);
```

`open` takes a hierarchical file name (such as `/a/b/c`) and returns an integer *file descriptor* used to refer to the open file. Other parameters to `open` provide options such as whether to open for reading or writing, whether to create the file if missing, and what permissions a newly created file should have. `read` and `write` transfer data between an application buffer and a file. `close` ends access to the file. Most files are accessed sequentially by default; random access is done by calling `lseek` to change the current position.

A modern Unix I/O implementation may require hundreds of thousands of lines of code to solve problems such as:

- How are files represented on disk for efficient access?
- How are directories stored, and how are hierarchical path names resolved to files?
- How is permission enforcement implemented so one user cannot modify or delete another’s files?
- How is file I/O structured—for example, how are interrupt handlers and background code structured, and how do they communicate safely?
- What scheduling policies apply when many files are accessed concurrently?
- How is recently used file data cached in memory to reduce disk accesses?
- How are different secondary storage devices (disks, flash, etc.) unified under one file system?

All of this—and more—is implemented by the Unix file system; it is invisible to code that calls these system calls. The implementation of Unix I/O has changed radically over the years, but the five basic kernel entry points have not.

Another example of a deep module is a garbage collector in a language such as Go or Java. This module has almost no interface: it runs in the background reclaiming unused memory. Adding garbage collection actually *shrinks* the overall system interface by removing the need for an interface to free objects. The collector’s implementation is very complex, but that complexity is hidden from programmers using the language.

Unix I/O and garbage collectors are deep modules: they provide powerful abstractions that are easy to use but hide substantial implementation complexity.

## 4.5 Shallow modules

A *shallow* module is one whose interface is complicated relative to the functionality it provides. For example, a class implementing a linked list is shallow. Manipulating a list does not take much code (inserting or deleting an element is a few lines), so the abstraction does not hide much detail. The interface complexity is almost as high as the implementation complexity. Shallow classes are sometimes unavoidable, but they do not help much with managing complexity.

Here is an extreme example of a shallow method from a software design class project:

```java
private void addNullValueForAttribute(String attribute) {
    data.put(attribute, null);
}
```

From a complexity-management perspective this method makes things worse, not better. It provides no abstraction: its entire behavior is visible from the interface. Callers may need to know that attributes are stored in the variable `data`. Thinking about the interface is no easier than thinking about the full implementation. If the method were documented properly, the documentation would be longer than the code. Callers would type more characters than if they manipulated `data` directly. The method adds complexity (a new interface for developers to learn) without compensating benefit.

🚩 Red Flag: Shallow Module 🚩

A shallow module is one whose interface is complicated relative to the functionality it provides. Shallow modules don’t help much in the battle against complexity, because the benefit they provide (not having to learn how they work internally) is negated by the cost of learning and using their interfaces. Small modules tend to be shallow.

## 4.6 Classitis

Unfortunately the value of deep classes is not widely recognized today. Conventional wisdom says classes should be *small*, not deep. Students are often taught that the most important thing in class design is to split large classes into small ones. The same advice is given for methods: “Any method longer than *N* lines should be split into multiple methods” (where *N* can be as low as 10). That approach produces large numbers of shallow classes and methods and raises overall system complexity.

I call the “classes should be small” extreme *classitis*. It comes from the mistaken belief that “classes are good, so more classes are better.” In a classitis-ridden system, developers are pushed to minimize the amount of functionality in each new class: if you want more functionality, add more classes. Classitis may keep each class simple, but it increases overall complexity. Small classes do not add much functionality, so there must be many classes, each with its own interface. Those interfaces accumulate enormous complexity at the system level. Small classes also encourage a verbose programming style, since each class needs boilerplate.

## 4.7 Example: Java and Unix I/O

The clearest example of classitis today may be the Java class library. The Java language does not require huge numbers of tiny classes, but classitis culture seems entrenched in the Java community. For example, to open a file for reading serialized objects you must create three different objects:

```java
FileInputStream fileStream = new FileInputStream(fileName);
BufferedInputStream bufferedStream = new BufferedInputStream(fileStream);
ObjectInputStream objectStream = new ObjectInputStream(bufferedStream);
```

A `FileInputStream` provides only basic I/O: it does not do buffered I/O or read/write serialized objects. A `BufferedInputStream` adds buffering to a `FileInputStream`; an `ObjectInputStream` adds the ability to read and write serialized objects. In the code above, `fileStream` and `bufferedStream` are never used again after the file is opened; all later operations use `objectStream`.

It is obnoxious (and error-prone) that buffering must be requested explicitly by creating a separate `BufferedInputStream`; if developers forget, there is no buffering and I/O is slow. Java advocates might argue that not everyone wants buffered file I/O, so buffering should not be built into the base layer. Choice is good, but **interface design should make the common case as simple as possible** (see the formula on page 6). Almost everyone doing file I/O wants buffering, so buffering should be the default. For the few cases that do not need it, there should be a way to disable it. Any mechanism to disable buffering should be separated in the interface (for example via a different `FileInputStream` constructor or methods to disable or replace buffering) so most developers never need to think about it.

By contrast, Unix system call designers made the common case simple. They recognized that sequential I/O is most common, so they made it the default. Random access is still easy with `lseek`, but developers doing only sequential access need not know about it. If an interface has many features but most developers only need a few, the *effective* complexity of the interface is only that of the commonly used features.

## 4.8 Conclusion

By separating interface from implementation we can hide implementation complexity from the rest of the system. Users of a module need only understand the abstraction its interface provides. When designing classes and modules, the most important question is how to make them deep: keep the interface simple for common cases while still providing powerful functionality. That hides complexity effectively.

1There are now definition languages, mainly in the research community, that can specify the full behavior of methods or functions in a formal way. Implementations can be checked automatically against such definitions. An interesting question is whether such specifications could replace the informal parts of interfaces. My current view is that English descriptions are still more intuitive and easier to understand than formal specification languages for interface documentation.
