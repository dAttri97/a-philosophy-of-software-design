# Chapter 2 The Nature of Complexity

This book is about how to design software systems and reduce their complexity as much as possible. The first step is to know the enemy. What exactly is “complexity”? How can you tell whether a system is unnecessarily complex? What causes complexity? This chapter discusses these questions at a high level; later chapters show how to recognize complexity at a lower level from specific structural features.

The ability to recognize complexity is an extremely important design skill. It lets you identify problems before investing a lot of work and helps you make good choices among alternatives. Judging whether a design is simple is easier than creating a simple design—but when you can tell that a system is too complex, your design philosophy can steer toward simplicity guided by that ability. If a design feels complex, try a different approach and see whether it is simpler. Over time you will notice that some techniques lead to simpler designs and others correlate with complexity. That will let you produce simpler designs more quickly.

This chapter also states some basic assumptions that ground the rest of the book. Later chapters treat this material as given and use it to argue for various improvements and conclusions.

## 2.1 What complexity means

For the purposes of this book I define “complexity” in a practical way. **Complexity is anything related to the structure of a software system that makes it hard to understand and modify the system.** Complexity can take many forms. For example, it may be hard to understand how a piece of code works; it may take a lot of effort to make a small improvement; it may be unclear which part of the system to change to get a desired improvement; it may be hard to fix a bug without introducing new problems. If a system is hard to understand and change, it is complex; if it is easy to understand and change, it is simple.

You can also think of complexity in terms of cost versus benefit. In a complex system, even small improvements require large effort. In a simple system, larger improvements can be achieved with less investment.

Complexity is what developers experience at a particular moment while trying to achieve specific goals. It is not necessarily related to the overall size or feature set of the system. People often use “complex” to describe large systems with intricate features—but if such a system is easy to work on, it is not complex for the purposes of this book. Of course, almost all large, intricate software systems are in practice hard to work on, so they fit my definition—but that need not always be true. A small, simple-looking system can still be very complex.

Complexity is determined by the most common activities. If a system has some very complex parts that almost no one ever touches, they do not contribute much to overall complexity. In crude mathematical form:

$$
C=\sum_{p}c_pt_p
$$

The overall complexity $C$ of a system is the complexity $c_p$ of each part $p$, weighted by the fraction of time $t_p$ developers spend on that part. Isolating complexity so it is almost never felt is almost as good as removing it entirely.

Complexity is more obvious to readers than to authors. If you write code that feels simple to you but others find complex, it is complex. If you are in that situation, it is worth asking other developers why the code looks complex to them—you may learn something interesting from the disagreement. As a developer your job is not only to produce code you can use easily, but code others can use easily too.

## 2.2 Symptoms of complexity

Complexity appears in three general forms, described in the following paragraphs. Each form makes development tasks harder to perform.

**Change amplification:** The first symptom is that a seemingly simple change requires modifications in many places. For example, imagine a website with several pages, each displaying a banner with a background color. In many early websites the color was hard-coded on each page, as in Figure 2.1(a). To change the background for such a site, a developer had to edit every existing page by hand—almost impossible for a site with thousands of pages. Modern sites use the approach in Figure 2.1(b): the banner color is defined once in a central place and all pages reference that shared value. With that approach, one change can update the banner color for the whole site. One goal of good design is to reduce the amount of code affected by each design decision, so design changes do not require many code edits.

**Cognitive load:** The second symptom is *cognitive load*: how much a developer needs to know in order to complete a task. High cognitive load means developers must spend more time learning the required information, which raises the risk of mistakes because something important was missed. For example, suppose a C function allocates memory, returns a pointer, and expects the caller to free it. That raises cognitive load for anyone using the function; if the caller forgets to free, you get a leak. If the system can be refactored so callers do not worry about freeing (the same module that allocates also frees), cognitive load drops. Cognitive load arises from many sources: interfaces with many methods, global variables, inconsistency, and dependencies among modules.

System designers often think complexity can be measured by lines of code. They assume a shorter implementation must be simpler, and that a change touching only a few lines must be easy. That view ignores the cost of cognitive load. I have seen frameworks that need only a few lines to write an application, yet understanding those few lines is extremely hard. **A design that uses more code can actually be simpler because it lowers cognitive load.**

![](./figures/00010.jpeg)

Figure 2.1: Each page of a website displays a colored banner. In (a) the banner background color is hard-coded on each page. In (b) a shared variable holds the background color and each page references it. In (c) some pages use an additional accent color—a darker shade of the banner background; if the background color changes, the accent color must change too.

**Unknown unknowns:** The third symptom is that it is not obvious which code must change to complete a task, or what information a developer must have to do the job successfully. Figure 2.1(c) illustrates this. The site uses a central variable for the banner background, so changing the color sounds easy. But some pages use a darker shade of the background as an accent, and that darker color is specified on each page separately. If the background color changes, the accent color must be updated to match. Unfortunately developers may not realize this; they might change only the central variable `bannerBG` and not the accents. Even if they realize it, which pages use the accent may not be obvious, so developers may have to search every page on the site.

