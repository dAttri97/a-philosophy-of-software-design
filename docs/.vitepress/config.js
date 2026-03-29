export default {
    appearance: true,
    base: '/a-philosophy-of-software-design/',
    lang: 'zh-CN',
    title: '软件设计哲学',
    lastUpdated: true,
    themeConfig: {
        sidebar: [{
            items: [
                { text: '0 前言', link: '/0-preface' },
                { text: '1 介绍', link: '/1-introduction' },
                { text: '2 复杂度的本质', link: '/2-the-nature-of-complexity' },
                { text: '3 可运行的代码是不够的', link: '/3-working-code-is-not-enough' },
                { text: '4 模块应深厚', link: '/4-modules-should-be-deep' },
                { text: '5 信息隐藏（和泄漏）', link: '/5-information-hiding-and-leakage' },
                { text: '6 General-Purpose Modules are Deeper', link: '/6-general-purpose-modules-are-deeper' },
                { text: '7 Different Layer, Different Abstraction', link: '/7-different-layer-different-abstraction' },
                { text: '8 Pull Complexity Downwards', link: '/8-pull-complexity-downwards' },
                { text: '9 Better Together Or Better Apart?', link: '/9-better-together-or-better-apart' },
                { text: '10 Define Errors Out Of Existence', link: '/10-define-errors-out-of-existence' },
                { text: '11 Design it Twice', link: '/11-design-it-twice' },
                { text: '12 Why Write Comments? The Four Excuses', link: '/12-why-write-comments-the-four-excuses' },
                { text: '13 Comments Should Describe Things that Aren’t Obvious from the Code', link: '/13-comments-should-describe-things-that-are-not-obvious-from-the-code' },
                { text: '14 Choosing Names', link: '/14-choosing-names' },
                { text: '15 Write The Comments First', link: '/15-write-the-comments-first' },
                { text: '16 Modifying Existing Code', link: '/16-modifying-existing-code' },
                { text: '17 Consistency', link: '/17-consistency' },
                { text: '18 Code Should be Obvious', link: '/18-code-should-be-obvious' },
                { text: '19 Software Trends', link: '/19-software-trends' },
                { text: '20 Designing for Performance', link: '/20-designing-for-performance' },
                { text: '21 Decide What Matters', link: '/21-decide-what-matters' },
                { text: '22 Conclusion', link: '/22-conclusion' },
                { text: 'Summary', link: '/summary' }
            ]
        }],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/lamb/a-philosophy-of-software-design/' }
        ],
        editLink: {
            pattern: 'https://github.com/lamb/a-philosophy-of-software-design/edit/master/docs/:path',
            text: 'Edit this page on GitHub'
        }
    },
    markdown: {
        config: (md) => {
            md.use(require('markdown-it-texmath'), { katexOptions: { output: "html" } })
        }
    },
    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => ["eqn", "eq"].includes(tag)
            }
        }
    }
}
