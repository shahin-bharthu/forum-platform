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
                purpose: { type: 'text' },
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
        // console.log(`Search results for ${searchText} in ${indexName} index:`, JSON.stringify(response, null, 2));
        return response.body.hits.hits;
    } catch (error) {
        console.error('Error searching index:', error);
    }
}


export async function updateDocumentOfForumIndex(document) {
    const indexName = 'forum';

    try {
        // Search for the document in the OpenSearch index using the document.id from the database
        const searchResponse = await client.search({
            index: indexName,
            body: {
                query: {
                    match: {
                        id: document.id
                    }
                }
            }
        });

        if (searchResponse.body.hits.hits.length === 0) {
            throw new Error(`Document with id ${document.id} not found in index`);
        }

        const openSearchDocumentId = searchResponse.body.hits.hits[0]._id;

        const response = await client.update({
            index: indexName,
            id: openSearchDocumentId,
            body: {
                doc: document
            }
        });
        console.log('Document updated:', response);
    } catch (error) {
        console.error('Error updating document:', error);
    }
}


export async function getAllDocumentsOfForumIndex() {
    const indexName = 'forum';

    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        console.log('All documents:', response.body.hits.hits);
    } catch (error) {
        console.error('Error getting all documents:', error);
    }
}


export async function deleteDocumentOfForumIndex(documentId) {
    const indexName = 'forum';

    try {
        // Search for the document in the OpenSearch index using the document.id from the database
        const searchResponse = await client.search({
            index: indexName,
            body: {
                query: {
                    match: {
                        id: documentId
                    }
                }
            }
        });

        if (searchResponse.body.hits.hits.length === 0) {
            throw new Error(`Document with id ${documentId} not found in index`);
        }

        const openSearchDocumentId = searchResponse.body.hits.hits[0]._id;

        const response = await client.delete({
            index: indexName,
            id: openSearchDocumentId
        });
        console.log('Document deleted:', response);
    } catch (error) {
        console.error('Error deleting document:', error);
    }
}