Of the three symptoms, unknown unknowns are the worst. Unknown unknowns mean there is information you need, but no way to know what it is—or even whether there is a problem. You may discover it only after a change breaks something. Change amplification is annoying, but if you know which code to change, the system can work once edits are done. Likewise, high cognitive load raises the cost of a change, but if you know what to learn, you can still get the change right. With unknown unknowns, it is unclear what to do or whether a proposed fix will work. The only sure approach is to understand all the code in the system, which is impossible at any scale. Even that may not be enough, because a change may depend on a subtle, undocumented design decision.

One of the most important goals of good design is to make systems *obvious*. That opposes high cognitive load and unknown unknowns. In an obvious system, a developer can quickly understand how existing code works and what is needed to make a change. In an obvious system developers can guess quickly what to do, with confidence that the guess is right. Chapter 18 discusses techniques for making code more obvious.

## 2.3 Causes of complexity

Now that you know the main symptoms of complexity and why complexity makes software development hard, the next step is to understand what causes complexity so we can design systems to avoid those problems. Complexity comes from two factors: *dependencies* and *obscurity*. This section discusses them at a high level; later chapters relate them to lower-level design decisions.

For this book, a *dependency* exists when a given piece of code cannot be understood or modified in isolation: it is tied to another piece of code, so if one changes, the other may need to change too. In the website example in Figure 2.1(a), the background color on each page creates dependencies among pages: they must stay consistent, so if you change one page’s background you must change all of them. Another example of dependency appears in network protocols: sender and receiver usually have separate code, but both must follow the protocol; changing the sender almost always requires matching changes at the receiver, and vice versa. A method’s signature creates a dependency between the method’s implementation and its callers: if you add a parameter, every call site must supply it.

Dependencies are fundamental to software and cannot be eliminated entirely. We deliberately introduce dependencies as part of design. Every time you write a new class you create dependencies around its interface. The goal of software design is to reduce dependencies and keep them as simple and obvious as possible.

Consider the website example again. In the old site each page defined its own background; all pages depended on one another. The new site defines the background in one place and exposes an interface each page calls to get the color to render. The new design removes dependencies among pages but introduces a new dependency on the interface for fetching the background color. The new dependency is clearer: each page depends on the `bannerBg` color, and developers can search by name to find all uses. The compiler also helps: if the shared variable is renamed, code still using the old name fails to compile. The new site replaces obscure, hard-to-manage dependencies with simpler, clearer ones.

The second cause of complexity is *obscurity*. Obscurity arises when important information is not obvious. A simple example is a variable whose name is so generic it carries little information (such as `time`). Or documentation might omit the units for a variable, forcing you to scan the code to see how it is used. Obscurity is often tied to dependencies when the dependency itself is not obvious. For example, if you add a new error state to a system, you may need to add a row to a table holding string messages for each state—but a programmer looking only at the state declarations may not realize the table exists. Inconsistency is also a major source of obscurity: if the same variable name is used for two different purposes, it will not be obvious which purpose applies in a given place.

In many cases obscurity comes from insufficient documentation; Chapter 13 discusses that topic. But obscurity is also a design problem. If the system design is clean and clear, less documentation is needed. Needing a lot of documentation is often a red flag that the design is not quite right. The best way to reduce obscurity is to simplify the system design.

Dependencies and obscurity together explain the three symptoms in Section 2.2. Dependencies cause change amplification and high cognitive load. Obscurity causes unknown unknowns and also increases cognitive load. If we can find design techniques that minimize dependencies and obscurity, we can reduce software complexity.

## 2.4 Complexity is incremental

Complexity is not caused by a single terrible mistake; it accumulates in small steps. A single dependency or obscurity is unlikely to affect maintainability much. Complexity arises because hundreds of small dependencies and obscurities pile up over time. Eventually almost every possible change is affected by several of these small issues.

The incremental nature of complexity makes it hard to control. It is easy to tell yourself that a little extra complexity from the current change does not matter much. But if every developer does that on every change, complexity snowballs. Once complexity has accumulated, it is hard to remove: fixing a single dependency or obscurity by itself does not help much. To slow complexity growth you need a “zero tolerance” mindset, as described in Chapter 3.

## 2.5 Conclusion

Complexity comes from the accumulation of dependencies and obscurity. As complexity increases, it leads to change amplification, high cognitive load, and unknown unknowns. As a result, each new feature requires more code changes. Developers must spend more time gathering enough information to make changes safely, and in the worst case they cannot find all the information they need. In short, complexity makes changing an existing codebase difficult and risky.
