/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
         domains: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSP88lCpILsfyA5PvZj5OchdwMjKoubx02IZCA90Y_9sx5eOCAIxgTOl7e7b7Ut32vkRxhxYKvTZGylgPfohBU5YUpiF9Hu2UK9VNU0ahG8HOZgtp24A-h4qPU'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
