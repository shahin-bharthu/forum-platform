import client from "../../lib/openSearchConnection.js";
import * as forumRepository from "../../features/forum/forumRepository.js";

export async function createForumIndex() {
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
                id: { type: 'keyword' },
                name: { type: 'text' },
                purpose: { type: 'text' }            
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


export const addDocumentsToForumIndex = async () => {
    const allForums = await forumRepository.getForums();

    for (const forum of allForums) {
        const document = {
            id: forum.id,
            name: forum.name,
            purpose: forum.purpose,
        };

        await addDocumentToForumIndex(document);
    }
};


export async function searchForumIndex(searchText) {
    const indexName = 'forum';

    try {
        const response = await client.search({
            index: indexName,
            body: {
            query: {
                // for exact match
                // multi_match: {
                // query: searchText,
                // fields: ['name', 'purpose']
                // }

                // for partial match, prefix match, name field has higher weight
                multi_match: {
                    query: `*${searchText}*`,
                    fields: ['name^4', 'purpose'],
                    type: 'phrase_prefix'
                }
            }
            }
        });
        console.log('Search results:', JSON.stringify(response, null, 2));
        return response.body.hits.hits;
    } catch (error) {
        console.error('Error searching index:', error);
    }
}