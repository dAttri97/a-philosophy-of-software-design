# Chapter 3 Working Code Isn't Enough
(Strategic versus tactical programming)

One of the most valuable elements of great software design is the mindset you bring to programming tasks. Many teams encourage tactical thinking, focused on getting a feature working as soon as possible. If you want a great design, however, you must take a more strategic approach and invest time in clean design and problem-solving. This chapter explains why the strategic approach yields better designs and is actually cheaper in the long run than the tactical approach.

## 3.1 Tactical programming

Most programmers develop software using a mindset I call *tactical programming*. In the tactical approach your main concern is to get something working—a new feature or a bug fix. At first glance that sounds reasonable: what could be more valuable than working code? Yet tactical programming almost never produces great system design.

The problem with tactical programming is short-term thinking. If you are programming tactically, you are trying to finish the task as fast as possible. You probably have a deadline. So planning ahead is not a priority. You do not spend much time looking for the best design; you just want it working soon. You tell yourself that a little extra complexity or one or two small shortcomings is acceptable if it helps you finish the current task faster.

That is how systems become complex. As the previous chapter discussed, complexity is incremental. No single thing makes a system complex; dozens or hundreds of small things do. If you program tactically, each task adds a bit of complexity. Each may look like a reasonable trade-off to finish quickly—but complexity accumulates quickly, especially if everyone programs tactically.

Soon some of that complexity starts to cause problems, and you begin to wish you had not taken those early shortcuts. But you tell yourself that getting the next feature working is more important than going back to refactor. Refactoring may help long-term, but it slows the current task. So you apply quick patches for each problem you hit. That raises complexity further and demands more patches. Before long the code is a mess; cleaning it up would take months. Your schedule cannot afford that delay, and fixing one or two problems does not seem to matter much, so you keep programming tactically.

If you have worked on a large software project for a long time, I suspect you have seen tactical programming and the problems it causes. Once you start down the tactical path, it is hard to change.

Almost every software organization has at least one developer who takes tactical programming to an extreme: the *tactical tornado*. The tactical tornado is a prolific programmer who writes code much faster than anyone else, in a purely tactical way. When implementing an urgent feature, nobody is faster than the tactical tornado. In some organizations management treats the tactical tornado as a hero. Yet the tactical tornado sows the seeds of destruction. Engineers who must maintain that code later rarely consider the tornado a hero. Other engineers often clean up the mess the tornado leaves behind; compared with the tornado those engineers (the real heroes) look slow.

## 3.2 Strategic programming

The first step toward becoming a good software designer is realizing that **working code is not enough**. Introducing unnecessary complexity to finish the current task faster is unacceptable. The long-term structure of the system matters most. Most code is written by extending an existing codebase, so your most important job as a developer is to make future extensions easier. Thus working code is table stakes; it should not be your primary goal. The primary goal should be a great design; working code follows naturally. That is *strategic programming*.

Strategic programming requires an investment mindset. You must spend time improving the design of the system instead of taking the fastest path to finish the current project. Those investments slow you down a little in the short term but speed you up over the long term, as shown in Figure 3.1.

Some investments are proactive. For example, it is worth spending a little extra time on each new class to find a simple design—rather than implementing the first idea that comes to mind, try a few alternatives and pick the cleanest. Think about how the system might change in the future and make sure your design can accommodate those changes easily. Writing good documentation is another example of proactive investment.

Other investments are reactive. No matter how much you plan ahead, design mistakes will happen; over time they surface. When you find a design problem, do not ignore it or patch around it—spend a little extra time to fix it properly. If you program strategically, you keep making small improvements to the system design. That is the opposite of tactical programming, which keeps adding small bits of complexity that cause problems later.

## 3.3 How much to invest

What is the right amount of investment? A huge upfront effort to design the whole system pays poorly—that is the waterfall approach, and we know it works badly. The ideal design emerges as you learn more about the system. So the best approach is many small, ongoing investments. I suggest spending about 10–20% of development time on investment. That is small enough not to hurt schedules much but large enough to pay off over time. The initial project will take 10–20% longer than a purely tactical approach. That extra time produces better software design, and within a few months you will begin to feel the benefits. Soon your development speed will be at least 10–20% faster than with tactical programming—at that point your investment pays for itself: past savings fund future investment. You recover the initial cost quickly. Figure 3.1 illustrates this.

Conversely, if you program tactically, the first project finishes 10–20% faster, but over time your development speed slows as complexity accumulates. Before long you are at least 10–20% slower. You quickly give back all the time you saved early, and for the rest of the system’s life you are slower than with a strategic approach. If you have never worked in a badly degraded codebase, talk to someone who has; they will tell you poor code quality easily cuts development speed by at least 20%.

## 3.4 Startups and investment

In some environments strong forces push against the strategic approach. For example, growth-stage startups face intense pressure to ship early versions quickly. For them even a 10–20% investment may feel unaffordable. Many startups therefore take a tactical approach, invest little in design, and invest even less in cleaning up problems as they appear. They say that if the startup succeeds, they will have money to hire more engineers to clean things up.

If you are in a company leaning that way, understand that once a codebase turns into spaghetti, it is almost impossible to fix. You will likely pay a high development cost for the product’s maintainability. Also, good (or bad) design shows its effects quickly—so the tactical approach may not even speed the first release.

Another factor in a company’s success is engineer quality. The best way to lower development cost is to hire great engineers: they do not cost much more than average engineers but are vastly more productive. Great engineers care deeply about good design. If the codebase is a mess, word gets out and hiring gets harder. You may end up with average engineers, raising expected cost and possibly degrading the architecture further.

Facebook is an example of a startup that encouraged tactical programming. For years the company’s motto was “move fast and break things.” New college graduates were pushed to contribute to code immediately; shipping to production in the first week was common. On the positive side, Facebook became known as a company that empowered engineers: lots of freedom, few rules.

Facebook succeeded spectacularly as a company, but its codebase suffered from the tactical culture: large amounts of code were unstable and hard to understand, with few comments or tests, and painful to work with. Eventually the company realized the culture was unsustainable. It changed its motto to “move fast with stable infrastructure” to encourage more investment in good design. Whether Facebook can fully clean up years of tactical debt remains to be seen.

To be fair, Facebook’s code was not much worse than the average startup’s. Tactical programming is common at startups; Facebook is just a particularly visible example.

Companies can succeed in Silicon Valley with a strategic approach too. Google and VMware grew alongside Facebook, but both took a more strategic line. Both emphasized high-quality code and good design, and both built cutting-edge products backed by reliable software solving hard problems. Their strong engineering cultures became widely known. Few companies could compete with them for top technical talent.

These examples show that companies can succeed either way—but it is more pleasant to work at a company that cares about software design and keeps a clean codebase.

## 3.5 Conclusion

Good design is not free. It takes continuous investment so that small problems do not sink the ship. Fortunately good design pays for itself faster than you might think.

What matters most is consistency: adopt a strategic approach and treat investment as something to do now, not tomorrow. When you are under pressure it is easy to defer cleanup until “after the crunch.” That is a slippery slope: after the current crunch there is almost always another, and another after that. Once you defer design improvements, it is easy to defer them permanently and for the culture to slide into tactical methods. The longer design problems wait, the larger they grow; fixes look more daunting and get deferred again. The most effective approach is for every engineer to invest a small, steady amount of effort in good design.
