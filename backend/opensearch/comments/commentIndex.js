import client from "../../lib/openSearchConnection.js";
import * as commentRepository from "../../features/comments/commentRepository.js";

export async function createCommentIndex() {
    const indexName = 'comment';

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
                content: { type: 'text' }            
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


export async function addDocumentToCommentIndex(document) {
    const indexName = 'comment';

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


export const addDocumentsToCommentIndex = async () => {
    const allComments = await commentRepository.getComments();

    for (const comment of allComments) {
        const document = {
            id: comment.id,
            content: comment.content,
        };

        await addDocumentToCommentIndex(document);
    }
};


export async function searchCommentIndex(searchText) {
    const indexName = 'comment';

    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    match_phrase_prefix: {
                        content: `${searchText}`
                    }
                }
            }
        });
        // console.log(`Search results for ${searchText} in ${indexName} index: ${JSON.stringify(response.body.hits.hits, null, 2)}`);
        return response.body.hits.hits;
    } catch (error) {
        console.error('Error searching index:', error);
    }
}