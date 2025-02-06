import { log } from "console";
import client from "../lib/openSearchConnection.js";

export default async function createForumIndex() {
    const indexName = 'forum';

    const indexSettings = {
        settings: {
            index: {
                number_of_shards: 1,
                number_of_replicas: 1
            }
        },
        mappings: {
            properties: {
                name: { type: 'text' },
                purpose: { type: 'text' },
                createdBy: { type: 'keyword' },
                // created_at: { type: 'date' },
                // updated_at: { type: 'date' }
            }
        }
    };

    try {
        const response = await client.indices.create({
            index: indexName,
            body: indexSettings
        });
        console.log('Index created:', response);
    } catch (error) {
        console.error('Error creating index:', error);
    }
}

export async function addDocumentToForumIndex(document) {
    const indexName = 'forum';

    try {
        const response = await client.index({
            index: indexName,
            body: document
        });
        console.log('Document added:', response);
    } catch (error) {
        console.error('Error adding document:', error);
    }
}

export async function searchForumIndex(searchText) {
    const indexName = 'forum';

    try {
        const response = await client.search({
            index: indexName,
            body: {
            query: {
                multi_match: {
                query: searchText,
                fields: ['name', 'purpose']
                }
            }
            }
        });
        return response.body.hits.hits;
        // console.log('Search results:', JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('Error searching index:', error);
    }
}