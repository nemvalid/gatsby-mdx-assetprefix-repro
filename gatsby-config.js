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