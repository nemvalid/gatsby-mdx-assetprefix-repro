
## Source (mdx)
```md
Internal link to page 2: [link to page 2](/page-2/)
```

## Prerequisites

- A gatsby site with `gatsby-plugin-mdx`
- MDX pages with internal links
- assetPrefix set in gatsby-config.js (`assetPrefix: 'https://cdn.example.com'`)
- gatsby build with the `--prefix-paths` flag
- check the site or inspect the page source of `/public/index.html`

## Issue

If you specify an `assetPrefix` in your gatsby config and build the site with `gatsby build --prefix-paths` then the link above will not work any more.  
The link href will become `https://cdn.example.com/page-2/` instead of `/page-2`.  
Please note that the `assetPrefix` is for assets only, it's not the site url.  
See the relevant pages in the official Gatsby documentation for [asset prefix](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/asset-prefix/) and [path prefix](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/).

**TLDR;**  
Asset prefix should only be applied to asset urls, it shouldn't affect link urls in the MDX page content.  
See the documentation for the `pathPrefix` node api helper ([https://www.gatsbyjs.com/docs/reference/config-files/node-api-helpers/#pathPrefix](https://www.gatsbyjs.com/docs/reference/config-files/node-api-helpers/#pathPrefix)):
<blockquote>
    Use to prefix resources URLs. pathPrefix will be either empty string or path that starts with slash and doesn’t end with slash. pathPrefix also becomes &lt;assetPrefix&gt;/&lt;pathPrefix&gt; when you pass both assetPrefix and pathPrefix in your gatsby-config.js.
    </blockquote>

## Details

This is because the `remark-path-prefix-plugin` (which is a default built-in plugin in `gatsby-plugin-mdx`) will prefix every link with `pathPrefix`, which also contains the assetPrefix (not just the base path) in this context.


Source of remark-path-prefix-plugin: [https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-mdx/src/remark-path-prefix-plugin.ts](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-mdx/src/remark-path-prefix-plugin.ts)  
How `pathPrefix` is being constructed: [https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/utils/api-runner-node.js#L451](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/utils/api-runner-node.js#L451) and [https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/utils/get-public-path.ts#L6-L22](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/utils/get-public-path.ts#L6-L22)

### Source of gatsby-config.js

```
module.exports = {
    assetPrefix: 'https://www.cdn.example.com',
    plugins: [
        `gatsby-plugin-mdx`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages`,
            },
        },
    ],
}
```


## Summary

gatsby-plugin-mdx should use `basePath` instead of `pathPrefix` in `remark-path-prefix-plugin` to apply the right path prefix from the gatsby config, **without applying the asset prefix** which is for static non-html assets (images, css, js, icons, fonts, etc).

