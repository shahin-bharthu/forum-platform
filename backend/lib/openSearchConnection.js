import {Client} from '@opensearch-project/opensearch';

const client = new Client({
    node: `https://localhost:${process.env.OPENSEARCH_NODE_PORT}`,
    auth: {
        username: process.env.OPENSEARCH_USERNAME,
        password: process.env.OPENSEARCH_PASSWORD
    },
    ssl: {
        rejectUnauthorized: false
    }
});

export default client;