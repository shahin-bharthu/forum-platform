import {Client} from '@opensearch-project/opensearch';

const client = new Client({
    node: 'https://localhost:9200',
    auth: {
        username: 'admin',
        password: 'ForumProject@2024'
    },
    ssl: {
        rejectUnauthorized: false
    }
});

export default client;